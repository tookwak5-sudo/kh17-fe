import Jumbotron from "@templates/Jumbotron";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge, Button, Card, Col, Form, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { apiClient } from "@utils/reaxios";

import NoImage from "@assets/images/no-image.png";
import { purifyHtml } from "@utils/purify";
import { FaXmark } from "react-icons/fa6";

export default function SaleDetail() {
    //파라미터 처리
    const { saleNo } = useParams();

    //state
    const [sale, setSale] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);
    const [detailImages, setDetailImages] = useState([]);

    const loadData = useCallback(async ()=>{
        const { data } = await apiClient.get(`/sale/${saleNo}`);
        const { saleDto, thumbnail, details } = data;
        setSale(saleDto);
        setThumbnail(thumbnail);
        setDetailImages(details);
    }, []);
    useEffect(()=>{
        loadData();
    }, []);

    //썸네일 주소 계산
    const thumbnailUrl = useMemo(()=>{
        if(thumbnail === null) return NoImage;
        return `${import.meta.env.VITE_SERVER_URL}/api/attatch/${thumbnail.attachNo}`;
    })

    //sale은 절대로 null이면 안된다
    //→ sale이 null이면 기다려야 한다
    if(sale === null) {
        return <h1>기다려</h1>
    }

    return (<>
        <Jumbotron title="상품 상세" />

        <Row className="mt-5">
            {/* 썸네일 영역 */}
            <Col sm={6}>
                <img src={NoImage} width={"100%"}/>
            </Col>
            {/* 상품정보 영역 */}
            <Col sm={6}>
                <h4>{sale.saleName}</h4>
                <div>
                    <Badge bg="info">{sale.saleCategory}</Badge>
                </div>
                {/* 할인 x */}
                { sale.saleOriginalPrice === sale.saleDiscountPrice && (
                <div>
                    <s className="text-info fs-4">{sale.saleOriginalPrice.toLocaleString()}원</s>
                </div>
                )}
                {/* 할인 o */}
                { sale.saleOriginalPrice > sale.saleDiscountPrice && (
                <div>
                    <s className="text-muted">{sale.saleOriginalPrice.toLocaleString()}</s>
                    <b className="text-danger">00%</b>
                    <br/>
                    <b className="text-danger fs-4">
                        {sale.saleDiscountPrice.toLocaleString()}원
                    </b>
                </div>
                )}

                {/* 구매수량 선택 및 구매or장바구니 버튼 */}
                <div className="mt-4">
                    현재 <b>{sale.saleStock.toLocaleString()}</b>개 남음
                </div>
                <div className="mt-2 d-flex">
                    <Form.Control type="number" className="d-inline-block"
                        style={{width:80}} value={1}/>
                        <Button variant="success" className="ms-2">구매</Button>
                        <Button variant="secondary" className="ms-2">담기</Button>
                </div>
            </Col>
        </Row>

        {/* 상세 이미지 */}
        {detailImages.length > 0 && (
        <Row className="mt-5">
            <Col>
                {detailImages.map(detail=>{
                   const url = `${import.meta.env.VITE_SERVER_URL}/api/attach/${detail.attachNo}`;
                   return(
                        <img key={detail.attachNo} src={url} width={"100%"}/>
                        // <img key={url} src={url} width={"100%"}/>//url써도 무방
                    )
                })}
            </Col>
        </Row>
        )}

        {/* 추가 상세정보 출력 */}
        <Row className="mt-5">
            <Col>
                {/* 
                    모던 웹에서는 HTML 렌더링을 극도로 경계하며
                    이는 위험한 보안 문제가 발생할 수 있음 
                    (XSS : cross site script 공격) 
                    
                    → 위험 요소를 제거하는 라이브러리(ex : dompurify)를 사용
                */}
                <div dangerouslySetInnerHTML={
                   // {__html: sale.saleContent }
                    {__html: purifyHtml(sale.saleContent) }
                }></div>
            </Col>
        </Row>

        {/* 
            관리자만 볼 수 있는 삭제버튼을 만들고 누르면 경고창 출력 후 
            확인을 누르면 서버로 신호를 보내 삭제
            그 후 목록으로 이동
            서버의 주소 : /api/sale/{saleNo} [DELETE]
         */}


         <Row className="mt-5">
            <Col>
                <button>
                    <FaXmark/>
                </button>
            </Col>
         </Row>

    </>)
}