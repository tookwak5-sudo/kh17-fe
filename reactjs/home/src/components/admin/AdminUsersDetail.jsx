import Jumbotron from "@templates/Jumbotron";
import { useAtomValue } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { FaLock, FaSquarePen } from "react-icons/fa6";
import { Link, useParams } from "react-router-dom";
import { apiClient } from "@utils/reaxios";
import { loginUserState } from "@utils/storage";
import { toast } from "react-toastify";
import { authClient } from "../../utils/reaxios";

export default function AdminUsersDetail() {

    //Route에 선언된 파라미터 정보 읽어오기
    const { accountId } = useParams();

    // const { accountId, accountNickname, accountLevel } = useAtomValue(loginUserState);
    const [account, setAccount] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = useCallback(async () => {
        const { data } = await apiClient.get(`/account/${accountId}`);
        setAccount(data);
    }, [accountId]);

    //주소를 완성해서 반환하는 메모
    const unionAddress = useMemo(() => {
        if (account === null) return "";
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

    return (<>
        <Jumbotron title="회원 상세 정보" />

        <Row className="mt-4">
            <Col sm={3} className="fw-bold text-info">아이디</Col>
            <Col sm={9} className="text-secondary">{account?.accountId}</Col>
        </Row>
        <Row className="mt-4">
            <Col sm={3} className="fw-bold text-info">닉네임</Col>
            <Col sm={9} className="text-secondary">{account?.accountNickname}</Col>
        </Row>
        <Row className="mt-4">
            <Col sm={3} className="fw-bold text-info">이메일</Col>
            <Col sm={9} className="text-secondary">{account?.accountEmail}</Col>
        </Row>
        <Row className="mt-4">
            <Col sm={3} className="fw-bold text-info">생년월일</Col>
            <Col sm={9} className="text-secondary">{account?.accountBirth}</Col>
        </Row>
        <Row className="mt-4">
            <Col sm={3} className="fw-bold text-info">연락처</Col>
            <Col sm={9} className="text-secondary">{account?.accountContact}</Col>
        </Row>
        <Row className="mt-4">
            <Col sm={3} className="fw-bold text-info">주소</Col>
            <Col sm={9} className="text-secondary">{unionAddress}
            </Col>
        </Row>
        <Row className="mt-4">
            <Col sm={3} className="fw-bold text-info">등급</Col>
            <Col sm={9} className="text-secondary">{account?.accountLevel}</Col>
        </Row>
        <Row className="mt-4">
            <Col sm={3} className="fw-bold text-info">포인트</Col>
            <Col sm={9} className="text-secondary">{account?.accountPoint?.toLocaleString()}</Col>
        </Row>
        <Row className="mt-4">
            <Col sm={3} className="fw-bold text-info">가입일</Col>
            <Col sm={9} className="text-secondary">{account?.accountJoin}</Col>
        </Row>
        <Row className="mt-4">
            <Col sm={3} className="fw-bold text-info">최종로그인</Col>
            <Col sm={9} className="text-secondary">{account?.accountLogin}</Col>
        </Row>
        <Row className="mt-4">
            <Col sm={3} className="fw-bold text-info">최종 변경일</Col>
            <Col sm={9} className="text-secondary">{account?.accountChange}</Col>
        </Row>
        <Row className="mt-4">
            <Col sm={3} className="fw-bold text-info">최종변경일</Col>
            <Col sm={9} className="text-secondary">{account?.accountChange}</Col>
        </Row>
        <Row className="mt-4">
            <Col sm={3} className="fw-bold text-info">메세지</Col>
            <Col sm={9} className="text-secondary">{account?.accountMessage}</Col>
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