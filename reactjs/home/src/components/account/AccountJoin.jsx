import Jumbotron from "@templates/Jumbotron";
import { useCallback, useMemo, useRef, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { FaAsterisk, FaEye, FaEyeSlash, FaMagnifyingGlass, FaUserPlus, FaXmark } from "react-icons/fa6";
import axios from "axios";
import { useKakaoPostcodePopup } from "react-daum-postcode";

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
        accountEmail: null,
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

    //memo
    const allValid = useMemo(()=>{
        if(result.accountId.clazz !== "is-valid") return false; //필수
        if(result.accountPassword !== "is-valid") return false; //필수
        if(result.accountPassword2 !== "is-valid") return false; //필수
        if(result.accountNickname.clazz !== "is-valid") return false; //필수
        if(result.accountEmail !== "is-valid") return false; //필수
        if(result.accountBirth === "is-invalid") return false; //선택
        if(result.accountContact === "is-invalid") return false; //선택
        if(result.accountPost === "is-invalid") return false; //선택
        if(result.accountAddress1 === "is-invalid") return false; //선택
        if(result.accountAddress2 === "is-invalid") return false; //선택
        if(result.accountMessage === "is-invalid") return false; //선택

        return true;
    }, [result]);

    //ref
    // - 태그 참조용 동기방식의 데이터(많이 쓰면 쓸수록 느려짐)
    // - 태그를 제어하는 리모컨으로 사용
    // - 언제 어디서나 일정한 값을 가져야하는 데이터에 사용 (로딩중과 같은 상태 데이터)
    // - 문법 : const 변수 = useRef(초기값);
    const address2ref = useRef();

    //우편번호 처리
    const addressSearch = useCallback(()=>{
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

    //x버튼
    const addressErase = useCallback((e)=>{
        setAccount(prev=>({
            ...prev, 
            accountPost : "",
            accountAddress1 : "",
            accountAddress2 : "",
        }))
    }, []);

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
                        {visible2 && (
                             <Button variant="danger" className="ms-2" onClick={addressErase}>
                            <FaXmark/>
                            <span className="d-none d-md-inline-block">작성내역 지우기</span>
                            </Button>
                        )}
                       
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
                        disabled={allValid === false}>
                    <FaUserPlus className="me-2 mb-1"/>
                    <span>회원 가입하기</span>
                </Button>
            </Col>
        </Row>
    </>)
}