import Jumbotron from "@templates/Jumbotron"
import { useCallback, useEffect, useState, useMemo } from "react";
import { apiClient } from "@utils/reaxios";
import { Link, useParams } from "react-router-dom";
import { Badge, Button, Col, ListGroup, ListGroupItem, Row } from "react-bootstrap";
import { ClockLoader } from "react-spinners";
import NoImage from "@assets/images/no-image.png";
import { FaArrowRight } from "react-icons/fa6";

import dayjs from "dayjs";
import "dayjs/locale/ko";
dayjs.locale("ko"); //한국어로 설정

//경로변수인 purchaseNO를 받아서 서버에 재조회를 요청한 뒤 나오는 정보를 출력
export default function KakaopayBuySuccessVersion2() {
    //경로변수 수신
    const { purchaseNo } = useParams(); //경로변수이기 때문에 useParams;
    const [purchase, setPurchase] = useState(null);
    const [sales, setSales] = useState(null);

    useEffect(()=>{
       loadData();
    }, []);

    const loadData = useCallback(async ()=>{
        const { data } = await apiClient.get(`/purchase/simple/${purchaseNo}`);
        console.log(data); //purchase, sales 필드가 존재
        setPurchase(data.purchase);
        setSales(data.sales);
    }, []);
    
    const waiting = useMemo(()=>{
        if(purchase === null) return true;
        if(sales === null) return true;

        return false;
    }, [purchase, sales])

    const calculateBackground = useCallback(({ purchaseStatus })=>{
        switch(purchaseStatus) {
            case "결제 완료": return "success";
            case "부분 취소": return "warning";
            case "전체 취소": return "danger";
            case "차단": return "info";
            default:    return "secondary";
        }
    }, []);

    return(<>
        <Jumbotron title="상품 구매 완료" content="상품 결제가 성공하였습니다."/>

        {/* 로딩중일 때 */}
        {waiting && (
        <Row className="mt-5">
            <Col>
            <div className="position-fixed top-0 start-0 
                        w-100 h-100 bg-dark bg-opacity-25
                        d-flex justify-content-center align-items-center">
                <div className="d-flex flex-column text-center">
                    <ClockLoader size={75} loading={waiting} />
                    <p className="mt-2">로딩중</p>
                </div>
            </div>
            </Col>
        </Row>
        )}
        
        {/* 데이터 불러와진 뒤 */}
        {!waiting && (<>
        <Row className="mt-5">
            <Col>
                <div className="d-flex justify-content-between">
                    <h3 className="text-truncate">{purchase.purchaseName}</h3>
                    <span className="fs-4 fw-bold text-info">{purchase.purchaseTotal.toLocaleString()}원</span>
                </div>

                <div className="mt-2">
                    <Badge bg={calculateBackground(purchase)}> {purchase.purchaseStatus}</Badge>
                </div>

                <div className="mt-2 text-end">
                    {dayjs(purchase.purchaseCtime).format("YYYY년 M월 D일 H시 m분")}
                </div>
            </Col>
        </Row>
        <Row className="mt-4">
            <Col>
                <ListGroup>
                    {sales.map(sale=>(
                    <ListGroupItem key={sale.saleNo} className="p-4">
                        <div className="d-flex">
                            <img src={
                                sale.attachNo !==null ?
                                `${import.meta.env.VITE_SERVER_URL}/api/attach/${sale.attachNo}`
                                : NoImage
                            } width={100}/>
                            <div className="flex-grow-1 ms-2">
                                <h4 className="text-truncate">
                                    <Link to={`/sale/detail/${sale.saleNo}`}>
                                        {sale.saleName}
                                    </Link>
                                </h4>
                                <div className="mt-2">
                                    <Badge bg="info">{sale.saleCategory}</Badge>
                                    <div className="mt-2">
                                        판매가 : {sale.saleDiscountPrice.toLocaleString()}원
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ListGroupItem>
                    ))}
                </ListGroup>
            </Col>
        </Row>

        <Row className="mt-5">
            <Col className="text-end">
                    <Button variant="success" size="lg"
                        as={Link} to={`/pay/v2/buy/detail/${purchase.purchaseNo}`}>
                        <span>결제 상세 내역 보러가기</span>
                        <FaArrowRight className="ms-2"/>
                    </Button>
            </Col>
        </Row>
        </>)}
    </>)
}