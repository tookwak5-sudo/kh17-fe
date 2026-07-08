import { toast } from "react-toastify";
import Jumbotron from "@templates/Jumbotron";
import { Link, Navigate, useLoaderData, useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { Button, Col, Form, Row } from "react-bootstrap";
import { FaCheck, FaList, FaPenToSquare, FaSquare, FaSquarePen, FaTrash, FaXmark } from "react-icons/fa6";

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
        const response = await axios.get(`/api/lecture/${lectureNo}`);
        setLecture(response.data);
        setBackup(response.data);
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

       const response = await axios.delete(`/api/lecture/${lectureNo}`);
       toast.error("강좌 삭제가 완료되었습니다.");
       navigate("/lecture/list");
    }, [lectureNo]);

    // 수정을 구현하기 위해서 논리형 state와 백업용 state를 구현
    const [backup, setBackup] = useState(null);
    const [editMode, setEditMode] = useState({
        lectureTitle:false,
        lectureCategory:false,
        lectureDuration:false,
        lecturePrice:false,
        lectureType:false,
    });
    
    //입력 함수 
    const changeStringValue = useCallback(e=>{
        const {name, value} = e.target;
        setLecture({ ...lecture, [name] : value })
    }, [lecture]);
    const ChangeNumericValue = useCallback(e=>{
        const {name, value} = e.target;
        const regex = /[^0-9]+/g;
        const replacement = value.replace(regex, "");
        const number = parseInt(replacement || 0);
        setLecture({
            ...lecture,
            [name] : number
        });
    }, [lecture]);
    
    // 강좌 변경 함수
    const updateLecture = useCallback(async (field)=>{
        const response = await axios.patch(
            `/api/lecture/${lectureNo}`,
            { [field] : lecture[field] }
        );

        //백업을 갱신
        setBackup({...backup, [field] : lecture[field] });
        //수정모드를 취소
        setEditMode({...editMode, [field]:false});

    }, [lecture, backup, editMode]);

    const cancelUpdate = useCallback((field)=>{
        setLecture({ ...lecture, [field] : backup[field]});
        setEditMode({...editMode, [field]:false});
    }, [lecture, backup, editMode]);

    const startUpdate = useCallback((field)=>{
        setEditMode({...editMode, [field]:true});
    }, [editMode]);

    return(<>
        <Jumbotron title="강좌 상세" content={`${lectureNo}번 강좌의 상세 정보`}/>

        { lecture == null ? (<>
            <h1>로딩중입니다...</h1>
        </>) : (<>
        <Row className="mt-4 fs-3">
            <Col sm={3} className="text-info fw-bold">
                제목
            </Col>
            <Col sm={9}>
                { editMode.lectureTitle !== true ? (<>
                    <span>{lecture.lectureTitle}</span>
                    <FaSquarePen className="text-warning ms-2"
                        onClick={e=>startUpdate("lectureTitle")}/>
                </>) : (<>
                    <Form.Control type="text" className="w-auto d-inline-block"
                        name="lectureTitle" value={lecture.lectureTitle}
                        onChange={changeStringValue}/>
                        <FaCheck className="text-success ms-2"
                            onClick={e=>updateLecture("lectureTitle")}/>
                        <FaXmark className="text-danger ms-2"
                            onClick={e=>cancelUpdate("lectureTitle")}/>
                </>)}
            </Col>
        </Row>
        <Row className="mt-4 fs-3">
            <Col sm={3} className="text-info">
                카테고리
            </Col>
            <Col sm={9}>
                 { editMode.lectureCategory !== true ? (<>
                    <span>{lecture.lectureCategory}</span>
                    <FaSquarePen className="text-warning ms-2"
                        onClick={e=>startUpdate("lectureCategory")}/>
                </>) : (<>
                    <Form.Select className="w-auto d-inline-block"
                        name="lectureCategory" value={lecture.lectureCategory}
                        onChange={changeStringValue}>
                        <option>이론</option>
                        <option>실습</option>
                        <option>시험</option>
                    </Form.Select>
                        <FaCheck className="text-success ms-2"
                            onClick={e=>updateLecture("lectureCategory")}/>
                        <FaXmark className="text-danger ms-2"
                            onClick={e=>cancelUpdate("lectureCategory")}/>
                </>)}
            </Col>
        </Row>
        <Row className="mt-4 fs-3">
            <Col sm={3} className="text-info">
                유형
            </Col>
            <Col sm={9}>
                { editMode.lectureType !== true ? (<>
                    <span>{lecture.lectureType}</span>
                    <FaSquarePen className="text-warning ms-2"
                        onClick={e=>startUpdate("lectureType")}/>
                </>) : (<>
                    <Form.Select type="text" className="w-auto d-inline-block"
                        name="lectureType" value={lecture.lectureType}
                        onChange={changeStringValue}>
                        <option>온라인</option>
                        <option>오프라인</option>
                        <option>혼합</option>
                    </Form.Select>
                    <FaCheck className="text-success ms-2"
                        onClick={e=>updateLecture("lectureType")}/>
                    <FaXmark className="text-danger ms-2"
                        onClick={e=>cancelUpdate("lectureType")}/>
                </>)}
            </Col>
        </Row>
        <Row className="mt-4 fs-3">
            <Col sm={3} className="text-info">
                가격
            </Col>
            <Col sm={9}>
                { editMode.lecturePrice !== true ? (<>
                    <span>{lecture.lecturePrice}</span>
                    <FaSquarePen className="text-warning ms-2"
                        onClick={e=>startUpdate("lecturePrice")}/>
                </>) : (<>
                    <Form.Control type="text" className="w-auto d-inline-block"
                        name="lecturePrice" value={lecture.lecturePrice}
                        onChange={changeStringValue}/>
                        <FaCheck className="text-success ms-2"
                            onClick={e=>updateLecture("lecturePrice")}/>
                        <FaXmark className="text-danger ms-2"
                            onClick={e=>cancelUpdate("lecturePrice")}/>
                </>)}
            </Col>
        </Row>
        <Row className="mt-4 fs-3">
            <Col sm={3} className="text-info">
                강좌시간
            </Col>
            <Col sm={9}>
                { editMode.lectureDuration !== true ? (<>
                    <span>{lecture.lectureDuration}</span>
                    <FaSquarePen className="text-warning ms-2"
                        onClick={e=>startUpdate("lectureDuration")}/>
                </>) : (<>
                    <Form.Control type="text" className="w-auto d-inline-block"
                        name="lectureDuration" value={lecture.lectureDuration}
                        onChange={changeStringValue}/>
                        <FaCheck className="text-success ms-2"
                            onClick={e=>updateLecture("lectureDuration")}/>
                        <FaXmark className="text-danger ms-2"
                            onClick={e=>cancelUpdate("lectureDuration")}/>
                </>)}
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
                <Button className="ms-2" variant="warning"
                        as={Link} to={`/lecture/edit/${lectureNo}`}>
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