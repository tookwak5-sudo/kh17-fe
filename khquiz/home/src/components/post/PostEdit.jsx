import Jumbotron from "@templates/Jumbotron";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Form,Button, Col, Row } from "react-bootstrap";
import { FaAsterisk, FaUserPlus } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function PostEdit() {
    const { postNo } = useParams();

    const [post, setPost] = useState({ //입력 데이터를 관리하는 state
        postTitle: "",
        postContent: ""
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = useCallback(async () => {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/post/${postNo}`);
        setPost(response.data);
    }, []);

    const [result, setResult] = useState({ //판정 결과를 관리하는 state
        postTitle: "",
        postContent: ""
    });

    const changeStringValue = useCallback(e => {
        const { name, value } = e.target;
        setPost(prev => ({
            ...prev,
            [name]: value
        }))
    }, []);

    const checkPostTitle = useCallback(() => {
        //공백여부 체크
        const valid = post.postTitle !== "";
        const clazz = valid ? "is-valid" : "is-invalid";
        setResult(prev => ({
            ...prev,
            postTitle: clazz
        }));
    }, [post]);

    const checkPostContent = useCallback(() => {
        //공백여부 체크
        const valid = post.postContent !== "";
        const clazz = valid ? "is-valid" : "is-invalid";
        setResult(prev => ({
            ...prev,
            postContent: clazz
        }));
    }, [post]);


    //최종 등록
    const navigate = useNavigate();
    const send = useCallback(async () => {
        const response = await axios.put(`${import.meta.env.VITE_SERVER_URL}/api/post/${postNo}`, post);
        toast.success("게시글 수정이 완료되었습니다");
        navigate(`/anonymous/${postNo}`);
    }, [post]);

    //memo
    const allValid = useMemo(() => {
        if (result.postTitle !== "is-valid") return false; //필수
        if (result.postContent !== "is-valid") return false; //필수
        return true;
    }, [result]);


    return (<>
        <Jumbotron title="게시글 수정" />

        {/* 제목 */}
        <Row className="mt-4">
            <Form.Label column sm={3}>
                <span>제목</span>
                <FaAsterisk className="text-danger" />
            </Form.Label>
            <Col sm={9}>
                <Form.Control type="text" name="postTitle"
                    className={result.postTitle}
                    value={post.postTitle}
                    onChange={changeStringValue}
                    onBlur={checkPostTitle}
                />
                <div className="valid-feedback">제목이 설정되었습니다</div>
                <div className="invalid-feedback">빈칸은 불가능합니다   </div>
            </Col>
        </Row>

        {/* 내용 */}
        <Row className="mt-4">
            <Form.Label column sm={3}>
                <span>본문</span>
                <FaAsterisk className="text-danger" />
            </Form.Label>
            <Col sm={9}>
                <Form.Control as="textarea" name="postContent"
                    className={result.postContent}
                    value={post.postContent} rows={5}
                    onChange={changeStringValue}
                    onBlur={checkPostContent}
                />
                <div className="valid-feedback">내용이 설정되었습니다</div>
                <div className="invalid-feedback">빈칸은 불가능합니다   </div>
            </Col>
        </Row>

        <Row className="my-5">
            <Col>
                <Button variant="success" size="lg" className="w-100"
                        disabled={allValid === false} onClick={send}>
                    <FaUserPlus className="me-2 mb-1"/>
                    <span>게시글 수정하기</span>
                </Button>
            </Col>
        </Row>
    </>)
}