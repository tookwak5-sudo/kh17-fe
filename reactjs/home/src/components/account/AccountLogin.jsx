import Jumbotron from "@templates/Jumbotron";
import { useCallback, useState } from "react";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import { FaRightToBracket } from "react-icons/fa6";
import { Button, Form } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import { loginUserState } from "@utils/storage";
import { useAtom, useSetAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import { loginActionState } from "@utils/storage";
import { authClient } from "@utils/reaxios";
import AccountBlock from "./AccountBlock";

export default function AccountLogin() {
    //state
    const [account, setAccount] = useState({
        accountId : "",
        accountPassword : "",
        needUpdate : "",
    });
    //jotai state
    //const [loginUser, setLoginUser] = useAtom(loginUserState)

    //쓰기 전용 atom
    // const [_, loginAction] = useAtom(loginActionState);
    const loginAction = useSetAtom(loginActionState);

    //navigate
    const navigate = useNavigate();

    //입력 
    const changeStringValue = useCallback(e=>{
        const {name ,value} = e.target;
        setAccount(prev=>({...prev, [name] : value}));
    }, []);
    //로그인
    const sendLogin = useCallback(async ()=>{
        //미입력시 차단
        if(account.accountId === "" && account.accountPassword === ""){
            await Swal.fire("모든 정보를 입력하세요");
           return;
        }
        try{
            // const {data} = await axios.post("/service/auth/login", account);
            const {data} = await authClient.post("/login", account);
            //로그인 성공 -> 데이터를 jotai storage에 저장하자
            console.log(data);
            // setLoginUser(data); // jotai storage에 저장 완료
            loginAction(data); //jotai setter atom 사용
            //console.log(data.needUpdate);
            if(data.needUpdate) { // 변경이 true면
                navigate("/account/needUpdate");
                return;
            }
            
            navigate("/");
        }
        catch(e) {
            if(e.response?.status === 403){
                navigate("/account/block");
                return;
            };
            //로그인 실패
            await Swal.fire("정보가 일치하지 않습니다");
        }
    }, [account]);

    return(<>
        <Jumbotron title="회원 로그인" content="로그인을 위한 정보를 입력해주세요"/>

        <Row className="mt-4">
            <Form.Label column sm={3}>아이디</Form.Label>
            <Col sm={9}>
            <Form.Control type="text" name="accountId" value={account.accountId}
                onChange={changeStringValue} placeholder="UserID"
                autoFocus/>
            </Col>
        </Row>

        <Row className="mt-4">
            <Form.Label column sm={3}>비밀번호</Form.Label>
            <Col sm={9}>
            <Form.Control type="password" name="accountPassword" value={account.accountPassword}
                onChange={changeStringValue} placeholder="Userpassword"/>
            </Col>
        </Row>

        <Row className="mt-5">
            <Col className="text-end">
                <Button variant = "success" size="lg" onClick={sendLogin}>
                    <FaRightToBracket/>
                    <span className="ms-2">로그인</span>
                </Button>
            </Col>
        </Row>
    </>)}