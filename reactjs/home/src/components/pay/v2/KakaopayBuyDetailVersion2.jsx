import Jumbotron from "@templates/Jumbotron";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiClient } from "@utils/reaxios";
import { Badge, Button, Card, Col, ListGroup, ListGroupItem, Row } from "react-bootstrap";
import { ClockLoader } from "react-spinners";
import NoImage from "@assets/images/no-image.png";
import relativeTime from "dayjs/plugin/relativeTime";
import Swal from 'sweetalert2';
import { toast } from "react-toastify";

dayjs.extend(relativeTime);

import dayjs from "dayjs";
import "dayjs/locale/ko";
import { FaXmark } from "react-icons/fa6";
dayjs.locale("ko"); //한국어로 설정

export default function KakaopayBuyDetailVersion2() {
    //pathVariable
    const { purchaseNo } = useParams();

    //state
    const [purchase, setPurchase] = useState(null);
    const [details, setDetails] = useState(null);
    const [payResponse, setPayResponse] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = useCallback(async () => {
        const { data } = await apiClient.get(`/purchase/heavy/${purchaseNo}`);
        const { purchase, details, payResponse } = data;
        console.log(data);
        setPurchase(purchase);
        setDetails(details);
        setPayResponse(payResponse);
    }, []);

    //상품 개수까지 고려한 결제금액 계산
    const calculateTotalPrice = useCallback((detail) => {
        if (!detail) throw "detail 없음";

        const { purchaseDetailQty, purchaseDetailPrice } = detail;
        const total = purchaseDetailPrice * purchaseDetailQty;
        return total.toLocaleString();
    }, []);

    //memo
    const withInPeriod = useMemo(() => {
        if (purchase === null) return false;
        return dayjs().diff(purchase.purchaseCtime, 'day', false) <= 7;
    }, [purchase]);

    //전체 취소
    const cancelAll = useCallback(async ()=>{
        try{
            const result = await Swal.fire({
                title: "결제를 취소하시겠습니까?",
                text : "취소한 결제는 다시 복구할 수 없습니다",
                icon: "warning",
                confirmButtonText: "네, 취소",
                cancelButtonText: "아니오, 취소x",
                showCancelButton: true,
            });
            if (result.isConfirmed === false) return;//취소
            
            //취소 요청
            const { data } = await apiClient.delete(`/purchase/cancelAll/${purchaseNo}`);
            toast.success("결제가 취소되었습니다.");

            //화면 갱신 처리
            await loadData(); //뒤에 작업이 있다면 순서대로 처리(await가 붙으면, aync 함수 내에서 다른 async 함수를 부를 때)
        }
        catch(e) {
            toast.error("일시적인 오류입니다. \n 잠시 후 다시 시도해주세요.");
        }
    }, []);

    //항목 취소
    const cancelUnit = useCallback(async (detail)=>{
        try{
            //확인창
            const result = await Swal.fire({
                title: "결제를 취소하시겠습니까?",
                text : "취소한 결제는 다시 복구할 수 없습니다",
                icon: "warning",
                confirmButtonText: "네, 취소",
                cancelButtonText: "아니오, 취소x",
                showCancelButton: true,
            });
            if (result.isConfirmed === false) return;//취소
        
            //서버요청
            const { data } = await apiClient.delete(
                `/purchase/cancelUnit/${detail.purchaseDetailNo}`
             );

            toast.success("결제가 취소되었습니다.");

            //화면 갱신 처리
            await loadData();
        }
        catch(e) {
            toast.error("일시적인 오류입니다. \n 잠시 후 다시 시도해주세요.");
        }
    }, []);

    // 데이터 오기전
    if (purchase === null || details === null || payResponse === null) {
        return (<>
            <Jumbotron title="상품 결제 상세" content="결제 내역을 불러오는 중 입니다..." />

            <Row className="mt-5 text-center">
                <Col>
                    <div className="d-flex justify-content-center align-items-center">
                        <ClockLoader size={75} />
                    </div>
                </Col>
            </Row>
        </>)
    }

    //데이터 불러와진 후
    return (<>
        <Jumbotron title="상품 결제 상세" content="PG사와 연동된 결제 정보 내역입니다." />

        {/* 결제 대표 정보(purchase) */}
        <Row className="mt-5">
            <Col sm={3} className="text-info fa-bold">결제고유번호</Col>
            <Col sm={9} className="text-secondary fa-bold">
                {String(purchase.purchaseNo).padStart(10, "0")}
            </Col>
        </Row>
        <Row className="mt-5">
            <Col sm={3} className="text-info fa-bold">결제 상품명</Col>
            <Col sm={9} className="text-secondary fa-bold">{purchase.purchaseName}</Col>
        </Row>
        <Row className="mt-5">
            <Col sm={3} className="text-info fa-bold">결제 금액</Col>
            <Col sm={9} className="text-secondary fa-bold">{purchase.purchaseTotal.toLocaleString()}원</Col>
        </Row>
        <Row className="mt-5">
            <Col sm={3} className="text-info fa-bold">현재 상태</Col>
            <Col sm={9} className="text-secondary fa-bold">{purchase.purchaseStatus}</Col>
        </Row>
        <Row className="mt-5">
            <Col sm={3} className="text-info fa-bold">거래번호(TID)</Col>
            <Col sm={9} className="text-secondary fa-bold">{purchase.purchaseTid}</Col>
        </Row>
        <Row className="mt-5">
            <Col sm={3} className="text-info fa-bold">결제시각</Col>
            <Col sm={9} className="text-secondary fa-bold">
                {dayjs(purchase.purchaseCtime).format("YYYY년 M월 D이 E H시 m분 s초")}
                ({dayjs(purchase.purchaseCtime).fromNow()})
            </Col>
        </Row>
        <Row className="mt-5">
            <Col sm={3} className="text-info fa-bold">결제승인시각</Col>
            <Col sm={9} className="text-secondary fa-bold">
                {dayjs(purchase.purchaseUtime).format("YYYY년 M월 D이 dddd H시 m분 s초")}
                ({dayjs(purchase.purchaseUtime).fromNow()})
            </Col>
        </Row>

        {/* 전체 취소 버튼 */}
        { withInPeriod && purchase.purchaseRemain > 0 && (
            <Row className="mt-4 text-end">
                <Col>
                    <Button variant="danger" size="lg" onClick={cancelAll}>
                        <FaXmark/>
                        <span className="ms-2">현재 구매내역 취소하기</span>
                    </Button>
                </Col>
            </Row>
        ) }
        {/* 결제 상세 정보 (purchase_details) */}
        <hr className="my-5" />
        <Row>
            <Col>
                <ListGroup>
                    {details.map(detail => (
                        <ListGroupItem key={detail.purchaseDetailNo} className="p-4">
                            <div className="d-flex">
                                {/* 상품 이미지(해결 필요) */}
                                <img src={NoImage} width={100} />
                            </div>
                            {/* 상품 정보(스냅샷)와 구매 수량 */}
                            <div className="flex-grow-1 ms-2">
                                <h4 className="text-truncate">
                                    <Link to={`/sale/detail/${detail.purchaseDetailItem}`}>
                                        {detail.purchaseDetailName}
                                    </Link>
                                </h4>
                                <div className="mt-2">
                                    구매 수량 : {detail.purchaseDetailQty.toLocaleString()}개
                                </div>
                                <div className="mt-2">
                                    구매 금액 :
                                    {calculateTotalPrice(detail)}원
                                    &nbsp;
                                    (개당 {detail.purchaseDetailPrice.toLocaleString()}원)
                                </div>
                                <div className="mt-2">
                                    <Badge bg={
                                        detail.purchaseDetailStatus === "승인" ? "success" : "danger"
                                    }>
                                        {detail.purchaseDetailStatus}
                                    </Badge>
                                </div>
                                {/* 
                                        취소버튼 등장 조건 
                                        1. 해당 상품 구매내역의 현재상태가 "승인"일 것
                                        2. 구매한 지 일정 시간 이내일 것  (ex : 7일)
                                        */}
                                {
                                    detail.purchaseDetailStatus === "승인"
                                    &&
                                    withInPeriod
                                    && (
                                        <div className="ms-2 text-end">
                                            <Button variant="danger" size="sm"
                                                onClick={e=>cancelUnit(detail)}>
                                                <FaXmark />
                                                <span className="ms-2">이 항목 취소하기</span>
                                            </Button>
                                        </div>
                                    )}
                            </div>
                        </ListGroupItem>
                    ))}
                </ListGroup>
            </Col>
        </Row>

        {/* 카카오페이 정보 */}
        <hr className="my-5" />
        <Row>
            <Col>
                <Card className="mt-5 shadow-sm">
                    <Card.Header className="fw-bold">
                        카카오페이 결제 정보
                    </Card.Header>

                    <ListGroup variant="flush">

                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                            <span>결제 상태</span>

                            <Badge bg={
                                payResponse.status === "SUCCESS_PAYMENT"
                                    ? "success"
                                    : "danger"
                            }>
                                {
                                    payResponse.status === "SUCCESS_PAYMENT"
                                        ? "결제 완료"
                                        : payResponse.status
                                }
                            </Badge>
                        </ListGroup.Item>

                        <ListGroup.Item className="d-flex justify-content-between">
                            <span>지불 방식</span>
                            <span>
                                {payResponse.paymentMethodType === "MONEY"
                                    ? "카카오머니"
                                    : payResponse.paymentMethodType}
                            </span>
                        </ListGroup.Item>

                        <ListGroup.Item className="d-flex justify-content-between">
                            <span>결제 시작시각</span>
                            <span>
                                {dayjs(payResponse.createdAt)
                                    .format("YYYY년 M월 D일(ddd) HH:mm:ss")}
                            </span>
                        </ListGroup.Item>

                        <ListGroup.Item className="d-flex justify-content-between">
                            <span>결제 승인시각</span>
                            <span>
                                {dayjs(payResponse.approvedAt)
                                    .format("YYYY년 M월 D일(ddd) HH:mm:ss")}
                            </span>
                        </ListGroup.Item>
                        {payResponse.canceledAt !== null && (
                            <ListGroup.Item className="d-flex justify-content-between">
                                <span>결제 승인시각</span>
                                <span>
                                    {dayjs(payResponse.canceledAt)
                                        .format("YYYY년 M월 D일(ddd) HH:mm:ss")}
                                </span>
                            </ListGroup.Item>
                        )}
                        <ListGroup.Item className="d-flex justify-content-between">
                            <span>금액상세</span>
                            <div>
                                <span className="text-info fw-bold">
                                    {payResponse.amount.total.toLocaleString()}원
                                </span>
                            </div>
                            <span>부가세</span>
                            <div>
                                <span className="text-info fw-bold">
                                    {payResponse.amount.vat.toLocaleString()}원
                                </span>
                            </div>
                            <span>상품가</span>
                            <div>
                                <span className="text-info fw-bold">
                                    {(payResponse.amount.total - payResponse.amount.vat).toLocaleString()}원
                                </span>
                            </div>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <div className="fw-bold mb-2">
                                거래번호(TID)
                            </div>

                            <code className="text-break">
                                {payResponse.tid}
                            </code>
                        </ListGroup.Item>

                    </ListGroup>
                </Card>
            </Col>
        </Row>

        
        <Row className="mt-4">
            <Col>
                <ListGroup>
                    {payResponse.paymentActionDetails.map((action, index) => (
                        <ListGroupItem key={index}>
                            <div className="d-flex justify-content-between">
                                <div>
                                    <Badge bg={
                                        action.paymentActionType === "PAYMENT" ? "success" : "danger"
                                    } >{action.paymentActionType}</Badge>

                                    <span className="ms-2">
                                        {action.amount.toLocaleString()}원
                                    </span>
                                </div>
                                    {dayjs(action.approvedAt).format("YYYY년 M월 D일(ddd) HH:mm:ss")}
                                <div>

                                </div>
                            </div>
                        </ListGroupItem>
                    ))}
                </ListGroup>
            </Col>
        </Row>
    </>)
}