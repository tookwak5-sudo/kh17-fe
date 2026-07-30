import Jumbotron from "@templates/Jumbotron";
import { useCallback, useEffect, useState } from "react";
import { Badge, Button, Card, Col, Row } from "react-bootstrap";
import { apiClient } from "@utils/reaxios";
import NoImage from "@assets/images/no-image.png";
import { Link } from "react-router-dom";
import { FaArrowTrendDown } from "react-icons/fa6";

//무조건 상대경로로만 불러올 때 ./부터 시작해야함 (파일명만 적으면 안됨)
// import "SaleList.css"; ← 이게 안됨!!!!!!!
import "./SaleList.css";


export default function SaleList() {
    //data
    const [items, setItems] = useState([]);

    const loadItems = useCallback(async () => {
        const { data } = await apiClient.post("/sale/list", {}); //문서에서 확인했을 때 {}가없으면 에러가 났었음 정보가 없더라도 구성은 갖춰주기
        //data는 백엔드에서의 SaleListResponseVO
        console.log(data.items);
        setItems(data.items);
        setItems(data.items);
    }, []);

    useEffect(() => {
        loadItems();
    }, []);

    //일회용 계산 함수
    const calculateDiscountPercent = useCallback(({ saleOriginalPrice, saleDiscountPrice }) => {
        return 100 - (discount * 100 / origin);
    }, []);

    //view
    return (<>
        <Jumbotron title="상품 목록" />

        {/* 상품 목록 - 카드 리스트 형태로 출력 */}
        <Row className="mt-5">
            <Col className="item-container">
                {items.map(item => {

                    //추가 코드 작성 (현재 회차에서만 유효한 코드)
                    const { saleOriginalPrice, saleDiscountPrice } = item;
                    const percent = saleDiscountPrice * 100 / saleOriginalPrice;
                    const discount = 100 - percent;
                    const result = discount.toLocaleString();

                    const isDiscount = saleOriginalPrice > saleDiscountPrice;

                    const imageUrl = `${import.meta.env.VITE_SERVER_URL}/api/attach/${item.attachNo}`;

                    return (
                    <div key={item.saleNo} className="item mb-4 p-2">
                        <Card>
                            <Card.Img variant="top" 
                                    src={item.attachNo === null ? NoImage : imageUrl} 
                                    style={
                                        {
                                            width: "auto", 
                                            height: 300, 
                                            objectFit: "contain",  // 종횡중 짧은 쪽 covor, 
                                            objectPosition: "center"
                                        }
                                    }/>
                            <Card.Body>
                                <Card.Title className="text-truncate">{item.saleName}</Card.Title>
                                <Card.Text>
                                    <div>
                                        <Badge bg="info">{item.saleCategory}</Badge>
                                    </div>
                                    <div className="mt-4 fs-4" style={{ height: 120 }}>
                                        {isDiscount ? (<>
                                            <s className="text-muted">{item.saleOriginalPrice.toLocaleString()} 원</s>
                                            <br />
                                            <b className="text-danger">{item.saleDiscountPrice.toLocaleString()} 원</b>
                                            {/* ( ↓ {100 - item.saleDiscountPrice * 100 / item.saleOriginalPrice} % ) */}
                                            {/* ( ↓ {calculateDiscountPercent(item)} %) */}
                                            <span className="test-success">
                                                <FaArrowTrendDown style={{ transform: "rotate(55deg)" }} />
                                                {result} %
                                            </span>
                                        </>) : (<>
                                            <b>{item.saleOriginalPrice.toLocaleString()}</b>
                                        </>)}
                                    </div>
                                </Card.Text>

                                <div className="text-end">
                                    <Button variant="primary" as={Link} to={`/sale/detail/${item.saleNo}`}>
                                        상세보기 →
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                    )})}

            </Col>
        </Row>
    </>)
}

//내부적으로만 사용하는 하위 컴포넌트
function ItemCard({item}) {
    
    return(<></>)
}