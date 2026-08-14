import Jumbotron from "@templates/Jumbotron";
import { useCallback, useMemo, useState } from "react";
import { Row, Form, Col, Button } from "react-bootstrap";
import { FaAsterisk, FaCheck, FaEye, FaEyeSlash, FaMagnifyingGlass, FaPaperPlane, FaRotateRight, FaSpinner, FaUserPlus, FaXmark } from "react-icons/fa6";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function PostWrite() {

    //state
    const [post, setPost] = useState({
        postTitle: "",
        postContent: "",
        postPassword: ""
    });

    const [result, setResult] = useState({
        postTitle: "",
        postContent: "",
        postPassword: ""
    });

    const [visible, setVisible] = useState(false);

    //callback
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

    const checkPostPassword = useCallback(() => {
        const regex = /^(?=.*?[A-Z]+)(?=.*?[a-z]+)(?=.*?[0-9]+)(?=.*?[\!\@\#\$\%\^\&\*\(\)\-\_\=\+\[\]\{\}\'\"\`\~\<\>\.\,\/\?\\\|]+)[A-Za-z0-9\!\@\#\$\%\^\&\*\(\)\-\_\=\+\[\]\{\}\'\"\`\~\<\>\.\,\/\?\\\|]{8,16}$/;
        const valid = regex.test(post.postPassword);
        const clazz = valid ? "is-valid" : "is-invalid";
        setResult(prev => ({
            ...prev,
            postPassword: clazz
        }));
    }, [post]);

    //memo
    const allValid = useMemo(() => {
        if (result.postTitle !== "is-valid") return false; //필수
        if (result.postContent !== "is-valid") return false; //필수
        if (result.postPassword !== "is-valid") return false; //필수
        return true;
    }, [result]);

    //최종 등록
    const navigate = useNavigate();
    const send = useCallback(async () => {
        const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/post/`, post);
         console.log("응답:", response.data);
        toast.success("게시글 등록이 완료되었습니다");
        navigate("/anonymous");
    }, [post]);

    return (<>
        <Jumbotron title="게시글 작성" />

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

        {/* 비밀번호 */}
        <Row className="mt-4">
            <Form.Label column sm={3}>
                <span>비밀번호</span>
                <FaAsterisk className="text-danger"/>

                { visible.postPassword === true ? (
                <FaEye className="text-danger ms-4" onClick={e=>{
                    setVisible(prev=>({...prev, postPassword:false}))
                }}/>
                ) : (
                <FaEyeSlash className="text-secondary ms-4" onClick={e=>{
                    setVisible(prev=>({...prev, postPassword:true}))                    
                }}/>
                )}
            </Form.Label>
            <Col sm={9}>
                <Form.Control 
                    type={visible.postPassword ? "text" : "password"} inputMode="numeric" name="postPassword"
                    value={post.postPassword}
                    onChange={changeStringValue}
                    onBlur={checkPostPassword}
                    className={result.postPassword}
                    placeholder="대문자, 소문자, 숫자, 특수문자 포함 8~16글자 이내"/>
                <div className="valid-feedback">사용가능한 비밀번호 입니다</div>
                <div className="invalid-feedback">영문 대/소문자, 숫자, 특수문자를 1개이상 포함하여 8~16글자로 작성하세요</div>
            </Col>
        </Row>

        <Row className="my-5">
            <Col>
                <Button variant="success" size="lg" className="w-100"
                        disabled={allValid === false} onClick={send}>
                    <FaUserPlus className="me-2 mb-1"/>
                    <span>게시글 등록하기</span>
                </Button>
            </Col>
        </Row>
    </>)
}