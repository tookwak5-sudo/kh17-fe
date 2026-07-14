import Jumbotron from "@templates/Jumbotron";
import { useCallback, useMemo, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { FaAsterisk, FaMagnifyingGlass, FaUserPlus, FaXmark } from "react-icons/fa6";
import axios from "axios";

export default function AccountJoin(){
    //state
    const [account, setAccount] = useState({
        accountId: "",
        accountPassword: "",
        accountPassword2: "", //빼고 보내는 거 잊지말기
        accountEmail: "",
        accountNickname: "",
        accountBirth: "",
        accountContact: "",
        accountPost: "",
        accountAddress1: "",
        accountAddress2: "",
        accountMessage: "",
    });

    const [result, setResult] = useState({
        accountId: { clazz : null , code : null},
        accountPassword: null,
        accountPassword2: null, //빼고 보내는 거 잊지말기
        accountEmail: null,
        accountNickname: null,
        accountBirth: null,
        accountContact: null,
        accountPost: null,
        accountAddress1: null,
        accountAddress2: null,
        accountMessage: null,
    });
    
    //callback
    //-입력
    const changeStringValue = useCallback(e=>{
        const {name, value} = e.target;
        setAccount(prev=>({
            ...prev,
            [name] : value
        }));
    }, []);

    //검사하여 결과를 갱신하는 함수들
    const checkAccountId = useCallback(async e=>{
        const regex = /^[a-z][a-z0-9]{4,19}$/;
        const valid = regex.test(account.accountId);
        if(valid === false){
            setResult(prev=>({
                ...prev, 
                accountId : { clazz : "is-invalid", code : "format" }
            }));
            return;
        }
        //형식 통과
        const response = await axios.get(`/api/account/check-id/${account.accountId}`);
        const clazz = response.data === true ? "is-valid" : "is-invalid";
        const code = response.data === true ? null : "duplicate";
        setResult(prev=>({
            ...prev, 
            accountId : { clazz : clazz, code : code }
        }));
    }, [account]);

    const checkAccountPassword = useCallback(()=>{
        const regex = /^(?=.*?[A-Z]+)(?=.*?[a-z]+)(?=.*?[0-9]+)(?=.*?[\!\@\#\$\%\^\&\*\(\)\-\_\=\+\[\]\{\}\'\"\`\~\<\>\.\,\/\?\\\|]+)[A-Za-z0-9\!\@\#\$\%\^\&\*\(\)\-\_\=\+\[\]\{\}\'\"\`\~\<\>\.\,\/\?\\\|]{8,16}$/;
        const valid = regex.test(account.accountPassword);
        const clazz = valid ? "is-valid" : "is-invalid";

        //비밀번호 확인
        const valid2 = account.accountPassword.length > 0 
                && account.accountPassword === account.accountPassword2;
        const clazz2 = valid2 ? "is-valid" : "is-invalid";
        setResult(prev=>({
            ...prev, 
            accountPassword : clazz,
            accountPassword2 : clazz2
        }));
    }, [account]);

    const checkAccountEmail = useCallback(()=>{
        const regex = /^([a-z][a-z0-9]{4,19})@([A-Za-z0-9\-\.]{1,})(\.[a-z]{2,3})$/;
        const valid = regex.test(account.accountEmail);
        const clazz = valid ? "is-valid" : "";
        setResult(prev=>({...prev, accountEmail : clazz}));
    }, [account]);

    const checkAccountNickname = useCallback(()=>{
        const regex = /^[가-힣A-Za-z0-9]{1,10}$/;
        const valid = regex.test(account.accountNickname);
        const clazz = valid ? "is-valid" : "";
        setResult(prev=>({...prev, accountNickname : clazz}));
    }, [account]);

    const checkAccountBirth = useCallback(()=>{
        const regex = /^([0-9]{4})-(((02)-(0[1-9]|1[0-9]|2[0-9]))|((0[469]|11)-(0[1-9]|1[0-9]|2[0-9]|30))|((0[13578]|1[02])-(0[1-9]|1[0-9]|2[0-9]|3[01])))$/;
        const valid = account.accountBirth.length !== "" || regex.test(account.accountBirth);
        const clazz = valid ? "is-valid" : "is-invalid";
        setResult(prev=>({...prev, accountBirth : clazz}));
    }, [account]);

    const checkAccountContact = useCallback(()=>{
        const regex = /^010[1-9][0-9]{7}$/;
        const valid = account.accountContact.length !== "" || regex.test(account.accountContact);
        const clazz = valid ? "is-valid" : "is-invalid";
        setResult(prev=>({...prev, accountContact : clazz}));
    }, [account]);

    const checkAccountAddress = useCallback(()=>{
    const empty = account.accountPost === "" && account.accountAddress1 === "" && account.accountAddress2 === "";
    const fill = account.accountPost !== "" && account.accountAddress1 !== "" && account.accountAddress2 !== "";
    const valid = empty || fill;
    const clazz = valid ? "is-valid" : "is-invalid";
    setResult(prev=>({
        ...prev, 
        accountPost : clazz,
        accountAdderss1 : clazz,
        accountAdderss2 : clazz
    }));
    }, [account]);

    const checkAccountMessage = useCallback(()=>{
        setResult(prev=>({...prev, accountMessage : "is-valid"}));
    }, [account]);

    const allValid = useMemo(()=>{
        if(result.accountId.clazz !== "is-valid") return false; //필수
        if(result.accountPassword !== "is-valid") return false; //필수
        if(result.accountPassword2 !== "is-valid") return false; //필수
        if(result.accountNickname !== "is-valid") return false; //필수
        if(result.accountEmail !== "is-valid") return false; //필수
        if(result.accountBirth === "is-invalid") return false; //선택
        if(result.accountContact === "is-invalid") return false; //선택
        if(result.accountPost === "is-invalid") return false; //선택
        if(result.accountAddress1 === "is-invalid") return false; //선택
        if(result.accountAddress2 === "is-invalid") return false; //선택
        if(result.accountMessage === "is-invalid") return false; //선택

        return true;
    }, [result]);

    //view
    return(<>
        <Jumbotron title="가입 정보 입력" content="부정확한 정보 입력이 환인된 경우 계정 이용 불가능합니다"/>

        <Row className="mt-4">
            <Form.Label column sm={3}>
                <span>아이디</span>
                <FaAsterisk className="text-danger"/>
            </Form.Label>
            <Col sm={9}>
                <Form.Control type="text" name="accountId"
                    value={account.accountId}
                    onChange={changeStringValue}
                    onBlur={checkAccountId}
                    className={result.accountId.clazz}
                    placeholder="알파벳 소문자 시작, 숫자 포험 5~20자 이내"/>
                <div className="valid-feedback">아이디 설정이 완료되었습니다</div>
                <div className="invalid-feedback">
                    {result.accountId.code === "format" && (<>
                        영문소문자로 시작하며 숫자 포함 5~20글자로 작성해야 합니다.
                    </>) }
                    {result.accountId.code === "duplicate" && (<>
                        이미 사용중입니다. 다른 아이디를 작성하세요.
                    </>) } 
                </div>
            </Col>
        </Row>

        <Row className="mt-4">
            <Form.Label column sm={3}>
                <span>비밀번호</span>
                <FaAsterisk className="text-danger"/>
            </Form.Label>
            <Col sm={9}>
                <Form.Control type="password" inputMode="numeric" name="accountPassword"
                    value={account.accountPassword}
                    onChange={changeStringValue}
                    onBlur={checkAccountPassword}
                    className={result.accountPassword}
                    placeholder="대문자, 소문자, 숫자, 특수문자 포함 8~16글자 이내"/>
                <div className="valid-feedback">사용가능한 비밀번호 입니다</div>
                <div className="invalid-feedback">영문 대/소문자, 숫자, 특수문자를 1개이상 포함하여 8~16글자로 작성하세요</div>
            </Col>
        </Row>

        <Row className="mt-4">
            <Form.Label column sm={3}>
                <span>비밀번호확인</span>
                <FaAsterisk className="text-danger"/>
            </Form.Label>
            <Col sm={9}>
                <Form.Control type="password" inputMode="numeric" name="accountPassword2"
                    value={account.accountPassword2}
                    onChange={changeStringValue}
                    onBlur={checkAccountPassword}
                    className={result.accountPassword2}
                    placeholder="비밀번호를 한번 더 입력하세요"/>
                <div className="valid-feedback">입력하신 비밀번호와 일치합니다</div>
                <div className="invalid-feedback">비밀번호를 입력하시거나 비밀번호가 일치하지 않습니다</div>
            </Col>
        </Row>

        <Row className="mt-4">
            <Form.Label column sm={3}>
                <span>이메일</span>
                <FaAsterisk className="text-danger"/>
            </Form.Label>
            <Col sm={9}>
                <Form.Control type="text" inputMode="email" name="accountEmail"
                    value={account.accountEmail}
                    onChange={changeStringValue}
                    onBlur={checkAccountEmail}
                    className={result.accountEmail}
                    placeholder=""/>
                <div className="valid-feedback">사용가능한 이메일입니다</div>
                <div className="invalid-feedback">형식오류 or 이미 사용중인 이메일입니다</div>
            </Col>
        </Row>

        <Row className="mt-4">
            <Form.Label column sm={3}>
                <span>닉네임</span>
                <FaAsterisk className="text-danger"/>
            </Form.Label>
            <Col sm={9}>
                <Form.Control type="text" name="accountNickname"
                    value={account.accountNickname}
                    onChange={changeStringValue}
                    onBlur={checkAccountNickname}
                    className={result.accountNickname}
                    placeholder=""/>
                <div className="valid-feedback">사용가능한 닉네임입니다</div>
                <div className="invalid-feedback">형식오류 or 이미 사용중인 닉네임입니다</div>
            </Col>
        </Row>

        <Row className="mt-4">
            <Form.Label column sm={3}>
                <span>생년월일</span>
            </Form.Label>
            <Col sm={9}>
                <Form.Control type="date" name="accountBirth"
                    value={account.accountBirth}
                    onChange={changeStringValue}
                    onBlur={checkAccountBirth}
                    className={result.accountBirth}
                    placeholder=""/>
                <div className="valid-feedback"></div>
            </Col>
        </Row>

        <Row className="mt-4">
            <Form.Label column sm={3}>
                <span>연락처</span>
            </Form.Label>
            <Col sm={9}>
                <Form.Control type="text" inputMode="numeric" name="accountContact"
                    value={account.accountContact}
                    onChange={changeStringValue}
                    onBlur={checkAccountContact}
                    className={result.accountContact}
                    placeholder=""/>
                <div className="invalid-feedback">연락처 형식이 올바르지 않습니다</div>
            </Col>
        </Row>

        <Row className="mt-4">
            <Form.Label column sm={3}>
                <span>주소</span>
            </Form.Label>
            <Col sm={9}>
                <Form.Control type="text" name="accountPost"
                    value={account.accountPost}
                    onChange={changeStringValue}
                    className={`${result.accountPost} w-auto d-inline-block`}
                    placeholder="우편번호"/>
                    <Button variant="success" className="ms-2">
                        <FaMagnifyingGlass/>
                        <span className="d-none d-md-inline-block">우편번호</span>
                    </Button>
                    <Button variant="danger" className="ms-2">
                        <FaXmark/>
                        <span className="d-none d-md-inline-block">작성내역 지우기</span>
                    </Button>
            </Col>
        </Row>
        <Row className="mt-2">
            {/* <Col sm={9} className="offset-sm-3"> */}
            <Col sm={{span: 9, offset: 3}}>
                <Form.Control type="text" name="accountAddress1"
                    value={account.accountAddress1}
                    onChange={changeStringValue}
                    className={result.accountAddress1}
                    placeholder="기본주소"/>
            </Col>
        </Row>
        <Row className="mt-2">
            <Col sm={ {span: 9, offset: 3}}>
                <Form.Control type="text" name="accountAddress2"
                    value={account.accountAddress2}
                    onChange={changeStringValue}
                    onBlur={checkAccountAddress}
                    className={result.accountAddress2}
                    placeholder="상세주소"/>
                <div className="invalid-feedback">주소는 비우거나 모두 작성해야 합니다</div>
            </Col>
        </Row>

        <Row className="mt-4">
            <Form.Label column sm={3}>
                <span>상태메세지</span>
            </Form.Label>
            <Col sm={9}>
                <Form.Control as="textarea" name="accountMessage"
                    value={account.accountMessage}
                    onChange={changeStringValue} rows={5}
                    onBlur={checkAccountMessage}
                    className={result.accountMessage}/>
            </Col>
        </Row>

        <Row className="my-5">
            <Col>
                <Button variant="success" size="lg" className="w-100"
                        disabled={allValid === false}>
                    <FaUserPlus className="me-2 mb-1"/>
                    <span>회원 가입하기</span>
                </Button>
            </Col>
        </Row>
    </>)
}