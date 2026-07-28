import Jumbotron from "@templates/Jumbotron";
import { useAtomValue } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Col, Placeholder, Row } from "react-bootstrap";
import { FaLock, FaSquarePen } from "react-icons/fa6";
import { Link, useParams } from "react-router-dom";
import { apiClient } from "@utils/reaxios";
import { loginUserState } from "@utils/storage";
import { toast } from "react-toastify";
import { authClient } from "@utils/reaxios";
import LoadingText from "@templates/LoadingText";

export default function AdminUserDetail() {

    //Route에 선언된 파라미터 정보 읽어오기
    //react가 제공하는 공식툴 주소에 포함된 데이터(경로변수들 params든 상관없이)를 가져옴
    //만약 state를 쓰고 싶다면 customHook을 만들어 줘야함
    // 딱 한번만 최초 시점에 누구보다 빠르게 불러오는 처리 담당 (불변)
    const { accountId } = useParams();

    //변경이 가능한 정보를 불러오기, 초기값을 넣어놓은 객체거나 null인 객체가 들어옴 현 상황에서는 null
    const [account, setAccount] = useState(null);
    useEffect(() => {//최초의 한번만 불러올 때 useEffect사용
        loadData();
    }, []); //연관함수에선 
            //바깥변수(params.. 등 x)는 불러오지 않음
            //memo, callback에서 쓰임
            //가변인 변수들을 감지할 때 사용

    const loadData = useCallback(async () => {// 계속 감지하는 함수를 사용할 때 보통 useCallback을 사용
        const { data } = await apiClient.get(`/account/${accountId}`);
        setAccount(data);
    }, [accountId]);

    const unionAddress = useMemo(() => {
        if (account === null) return undefined;
        if (account.accountPost === null) return "";
        if (account.accountAddress1 === null) return "";
        if (account.accountAddress2 === null) return "";
        return `[{${account.accountPost}]  ${account.accountAddress1} ${account.accountAddress2}`;
    }, [account]);

    const changeBlock = useCallback(async () => {
        const nextBlock = account.accountBlock === "Y" ? "N" : "Y";

        const { data } = await authClient.patch(
            `/block/${accountId}`,
            {

                accountBlock: nextBlock
            }
        );       
        setAccount(prev=>({
            ...prev,
            accountBlock: prev.accountBlock === "Y" ? "N" : "Y"
        })); // 응답으로 받은 최신 정보로 갱신
        toast.error("차단 상태가 변경되었습니다.");
    }, [account, accountId]);

    //로딩중인 화면을 따로 보여줄 때
    // if(account === null) {
    //     return (<h1>로딩중인 화면</h1>)
    // }

    //placeholder를 사용할 때

    return (<>
        <Jumbotron title={`${account?.accountNickname}님의 개인 정보`} />

        <Row className="mt-4">
            <Col sm={3} className="fw-bold text-info">아이디</Col>
            <Col sm={9} className="text-secondary">
                <LoadingText value={account?.accountId} width={100}/>
            </Col>
        </Row>
        <Row className="mt-4">
            <Col sm={3} className="fw-bold text-info">닉네임</Col>
            <Col sm={9} className="text-secondary">
                <LoadingText value={account?.accountNickname} width={120}/>
            </Col>
        </Row>
        <Row className="mt-4">
            <Col sm={3} className="fw-bold text-info">이메일</Col>
            <Col sm={9} className="text-secondary">
                <LoadingText value={account?.accountEmail} width={200}/>
            </Col>
        </Row>
        <Row className="mt-4">
            <Col sm={3} className="fw-bold text-info">생년월일</Col>
            <Col sm={9} className="text-secondary">
                <LoadingText value={account?.accountBirth} width={100}/>
            </Col>
        </Row>
        <Row className="mt-4">
            <Col sm={3} className="fw-bold text-info">연락처</Col>
            <Col sm={9} className="text-secondary">
            <LoadingText value={account?.accountContact} width={120}/>
            </Col>
        </Row>
        <Row className="mt-4">
            <Col sm={3} className="fw-bold text-info">주소</Col>
            <Col sm={9} className="text-secondary">
                <LoadingText value={unionAddress} width={"100%"}/>
            </Col>
        </Row>
        <Row className="mt-4">
            <Col sm={3} className="fw-bold text-info">등급</Col>
            <Col sm={9} className="text-secondary">
                <LoadingText value={account?.accountLevel} width={100}/>
            </Col>
        </Row>
        <Row className="mt-4">
            <Col sm={3} className="fw-bold text-info">포인트</Col>
            <Col sm={9} className="text-secondary">
            <LoadingText value={account?.accountPoint} width={50}/>
            <span className="ms-2">point</span>
            </Col>
        </Row>
        <Row className="mt-4">
            <Col sm={3} className="fw-bold text-info">가입일</Col>
            <Col sm={9} className="text-secondary">
                 <LoadingText value={account?.accountJoin} width={240}/>
            </Col>
        </Row>
        <Row className="mt-4">
            <Col sm={3} className="fw-bold text-info">최종로그인</Col>
            <Col sm={9} className="text-secondary">
                <LoadingText value={account?.accountLogin} width={240}/>
            </Col>
        </Row>
        <Row className="mt-4">
            <Col sm={3} className="fw-bold text-info">최종 변경일</Col>
            <Col sm={9} className="text-secondary">
                <LoadingText value={account?.accountChange} width={240}/>
            </Col>
        </Row>
        <Row className="mt-4">
            <Col sm={3} className="fw-bold text-info">메세지</Col>
            <Col sm={9} className="text-secondary">
                <LoadingText value={account?.accountMessage} width="100%" line={3}/>
            </Col>
        </Row>
        <Row className="mt-4">
            <Col sm={3} className="fw-bold text-info">차단</Col>
            <Col sm={3} className="text-secondary">{account?.accountBlock}</Col>
            <Col sm={6}>
             {/* 차단 기능 버튼 */}
                <Button
                    type="button"
                    variant={account?.accountBlock === "Y" ? "danger" : "success"}
                    onClick={changeBlock}>
                    <FaLock className="mb-1" />
                    <span className="ms-2">
                        {account?.accountBlock === "Y" ? "차단 해제" : "차단"}
                    </span>
                </Button>
            </Col>
        </Row>
    </>)
}