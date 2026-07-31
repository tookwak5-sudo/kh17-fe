import Jumbotron from "@templates/Jumbotron";
import { useNavigate, useParams } from "react-router-dom";
import { apiClient } from "@utils/reaxios";
import { useAtomValue } from "jotai";
import { isAdminState } from "@utils/storage";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import NoImage from "@assets/images/no-image.png";
import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { FaPlus, FaRotateRight, FaXmark } from "react-icons/fa6";
import Editor from "react-simple-wysiwyg";


export default function AdminSaleEdit() {
    //파라미터 처리
    const { saleNo } = useParams();

    //hover가 가능한 환경 조사(가능하면 보통pc)
    const canHover = useMemo(()=>{
        const canHover = window.matchMedia(
        "(hover: hover) and (pointer: fine)"
         ).matches;
    }, []);
   

    //state
    const [sale, setSale] = useState(null);
    const [beforeThumbnail, setBeforeThumbnail] = useState(null); //AttachDto(DB정보)
    const [detailImages, setDetailImages] = useState([]);
    const navigate = useNavigate();

    const loadData = useCallback(async () => {
        const { data } = await apiClient.get(`/sale/${saleNo}`);
        const { saleDto, thumbnail, details } = data;
        setSale(saleDto);
        setBeforeThumbnail(thumbnail);
        setDetailImages(details);
        //할인 체크박스 처리 추가
        setDiscount(saleDto.saleOriginalPrice > saleDto.saleDiscountPrice);
    }, []);
    useEffect(() => {
        loadData();
    }, []);

    //할인 여부 선택 체크박스
    const [discount, setDiscount] = useState();

    //callback
    const changeStringValue = useCallback((e) => {
        const { name, value } = e.target;
        setSale(prev => ({
            ...prev,
            [name]: value
        }))
    }, []);
    const changeNumericValue = useCallback((e) => {
        const { name, value } = e.target;
        const replacement = value.replace(/[^0-9]+/g, "");
        const result = replacement.length === 0 ? "" : parseInt(replacement);
        setSale(prev => ({
            ...prev,
            [name]: result
        }))
    }, []);

    //관리자 권한 확인
    const isAdmin = useAtomValue(isAdminState)

    const deleteByAdmin = useCallback(async () => {
        const result = await Swal.fire({
            title: "정말 상품 정보를 삭제하시겠습니까?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "확인",
            cancelButtonText: "취소"
        });
        if (result.isConfirmed === false) return;//취소
        //삭제요청
        const { data } = await apiClient.delete(`sale/${saleNo}`);
        toast.success("상품 삭제 완료");
        navigate("sale/list");
    }, []);

    //할인을 해제하면 할인가를 삭제
    useEffect(() => {
        if (discount === false) {
            setSale(prev => ({ ...prev, saleDiscountPrice: "" }))
        }
    }, [discount]);

    //수정 정보 전송 함수
    const sendData = useCallback(async () => {
        //- 할인 여부에 따른 데이터 제거 처리
        const { saleDiscountPrice, ...copy } = sale;
        if (discount) copy.saleDiscountPrice = saleDiscountPrice;

        const form = new FormData();
        form.append("sale", new Blob(
            [JSON.stringify(copy)],
            { type: "application/json" }
        )); //데이터 추가

        const { data } = await apiClient.put(`/sale/${saleNo}`, form);
        console.log(data);
    }, [sale, discount]);

    //썸네일(대표이미지) 관련기능
    const [thumbnail, setThumbnail] = useState(null); //파일
    const thumbnailRef = useRef(); //ref는 빈도수 잦은곳에서도 사용하지만 원래는 태그제어역할 

    //(+변경사항) 2023년 3월 이후로 취소버튼은 onchange, oninput으로 감지가되지 않습니다.(파일 취소가 아닌 작업 취소)
    const changeThumbnail = useCallback(async (e) => {
        //선택된 파일을 서버로 전송시켜서 진짜 이미지 변경을 시키고 
        const file = e.target.files[0]

        const form = new FormData();
        form.append("thumbnail", file);
        const { data } = await apiClient.patch(`/sale/thumbnail/${saleNo}`, form);

        setBeforeThumbnail(data.attach);
    }, []);
    const clearThumbnail = useCallback(async () => {
        //서버에 삭제 요청을 한 뒤 제거
        const result = await Swal.fire({
            title: "썸네일을 삭제하시겠습니까?",
            text: "삭제한 이미지는 다시 복구할 수 없습니다",
            icon: "warning",
            confirmButtonText: "삭제",
            cancelButtonText: "취소",
            confirmButtonColor: "#d63031",
            cancelButtonColor: "#b2bec3",
            showCancelButton: true
        });
        if (result.isConfirmed === false) return;

        await apiClient.delete(`/sale/thumbnail/${saleNo}`);
        setBeforeThumbnail(null);
    }, [])
    useEffect(() => {
        if (thumbnail !== null) return;

        //파일 선택창은 비어있는 value밖에 줄 수 없어서 리엑트에서 모든 상황을 제어할 수 없다( hTML 확인)
        //태그를 직접 제어하는 방향으로 우회 처리한다 (ref 사용)
        if (thumbnailRef.current) {
            thumbnailRef.current.value = "";
        }
    }, [thumbnail]);

    //마우스가 올라갔을 때를 감지하기 위한 state
    const [hover, setHover] = useState(false);

    //sale은 절대로 null이면 안된다
    //→ sale이 null이면 기다려야 한다
    if (sale === null) {
        return <h1>로딩중...</h1>
    }

    return (<>
        <Jumbotron title="상품 정보 수정" />


        <Row className="mt-4">
            <Form.Label column sm={3}>상품명</Form.Label>
            <Col sm={9}>
                <Form.Control type="text" name="saleName" value={sale.saleName}
                    onChange={changeStringValue} placeholder="e.g., 갤럭시" />
            </Col>
        </Row>

        <Row className="mt-4">
            <Form.Label column sm={3}>카테고리</Form.Label>
            <Col sm={9}>
                <Form.Control type="text" name="saleCategory" value={sale.saleCategory}
                    onChange={changeStringValue} placeholder="e.g., 통신기기" />
            </Col>
        </Row>

        <Row className="mt-2">
            <Form.Label column sm={3}>정가</Form.Label>
            <Col sm={9}>
                <Form.Control type="text" name="saleOriginalPrice" value={sale.saleOriginalPrice}
                    onChange={changeNumericValue} placeholder="e.g., 2000000" />
            </Col>
        </Row>

        <Row className="mt-4">
            <Col sm={{ offset: 3, span: 9 }}>
                <Form.Check type="switch" label="할인 적용"
                    checked={discount}
                    onChange={e => setDiscount(e.target.checked)} />
            </Col>
        </Row>
        {discount && (
            <Row className="mt-4">
                <Form.Label column sm={3}>할인가</Form.Label>
                <Col sm={9}>
                    <Form.Control type="text" name="saleDiscountPrice" value={sale.saleDiscountPrice}
                        onChange={changeNumericValue} placeholder="e.g., 1990000" />
                </Col>
            </Row>
        )}

        <Row className="mt-4">
            <Form.Label column sm={3}>재고</Form.Label>
            <Col sm={9}>
                <Form.Control type="text" name="saleStock" value={sale.saleStock}
                    onChange={changeNumericValue} placeholder="e.g., 10" />
            </Col>
        </Row>

        <Row className="mt-4">
            {/* 부트스트랩에서 제공해주는 방식 */}
            <Col sm={9}>
                {/* <Form.Label column sm={3}>상세설명</Form.Label>
                <Form.Control as="textarea" rows={6}
                    name="saleContent" value={sale.saleContent}
                    onChange={changeStringValue} placeholder="상품에 대한 설명 작성" />
             */}

                {/* editor를 사용한 방식 */}
                <Editor name="saleContent" value={sale.saleContent}
                    onChange={changeStringValue}
                    containerProps={
                        {
                            style: {
                                resize: "none", //or vertical
                                minHeight: 250
                            }
                        }
                    } />
            </Col>
        </Row>

        {/* 썸네일 이미지 표지 수정 */}
        <Row className="mt-4">
            <Form.Label column sm={3}>대표이미지</Form.Label>
            <Col sm={9}>
                <div className="d-flex">
                    <Button as="label" variant="success">
                        <Form.Control type="file" accept="image/*"
                            ref={thumbnailRef} 
                            onInput={changeThumbnail}
                            className="d-none"/>
                        {beforeThumbnail === null &&(<>
                                <FaPlus/>
                                <span className="ms-2">썸네일 등록</span>
                            </>)}
                        {beforeThumbnail !== null &&(<>
                                <FaRotateRight/>
                                 <span className="ms-2">썸네일 변경</span>
                            </>)}
                    </Button>
                    <Button variant="danger" onClick={clearThumbnail} className="ms-2">
                        <FaXmark/>
                        <span className="ms-2">썸네일 제거</span>
                    </Button>
                </div>
            </Col>
        </Row>
        <Row className="mt-2">
            <Col sm={{ offset: 3, span: 9 }}>
                {/* 기존 이미지를 표시하고 제거, 변경 버튼을 추가 */}
                {beforeThumbnail === null && (
                    <img src={NoImage} width={100} className="border" />
                )}
                {beforeThumbnail !== null && (
                    <img src={`${import.meta.env.VITE_SERVER_URL}/api/attach/${beforeThumbnail.attachNo}`} width={100} className="border" />
                )}
            </Col>
        </Row>

        {/* position을 이용해서 버튼과 이미지를 합체 */}
        <Row className="mt-2">
            <Col sm={{ offset: 3, span: 9 }}>
                <div className="position-relative border" style={{width:300, minHeight:300}}
                    onMouseEnter={e=>setHover(true)}
                    onMouseLeave={e=>setHover(false)}>
                    
                    {/* 기존 이미지를 표시하고 제거, 변경 버튼을 추가 */}
                    {beforeThumbnail === null && (
                        <img src={NoImage}
                            className="position-absolute top-0 start-0 w-100"/>
                    )}
                    {beforeThumbnail !== null && (
                        <img src={`${import.meta.env.VITE_SERVER_URL}/api/attach/${beforeThumbnail.attachNo}`} 
                           className="position-absolute top-0 start-0 w-100"/>
                    )}

                    {hover && (<>
                    <Button as="label" variant="success" 
                            className="position-absolute" style={
                                {
                                    top:10 , 
                                    right:65,
                                    transition: "opacity 0.1s ease-out",
                                    opacity: hover ? 100 : 0
                                }
                            }>
                        <Form.Control type="file" accept="image/*"
                            ref={thumbnailRef} 
                            onInput={changeThumbnail}
                            className="d-none"/>
                        {beforeThumbnail === null && (<FaPlus/>)}
                        {beforeThumbnail !== null &&  (<FaRotateRight/>)}
                    </Button>
                    <Button variant="danger" onClick={clearThumbnail} 
                            className="ms-2 position-absolute" style={
                                {
                                    top:10, 
                                    right:10,
                                    transition: "opacity 0.1s ease-out",
                                    opacity: hover ? 100 : 0
                                }
                            }>
                        <FaXmark/>
                    </Button>
                    </>)}
                </div>
            </Col>
        </Row>

        {/* 수정버튼 */}
        <Row className="mt-5">
            <Col>
                <Button variant="warning" size="lg" className="w-md-auto"
                    onClick={sendData}>
                    <FaPlus />
                    <span className="ms-2">상품 수정하기</span>
                </Button>
            </Col>
        </Row>
    </>)


}