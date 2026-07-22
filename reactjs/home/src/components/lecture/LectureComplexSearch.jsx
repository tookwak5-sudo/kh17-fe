import Jumbotron from "@templates/Jumbotron"
import axios from "axios";
import { useCallback, useMemo, useState } from "react"
import { Button, Card, Col, Form, ListGroup, Row } from "react-bootstrap"
import { FaChevronDown, FaMagnifyingGlass } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { apiClient } from "@utils/reaxios";

export default function LectureComplexSearch() {
    //state
    const [condition, setCondition] = useState({
        lectureTitle: "",
        lectureCategories: [],
        lectureTypes: [],
        minLectureDuration:"",
        maxLectureDuration:"",
        minLecturePrice:"",
        maxLecturePrice:"",
        size: 10,
        orders:[],
    });
    const [lectureList, setLectureList] = useState([]);
    const [last, setLast] = useState(true);
    //callback
    const changeStringValue = useCallback((e)=>{
        const {name, value} = e.target;
        setCondition(prev=>({
            ...prev,
            [name] : value
        }));
    }, []);
    const changeNumericValue = useCallback((e)=>{
        const {name, value} = e.target;
        const replacement = value.replace(/[^0-9]+/g, "");
        setCondition(prev=>({
            ...prev,
            [name] : replacement
        }));
    }, []);

    const send = useCallback(async ()=> {
        const response = await apiClient.post("/lecture/complexSearch", condition);
        setLectureList(response.data.list);
        setLast(response.data.last);
    }, [condition]);
    const lastLectureNo = useMemo(()=>{
        if(lectureList.length === 0) return null;
        return lectureList[lectureList.length - 1].lectureNo;
    }, [lectureList]);
    const loadMoreList = useCallback(async ()=> {
        const response = await apiClient.post(
            "/lecture/complexSearch",
            {...condition, lastLectureNo : lastLectureNo}
        );
        setLectureList(prev=>[...prev, ...response.data.list]);
    }, [condition, lastLectureNo]);

    //view
    return(<>
        <Jumbotron title="강좌 복합 검색 예제" content="조건이 있을지 없을지 모르는 형태를 처리해봅시다" />

        {/* 검색 화면 */}
        <Row className="mt-4">
            <Form.Label column sm={3}>강좌명</Form.Label>
            <Col sm={9}>
                <Form.Control type="text" value={condition.lectureTitle}
                    name="lectureTitle" onChange={changeStringValue}/>
            </Col>
        </Row>

        <Row className="mt-4">
            <Col>
                <Button variant="success" size="lg" className="w-100"
                    onClick={send}>
                        <FaMagnifyingGlass className="me-2"/>
                        <span>검색하기</span>
                </Button>
            </Col>
        </Row>

        {/* 검색 결과 표시 */}
        <hr/>
         <Row className="mt-4">
            {lectureList.map((lecture) => (  
                <Col md={6} lg={4} key={lecture.lectureNo}>
                    <Card className="mb-3">
                        <Card.Header className="text-truncate">{lecture.lectureCategory}</Card.Header>
                        <Card.Body>
                            <Card.Title>{lecture.lectureTitle}</Card.Title>
                            <Card.Subtitle className="text-muted">{lecture.lectureType}</Card.Subtitle>
                        </Card.Body>
                        <Card.Body>
                            <Card.Text>강좌에 대한 설명들...</Card.Text>
                        </Card.Body>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                {lecture.lecturePrice.toLocaleString()}원
                            </ListGroup.Item>
                            <ListGroup.Item>
                                {lecture.lectureDuration.toLocaleString()}시간
                            </ListGroup.Item>
                            <ListGroup.Item>
                                1시간 당 {(lecture.lecturePrice / lecture.lectureDuration).toLocaleString()}원
                            </ListGroup.Item>
                        </ListGroup>
                        <Card.Body>
                            <Card.Link as={Link} to={`/lecture/detail/${lecture.lectureNo}`}>상세 정보 보기</Card.Link>
                        </Card.Body>
                    </Card>
                </Col>
            ))}
        </Row>

        {/* 더보기 버튼 */}
        {last === false && (
            <Row mt={2}>
                <Col>
                    <Button variant="outline-success" size="lg" className="w-100"
                        onClick={loadMoreList}>
                        <FaChevronDown />
                        <span className="mx-2">더보기</span>
                        <FaChevronDown />
                    </Button>
                </Col>
            </Row>
        )}
    </>)

}