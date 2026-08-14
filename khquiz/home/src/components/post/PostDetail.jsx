import Jumbotron from "@templates/Jumbotron";
import { useCallback, useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Col, Row, Form, Modal } from "react-bootstrap";
import axios from "axios";
import { FaList, FaPenToSquare, FaPlus, FaTrash, FaXmark } from "react-icons/fa6";
export default function PostDetail() {
    const { postNo } = useParams();

    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [password, setPassword] = useState("");
    useEffect(() => {
        loadData();
    }, []);

    const loadData = useCallback(async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/post/${postNo}`);
            console.log(response.data);
            setPost(response.data);

        }
        catch (e) {
            console.log("요청 실패");
            console.log(error);
            console.log(error.response);
        }
    }, []);

    //모달
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);

    const handleShow = useCallback(() => {
        setShow(true);
    }, []);
     const handleShow2 = useCallback(() => {
        setShow2(true);
    }, []);

    const handleClose = useCallback(() => {
        setInput({ postPassword: "" });
        setShow(false);
    }, []);
    const handleClose2 = useCallback(() => {
        setInput({ postPassword: "" });
        setShow2(false);
    }, []);

    const changeStringValue = useCallback(e => {
        setInput(prev => ({
            ...prev,
            postPassword : e.target.value,
        }))
    }, []);

    //비밀번호 입력관련
    const [input, setInput] = useState({
        postPassword: ""
    });

    //비밀번호 확인
    const checkPassword = useCallback(async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/post/check`, {
                postNo: postNo,
                postPassword: input.postPassword
            });

            if (response.data !== true) {
                toast.error("비밀번호가 일치하지 않습니다");
                return false; //불일치
            }
            return true; //일치
        }
        catch(e){
            toast.error("오류 발생했습니다");
            return false;
        }
    }, [postNo,input])


    //삭제
    const deletePost = useCallback(async (e) => {
        const valid = await checkPassword();
        if (!valid) {
            return;
        }

        const response = await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/post/${postNo}`);
        toast.error("게시글 삭제가 완료되었습니다");
        setShow(false);
        navigate("/anonymous/");

    }, [checkPassword, postNo, navigate]);

    return (<>
        <Jumbotron title="게시글 상세" />

        <Row className="mt-5">
            <Col sm={3} className="text-info fw-bold">
                번호
            </Col>
            <span>{post?.postNo}</span>
        </Row>
        <Row className="mt-5">
            <Col sm={3} className="text-info fw-bold">
                제목
            </Col>
            <span>{post?.postTitle}</span>
        </Row>
        <Row className="mt-5">
            <Col sm={3} className="text-info fw-bold">
                내용
            </Col>
            <span>{post?.postContent}</span>
        </Row>

        <Row className="mt-5">
            <Col sm={3} className="text-info fw-bold">
                작성일
            </Col>
            <span>{post?.postCtime}</span>
        </Row>
        <Row className="mt-5">
            <Col sm={3} className="text-info fw-bold">
                수정일
            </Col>
            <span>{post?.postUtime}</span>
        </Row>

        <Row className="mt-5">
            <Col sm={3} className="text-info fw-bold">
                비밀번호
            </Col>

            <Form.Control
                type="password"
                value={input.postPassword || ""}
                onChange={(e) => {
                    setInput(prev => ({
                        ...prev,
                        postPassword: e.target.value
                    }));
                }}
            />
        </Row>

        {/* 게시글 삭제용 모달 */}
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>게시글 삭제</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Row>
                    <Form.Label column sm={3}>비밀번호 입력</Form.Label>
                    <Col sm={9}>
                        <Form.Control type="text" name="name"
                            value={input.postPassword}
                            onChange={changeStringValue} />
                    </Col>
                </Row>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="info" onClick={handleClose}>
                    <FaXmark className="ms-2" />
                    <span>닫기</span>
                </Button>
                <Button variant="danger" onClick={deletePost}>
                    <FaXmark className="ms-2" />
                    <span>삭제</span>
                </Button>
            </Modal.Footer>
        </Modal>

        {/* 게시글 수정창 이동용 모달 */}
        {/* 게시글 삭제용 모달 */}
        <Modal show={show2} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>게시글 수정</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Row>
                    <Form.Label column sm={3}>비밀번호 입력</Form.Label>
                    <Col sm={9}>
                        <Form.Control type="text" name="name"
                            value={input.postPassword}
                            onChange={changeStringValue} />
                    </Col>
                </Row>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="info" onClick={handleClose}>
                    <FaXmark className="ms-2" />
                    <span>닫기</span>
                </Button>
                <Button variant="secondary" as={Link} to={`/anonymous/${postNo}/edit`}>
                    <FaXmark className="ms-2" />
                    <span>수정창이동</span>
                </Button>
            </Modal.Footer>
        </Modal>

        <Row className="mt-5">
            <Col className="text-end">
                <Button className="ms-2" variant="danger"
                    onClick={handleShow}>
                    <FaTrash className="me-2" />
                    <span>삭제하기</span>
                </Button>
                <Button className="ms-2" variant="warning"
                    onClick={handleShow2}>
                    <FaPenToSquare className="me-2" />
                    <span>수정하기</span>
                </Button>
                <Button className="ms-2" variant="secondary"
                    as={Link} to="/anonymous">
                    <FaList className="me-2" />
                    <span>목록으로</span>
                </Button>
            </Col>
        </Row>
    </>)
}