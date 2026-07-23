import Jumbotron from "@templates/Jumbotron";
import { useCallback, useEffect, useState } from "react";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import { FaLock } from "react-icons/fa6";
import { apiClient } from "@utils/reaxios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AccountPassword() {
    const navigate = useNavigate();
    
    //state
    const [account, setAccount] = useState({
        prevAccountPassword : "",
        newAccountPassword : ""
    });

    const [result, setResult] = useState(null); //피드백이 아니라 서버에서 오는 응답

    //callback
    const changeStringValue = useCallback(e=>{
        const { name, value } = e.target;
        setAccount(prev=>({
            ...prev,
            [name] : value
        }));
    }, []);

    const sendRequest = useCallback(async (e)=>{
        e.preventDefault(); //form 기본이벤트 차단

        if(account.prevAccountPassword === "") return;
        if(account.newAccountPassword === "") return;

        //axios는 더이상 사용불가
        const {data} = await apiClient.patch("/account/password", account);
        setResult(data); //data에 result랑 message가 들어있음
    }, [account]);

    //성공일 때만 토스트메세지 + 내정보 이동
    useEffect(()=>{
        if(result == null) return; //검사전 pass
        if(result.result !== true) return; //변경 실패 pass
        
        toast.success("비밀번호가 변경되었습니다");
        navigate("/account/mypage");
    }, [result]);

    return(<>
        <Jumbotron title="비밀번호 변경" content="현재 비밀번호와 변경하실 비밀번호를 입력해주세요"/>

        {/* result의 상태에 따라 메세지를 표시 */}
        { result !== null && (
        <Row className="mt-5">
            <Col>
                <Alert variant={result.result ? "success" : "danger"}>
                    {result.message}
                </Alert>
            </Col>
        </Row>
        )}

    <Form autoComplete="off" onSubmit={sendRequest}>
        <Row className="mt-4">
            <Form.Label column sm={3}>현재 비밀번호</Form.Label>
            <Col sm={9}>
                <Form.Control type="password" name="prevAccountPassword"
                    value={account.prevAccountPassword}
                    onChange={changeStringValue} autoFocus/>
            </Col>
        </Row>
        <Row className="mt-4">
            <Form.Label column sm={3}>새 비밀번호</Form.Label>
            <Col sm={9}>
                <Form.Control type="password" name="newAccountPassword"
                    vlaue={account.newAccountPassword}
                    onChange={changeStringValue}/>
            </Col>
        </Row>
        {/* <Row className="mt-5">
            <Form.Label column sm={3}>새 비밀번호 확인</Form.Label>
            <Col sm={9}>
                <Form.Control type="text" name="changePw"
                    placeholder="새 비밀번호 확인"/>
            </Col>
        </Row> */}

        <Row className="mt-5 text-end">
            <Col>
                <Button variant="danger" size="lg" className="w-md-auto" 
                    type="submit">
                    <FaLock className="me-2"/>
                    <span>비밀번호 변경하기</span>
                </Button>
            </Col>
        </Row>
    </Form>
    </>)
}