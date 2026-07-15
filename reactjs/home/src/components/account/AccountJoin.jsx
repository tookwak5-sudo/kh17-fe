import Jumbotron from "@templates/Jumbotron";
import { useCallback, useMemo, useRef, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { FaAsterisk, FaCheck, FaEye, FaEyeSlash, FaMagnifyingGlass, FaPaperPlane, FaRotateRight, FaSpinner, FaUserPlus, FaXmark } from "react-icons/fa6";
import axios from "axios";
import { useKakaoPostcodePopup } from "react-daum-postcode";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function AccountJoin(){
    //kakao post
    const open = useKakaoPostcodePopup(
        "//t1.kakaocdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
    );

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
        accountEmail: { clazz : null, code : null },
        accountNickname: { clazz : null , code : null},
        accountBirth: null,
        accountContact: null,
        accountPost: null,
        accountAddress1: null,
        accountAddress2: null,
        accountMessage: null,
    });
     //비밀번호와 비밀번호 확인을 한번에 다루겠다
    // const [visible, setVisible] = useState(false);
    // 따로 다루겠다
    const [visible, setVisible] = useState({
        accountPassword : false,
        accountPassword2 : false
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
    const changeAccountEmail = useCallback(e=>{ 
        //인증이 끝났는데 입력을 다시 한 경우 → 인증완료를 없던 일로 한다
        if(result.accountEmail.clazz === "is-valid") {
            setResult(prev=>({
                ...prev,
                accountEmail : { clazz : null , code : null }
            }));
        }
        setAccount(prev=>({
            ...prev,
            accountEmail : e.target.value
        }));
    }, [result]);

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

    const checkAccountEmail = useCallback(async (e)=>{
        const regex = /^([a-z][a-z0-9]{4,19})@([A-Za-z0-9\-\.]{1,})(\.[a-z]{2,3})$/;
        const valid = regex.test(account.accountEmail);
        if(valid === false) { //형식 위반
            setResult(prev=>({
                ...prev,
                accountEmail : { clazz : "is-invalid", code : "format"}
            }));
            return;
        }
        //형식 통과 → 중복 검사
        const { data } = await axios.get(`/api/account/check-email/${account.accountEmail}`);
        const clazz = data ? "" : "is-invalid"; //형식과 중복검사를 통과하더라도 아직 인증번호가 남아있음
        const code = data ? null : "duplicate";
        setResult(prev=>({
            ...prev, 
            accountEmail : { clazz : clazz, code : code }
        }));
    }, [account]);

    const checkAccountNickname = useCallback(async ()=>{
        const regex = /^[가-힣A-Za-z0-9]{1,10}$/;
        const valid = regex.test(account.accountNickname);
        if(valid === false) { //형식 위반
            setResult(prev=>({
                ...prev,
                accountNickname : { clazz : "is-invalid", code : "format" }
            }));
            return;
        }

        //형식 통과 → 중복검사(response대신 data값을 직접 넣어줄 수도 있다)
        const { data } = await axios.get(`/api/account/check-nickname/${account.accountNickname}`);
        const clazz = data ? "is-valid" : "is-invalid";
        const code = data ? null : "duplicate";
        setResult(prev=>({
            ...prev, 
            accountNickname : { clazz : clazz , code : code }
        }));
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
            accountAddress1 : clazz,
            accountAddress2 : clazz
        }));
    }, [account]);

    const checkAccountMessage = useCallback(()=>{
        setResult(prev=>({...prev, accountMessage : "is-valid"}));
    }, [account]);

    //ref
    // - 태그 참조용 동기방식의 데이터(많이 쓰면 쓸수록 느려짐)
    // - 태그를 제어하는 리모컨으로 사용
    // - 언제 어디서나 일정한 값을 가져야하는 데이터에 사용 (로딩중과 같은 상태 데이터)
    // - 문법 : const 변수 = useRef(초기값);
    const address2ref = useRef();

    //우편번호 처리
    const addressSearch = useCallback((e)=>{
        // 이벤트발생이 입력창이고 입력창에 이미 글자가 있다면(e필요)
        console.log(e);
        const { tagName, value } = e.target;
        if(tagName === "INPUT" && value !== "") return;

        open({
            onComplete : (data) =>{
                // console.log(data)
                //- userSelectedType : 선택한 주소의 유형 (R or J)
                //- roadAddress : 도로명 주소(신주소)
                //- jibunAddress : 지번 주소(구주소)
                //- zonecode : 우편번호
                const zonecode = data.zonecode;
                const address = data.userSelectedType === "R" ? 
                        data.roadAddress : data.jibunADdress;
                
                //주소 변경
                setAccount(prev=>({
                    ...prev,
                    accountPost : zonecode,
                    accountAddress1 : address,
                    accountAddress2 : "",
                }));

                //상세 주소창에 포커스를 줄 수 있나?
                //기존코드(태그 선택 후 명령을 사용)(가능) 리액트 개발자도구에 안나오기 때문에 꺼려함
                // document.querySelector("[name=accountAddress2").focus();

                //리액트는? ref의 current필드를 사용
                address2ref.current.focus();
            }
        });
    }, []);

    //주소삭제
    const clearAddress = useCallback((e)=>{
        // console.log(e.target); //실제 이벤트 발생 대상
        // console.log(e.currentTarget); //기존의 this와 완전히 같은역할
        if(parseInt(e.currentTarget.style.opacity) === 0) return;
        
        //입력값 초기화
        setAccount(prev=>({
            ...prev, 
            accountPost : "",
            accountAddress1 : "",
            accountAddress2 : "",
        }));
        //검사결과 초기화
        setResult(prev=>({
            ...prev,
            accountPost : null,
            accountAddress1 : null,
            accountAddress2 : null,
        }))
    }, []);

    //주소 삭제버튼이 나와야되는지 판정하기 위한 memo
    const isAddressWritten = useMemo(()=>{
        if(account.accountPost !== "") return true;
        if(account.accountAddress1 !== "") return true;
        if(account.accountAddress2 !== "") return true;
        return false;
    }, 
    [
        account.accountPost, 
        account.accountAddress1, 
        account.accountAddress2
    ]);

    //이메일 인증 관련 기능들
    const sendCert = useCallback(async ()=>{
        //다시 보내기 일수도 있으니 result의 accountEmail의 상태를 초기화한다
        setResult(prev=>({
            ...prev,
            accountEmail : { clazz : null , code : null }
        }),[]);
        setCertNumberResult(null);
        setCertNumber("");
        try {
            setSending(true);
            const response = await axios.post(
            "/service/cert/send",
            {certEmail : account.accountEmail}
            );
            console.log("이메일 발송 완료");
        }
        catch(e) {
            toast.error("이메일 발송 오류 발생");
        }
        finally {
            setSending(false); //오류 여부 상관없이 false
        }
    }, [account.accountEmail]);

    //인증번호 관련 state
    const [certNumber, setCertNumber] = useState(""); //처음에 비어있다고 (문자열)
    const [certNumberResult , setCertNumberResult] = useState(null);
    const [sending, setSending] = useState(null); //이메일 발송중 여부 상태(null(발송중) / true(발송) / false(미발송))

    const changeCertNumber = useCallback(e=>{
        const regex = /[^0-9]+/g;
        const replacement = e.target.value.replace(regex, "");
        setCertNumber(replacement);
    }, []);

    const checkCert = useCallback(async ()=>{
        //data는 CertCheckResponseVO의 valid값
        const { data } = await axios.post(
            "/service/cert/check",
            { certEmail : account.accountEmail, certNumber : certNumber}
        );
        // console.log("결과 : ", data.valid);
        setCertNumberResult(data.valid ? "is-valid" : "is-invalid");
        if(data.valid) { //인증결과가 성공이라면
            // result에 있는 accountEmail의 clazz에 is-valid를 넣어라
            setResult(prev=>({
                ...prev,
                accountEmail : { clazz : "is-valid" , code : null }
            }));
        }
    }, [account.accountEmail, certNumber]);

    //memo
    const allValid = useMemo(()=>{
        if(result.accountId.clazz !== "is-valid") return false; //필수
        if(result.accountPassword !== "is-valid") return false; //필수
        if(result.accountPassword2 !== "is-valid") return false; //필수
        if(result.accountNickname.clazz !== "is-valid") return false; //필수
        if(result.accountEmail.clazz !== "is-valid") return false; //필수
        if(certNumberResult !== "is-valid") return false; //인증번호

        if(result.accountBirth === "is-invalid") return false; //선택
        if(result.accountContact === "is-invalid") return false; //선택
        if(result.accountPost === "is-invalid") return false; //선택
        if(result.accountAddress1 === "is-invalid") return false; //선택
        if(result.accountAddress2 === "is-invalid") return false; //선택
        if(result.accountMessage === "is-invalid") return false; //선택

        return true;
    }, [result, certNumberResult]);

    // 최종 가입
    const navigate = useNavigate();
    const sendJoin = useCallback(async ()=>{
        try {
            // const copy = {...acount};
            // delete copy.acountPassword2; //아래 구조분해 할당 or 두줄 코드
            const { accountPassword2, ...copy } = account;
            const response = await axios.post("/api/account/", copy);
            toast.success("회원가입이 완료되었습니다");
            //navigate(성공페이지);
        }
        catch(e) {
            toast.error("회원 가입 과정에서 오류가 발생했습니다");
            //
        }
    }, [account]);

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

                { visible.accountPassword === true ? (
                <FaEye className="text-danger ms-4" onClick={e=>{
                    setVisible(prev=>({...prev, accountPassword:false}))
                }}/>
                ) : (
                <FaEyeSlash className="text-secondary ms-4" onClick={e=>{
                    setVisible(prev=>({...prev, accountPassword:true}))                    
                }}/>
                )}
            </Form.Label>
            <Col sm={9}>
                <Form.Control 
                    type={visible.accountPassword ? "text" : "password"} inputMode="numeric" name="accountPassword"
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
                 { visible.accountPassword2 === true ? (
                <FaEye className="text-danger ms-4" onClick={e=>{
                    setVisible(prev=>({...prev, accountPassword2:false}))
                }}/>
                ) : (
                <FaEyeSlash className="text-secondary ms-4" onClick={e=>{
                    setVisible(prev=>({...prev, accountPassword2:true}))                    
                }}/>
                )}
            </Form.Label>
            <Col sm={9}>
                <Form.Control 
                type={visible.accountPassword2 ? "text" : "password" } inputMode="numeric" name="accountPassword2"
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
                <div className="d-flex flex-wrap">
                    <Form.Control type="text" inputMode="email" name="accountEmail"
                        value={account.accountEmail}
                        onChange={changeAccountEmail}
                        onBlur={checkAccountEmail}
                        className={`${result.accountEmail.clazz} w-auto d-inline-block`}
                        readOnly={sending}/>
                    {/* 인증번호 발송버튼 */}
                    <Button variant={sending === false ? "danger" : "info"} 
                            className="ms-2" onClick={sendCert}
                            disabled={
                                result.accountEmail.clazz === null//처음상태
                                || result.accountEmail.clazz === "is-invalid" //형식오류 or 중복 문제 발생시
                                || sending === true // 보내는 중일 때
                            }>
                        { sending === null && (<>
                        <FaPaperPlane/>
                        <span className="ms-2 d-none d-sm-inline">인증번호 보내기</span>
                        </>)}
                        { sending === false && (<>
                        <FaRotateRight/>
                        <span className="ms-2 d-none d-sm-inline">메일 다시보내기</span>
                        </>)}
                        { sending === true && (<>
                            <FaSpinner className="spin"/>
                            <span className="ms-2 d-none d-sm-inline">인증번호 발송중</span>
                        </>)}
                    </Button>
                    <div className="valid-feedback">사용가능한 이메일입니다</div>
                    <div className="invalid-feedback">
                        { result.accountEmail.code === "format" && (<>
                            올바르지 않은 이메일 형식입니다.
                        </>) }
                        { result.accountEmail.code === "duplicate" && (<>
                            이미 사용중인 이메일입니다.
                        </>) }
                     </div>
                </div>
            </Col>
        </Row>

        {/* 인증번호 입력화면은 발송이 완료된 경우 + 인증완료가 안된 상황에서만 나와야 함 */}
        { ( result.accountEmail.clazz !== "is-valid" && sending === false) && (
            <Row className="mt-2">
                <Col sm={ {sm : 9, offset : 3}}>
                    <div className="d-flex flex-wrap">
                        <Form.Control type="text" placeholder="인증번호"
                            value={certNumber} onChange={changeCertNumber}
                            className={`w-auto ${certNumberResult}`}/>
                        {/* 인증번호 확인버튼 */}
                        <Button variant ="success" className="ms-2" onClick={checkCert}>
                            <FaCheck/>
                            <span className="ms-2 d-none d-sm-inline">인증번호 확인</span>
                        </Button>
                        <div className="valid-feedback">인증번호가 확인이 완료되었습니다</div>
                        <div className="invalid-feedback">인증번호가 일치하지 않습니다</div>
                    </div>
                </Col>
            </Row>
        )}
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
                    className={result.accountNickname.clazz}
                    placeholder="한글, 영문, 숫자 10자 이내"/>
                <div className="valid-feedback">사용가능한 닉네임입니다</div>
                <div className="invalid-feedback">
                    {result.accountNickname.code === "format" && (<>
                       한글, 영문, 숫자 10글자 이내로 작성해야합니다.
                    </>)}
                    {result.accountNickname.code === "duplicate" && (<>
                        이미 사용중인 닉네임입니다.
                    </>) }
                </div>
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
                <div className="d-flex">
                    {/* 우편번호 입력창 */}
                    <Form.Control type="text" name="accountPost"
                        value={account.accountPost}
                        readOnly onClick={addressSearch}
                        className={`${result.accountPost} w-auto d-inline-block`}
                        placeholder="우편번호"/>
                        {/* 검색버튼 */}
                        <Button variant="success" className="ms-2" onClick={addressSearch}>
                            <FaMagnifyingGlass/>
                            <span className="d-none d-md-inline-block">우편번호</span>
                        </Button>
                        {/* 지우기 버튼 */}
                        {/* { isAddressWritten === true && (
                            <Button variant="danger" className="ms-2" onClick={clearAddress}>
                                <FaXmark/>
                                <span className="d-none d-md-inline-block">작성내역 지우기</span>
                            </Button>
                        )} */}
                        <Button variant="danger" className="ms-2" onClick={clearAddress}
                                style={
                                    {//부드럽게 변하려면 중간상태가 존재해야함
                                        opacity : isAddressWritten === true ? 100 : 0,
                                        transition : "opacity 0.1s ease-out",
                                        cursor : isAddressWritten ? "pointer" : "default",
                                    }
                                }>
                            <FaXmark/>
                            <span className="d-none d-md-inline-block">작성내역 지우기</span>
                        </Button>
                </div>
            </Col>
        </Row>
        <Row className="mt-2">
            {/* <Col sm={9} className="offset-sm-3"> */}
            <Col sm={{span: 9, offset: 3}}>
                <Form.Control type="text" name="accountAddress1"
                    value={account.accountAddress1}
                    readOnly onClick={addressSearch}
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
                    placeholder="상세주소"
                    ref={address2ref}
                    />
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
                        disabled={allValid === false} onClick={sendJoin}>
                    <FaUserPlus className="me-2 mb-1"/>
                    <span>회원 가입하기</span>
                </Button>
            </Col>
        </Row>
    </>)
}