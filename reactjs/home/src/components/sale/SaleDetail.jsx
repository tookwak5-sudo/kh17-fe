import Jumbotron from "@templates/Jumbotron";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiClient } from "@utils/reaxios";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Form from "react-bootstrap/esm/Form";

import NoImage from "@assets/images/no-image.png";
import Badge from "react-bootstrap/esm/Badge";
import Button from "react-bootstrap/esm/Button";
import { purifyHtml } from "@utils/purify";
import { useAtomValue } from "jotai";
import { isAdminState } from "@utils/storage";
import { FaSquarePen, FaTrash } from "react-icons/fa6";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { isLoginState } from "@utils/storage";

export default function SaleDetail() {
    //parameter
    const { saleNo } = useParams();

    //state
    const [sale, setSale] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);
    const [detailImages, setDetailImages] = useState([]);
    const [quantity, setQuantity] = useState(1);

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
        return `${import.meta.env.VITE_SERVER_URL}/api/attach/${thumbnail.attachNo}`;
    }, [thumbnail]);

    
    //관리자 권한 확인
    const isAdmin = useAtomValue(isAdminState);
    const navigate = useNavigate();

    const deleteByAdmin = useCallback(async ()=>{
        //확인창
        const result = await Swal.fire({
            title:`정말 상품 정보를 삭제하시겠습니까?`,
            icon:"warning",
            showCancelButton:true,
            confirmButtonText:"확인",
            cancelButtonText:"취소",
            confirmButtonColor:"#d63031",
            cancelButtonColor:"#b2bec3"
        });
        if(result.isConfirmed === false) return;//취소

        //삭제 요청
        const { data } = await apiClient.delete(`/sale/${saleNo}`);
        //console.log(data);

        toast.success("상품 삭제 완료");
        navigate("/sale/list");
    }, []);

    const isLogin = useAtomValue(isLoginState);//로그인 상태

    //구매 확인 페이지로 주소를 잘 만들어서 전달
    const purchase = useCallback(async ()=>{
        if(!isLogin) {
            const result = await Swal.fire({
                title:"로그인이 필요한 서비스입니다",
                text:"확인을 누르시면 로그인 페이지로 이동합니다",
                icon:"info",
                showCancelButton:true,
                confirmButtonText:"확인",
                cancelButtonText:"취소",
                confirmButtonColor:"#0984e3",
                cancelButtonColor:"#b2bec3",
            });
    
            if(result.isConfirmed) {//확인을 눌렀다면
                navigate("/account/login");
            }
            return;
        }

        navigate(`/pay/v2/buy?sale=${saleNo}:${quantity}`);
    }, [saleNo, quantity]);

    //장바구니 담기
    const addCart = useCallback(async ()=>{
        if(!isLogin) {
            const result = await Swal.fire({
                title:"로그인이 필요한 서비스입니다",
                text:"확인을 누르시면 로그인 페이지로 이동합니다",
                icon:"info",
                showCancelButton:true,
                confirmButtonText:"확인",
                cancelButtonText:"취소",
                confirmButtonColor:"#0984e3",
                cancelButtonColor:"#b2bec3",
            });
    
            if(result.isConfirmed) {//확인을 눌렀다면
                navigate("/account/login");
            }
            return;
        }

        const { data } = await apiClient.post("/cart/", {
            item : saleNo,//상품번호
            qty : quantity//구매수량
        });
        console.log(data);

        //장바구니에 담겼다는 알림 + 이동할것인지 확인
        const result = await Swal.fire({
            title:"상품이 장바구니에 담겼습니다",
            icon:"success",
            showCancelButton:true,
            confirmButtonText:"장바구니로 이동",
            cancelButtonText:"계속 쇼핑",
            confirmButtonColor:"#00b894",
            cancelButtonColor:"#dfe6e9"
        });

        if(result.isConfirmed) {//확인을 눌렀다면
            navigate("/account/cart");
        }
    }, [quantity]);

    //sale은 절대로 null이면 안된다
    //→ sale이 null이면 기다려야 한다
    if(sale === null) {
        return <h1>로딩중...</h1>
    }

    return (<>
        <Jumbotron title="상품 상세 정보" content="상품에 대한 상세정보입니다"/>
        
        <Row className="mt-5">
            {/* 썸네일 영역 */}
            <Col sm={6}>
                <img src={thumbnailUrl} width={"100%"}/>
            </Col>
            {/* 상품정보 영역 */}
            <Col sm={6}>
                <h4>{sale.saleName}</h4>
                <div className="mb-4">
                    <Badge bg="info">{sale.saleCategory}</Badge>
                </div>
                {/* 할인이 없는 경우 */}
                { sale.saleOriginalPrice === sale.saleDiscountPrice && (
                <div>
                    <b className="text-info fs-4">{sale.saleOriginalPrice.toLocaleString()}원</b>
                </div>
                ) }
                {/* 할인이 있는 경우 */}
                { sale.saleOriginalPrice > sale.saleDiscountPrice && (
                <div>
                    <s className="text-muted">{sale.saleOriginalPrice.toLocaleString()}원</s>
                    <b className="text-danger ms-2">00%</b>
                    <br/>
                    <b className="text-danger fs-4">
                        {sale.saleDiscountPrice.toLocaleString()}원
                    </b>
                </div>
                ) }

                {/* 구매수량 선택 및 구매or장바구니버튼 */}
                <div className="mt-4">
                    현재 <b>{sale.saleStock.toLocaleString()}</b>개 남음
                </div>
                <div className="mt-2 d-flex">
                    {/* 수량 선택창과 구매버튼 */}
                    <Form.Control type="number" className="d-inline-block" 
                            style={{width:80}} value={quantity}
                            onFocus={e=>e.target.select()}
                            onChange={e=>{
                                let number = parseInt(e.target.value) || 1;
                                if(number < 1) // 최소값 보정 : number = Math.max(number, 1)
                                    number = 1;
                                if(number > sale.saleStock) //최대값 보정 : number = Math.min(number, sale.saleStock) 
                                    number = sale.saleStock; 
                                setQuantity(number);
                            }}/>
                    <Button variant="success" className="ms-2" onClick={purchase}>구매</Button>
                    <Button variant="secondary" className="ms-2" onClick={addCart}>담기</Button>
                </div>
            </Col>
        </Row>

        {/* 상세 이미지들 출력 */}
        { detailImages.length > 0 && (
        <Row className="mt-5">
            <Col>
                {detailImages.map(detail=>{
                    const url = `${import.meta.env.VITE_SERVER_URL}/api/attach/${detail.attachNo}`;
                    return (
                        <img key={detail.attachNo} src={url} width={"100%"}/>
                    )
                })}
            </Col>
        </Row>
        ) } 

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
                    // { __html: sale.saleContent }
                    { __html: purifyHtml(sale.saleContent) }
                }></div>
            </Col>
        </Row>

        {/* 
            관리자만 볼 수 있는 삭제버튼을 만들고 누르면 경고창 출력 후 
            확인을 누르면 서버로 신호를 보내 삭제 
            그 후 목록으로 이동
            서버의 주소 : /api/sale/{saleNo} [DELETE]

            * 백엔드도 관리자만 통과해야함
        */}
        { isAdmin && (
        <Row className="mt-5">
            <Col className="text-end">
                {/* 삭제버튼 */}
                <Button variant="danger" size="lg" onClick={deleteByAdmin}>
                    <FaTrash/>
                    <span className="ms-2">상품 정보 삭제</span>
                </Button>
                {/* 수정링크 */}
                <Button variant="warning" size="lg" as={Link} to={`/admin/saleEdit/${saleNo}`}
                            className="ms-2">
                    <FaSquarePen/>
                    <span className="ms-2">상품 정보 수정</span>
                </Button>
            </Col>
        </Row>
        ) }

    </>)
}