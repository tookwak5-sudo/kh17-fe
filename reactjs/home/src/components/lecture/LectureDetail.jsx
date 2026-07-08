import { toast } from "react-toastify";
import Jumbotron from "@templates/Jumbotron";
import { Link, Navigate, useLoaderData, useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { Button, Col, Row } from "react-bootstrap";
import { FaList, FaPenToSquare, FaTrash } from "react-icons/fa6";

export default function LectureDetail() {
    //파라미터 처리
    const { lectureNo } = useParams();

    //1. lectureNo가 비정상적인 경우 처리 내용
    if(/^[0-9]+$/.test(lectureNo) === false) {
        toast.error("입력이 올바르지 않습니다");
        return <Navigate to="/lecture/list" replace/>
    }

    const navigate = useNavigate();

    //2. lectureNo가 정상적인 경우 처리 내용
    const [lecture, setLecture] = useState(null);

    //시작하자마자 1번 불러오게 하기
    useEffect(()=>{
        loadData();
    }, [])

    // [1] 일반 함수에서 비동기 작업을 호출 : .then() 으로 후속작업을 지정
    // const loadData = useCallback(()=>{
    //     axios({
    //         // url:`http://localhost:8080/api/lecture/detail${lectureNo}`, //경로변수일때
    //         url:'http://localhost:8080/api/lecture/detail${lectureNo}', //쿼리스트링일때 (+params 사용)
    //         method: "get",
    //         params:{ lectureNo : lectureNo }
    //     })
    //     .then(response=>{
    //         setLecture(response.data);
    //     });
    // }, []);

    // [2] 비동기 함수를 사용 
    // - 함수 앞에 async(비동기란 뜻) 키워드 추가
    // - then 대신 await 키워드 사용 가능
    const loadData = useCallback(async ()=>{
        // const response = await axios({
        //     url:`http://localhost:8080/api/lecture/detail/${lectureNo}`,
        //     method:"get"
        // });
        //주의사항 : 함수가 async함수여야함 (따라서 effect에서는 못씀)
        const response = await axios.get(`/api/lecture/detail/${lectureNo}`);
        setLecture(response.data);
    }, []);

    //lecture삭제
    const deleteLecture = useCallback(async ()=> {
       const result = await Swal.fire({
            title: "정말 삭제하시겠습니까?",
            text:"삭제한 데이터는 복구하실 수 없습니다",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "삭제",
            cancelButtonText: "취소",
            confirmButtonColor: "#d63031",
            cancelButtonColor: "#b2bec3"
       });
       if(result.isConfirmed === false) return;

       const response = await axios.get(`/api/lecture/delete/${lectureNo}`);
       toast.error("강좌 삭제가 완료되었습니다.");
       navigate("/lecture/list");
    }, [lectureNo]);

    
    return(<>
        <Jumbotron title="강좌 상세" content={`${lectureNo}번 강좌의 상세 정보`}/>

        { lecture == null ? (<>
            <h1>로딩중입니다...</h1>
        </>) : (<>
        <Row className="mt-4 fs-3">
            <Col sm={3} className="text-info">
                제목
            </Col>
            <Col sm={9}>
                {lecture.lectureTitle}
            </Col>
        </Row>
        <Row className="mt-4 fs-3">
            <Col sm={3} className="text-info">
                카테고리
            </Col>
            <Col sm={9}>
                {lecture.lectureCategory}
            </Col>
        </Row>
        <Row className="mt-4 fs-3">
            <Col sm={3} className="text-info">
                유형
            </Col>
            <Col sm={9}>
                {lecture.lectureType}
            </Col>
        </Row>
        <Row className="mt-4 fs-3">
            <Col sm={3} className="text-info">
                가격
            </Col>
            <Col sm={9}>
                {lecture.lecturePrice}
            </Col>
        </Row>
        <Row className="mt-4 fs-3">
            <Col sm={3} className="text-info">
                강좌시간
            </Col>
            <Col sm={9}>
                {lecture.lectureDuration}
            </Col>
        </Row>

        <hr/>
         <Row className="mt-5">
            <Col className="text-end">
                <Button className="ms-2" variant="danger"
                    onClick={deleteLecture}>
                    <FaTrash className="me-2"/>
                    <span>삭제하기</span>
                </Button>
                <Button className="ms-2" variant="warning">
                    <FaPenToSquare className="me-2"/>
                    <span>수정하기</span>
                </Button>
                <Button className="ms-2" variant="secondary"
                        as={Link} to="/lecture/list">
                    <FaList className="me-2"/>
                    <span>목록으로</span>
                </Button>
            </Col>
        </Row>

        </>)}
    </>);
}