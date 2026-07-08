import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { FaPlus, FaTrash } from "react-icons/fa6";
import Swal from "sweetalert2";
import Jumbotron from "@templates/Jumbotron";
import { Button, Card, Col, ListGroup, Row } from "react-bootstrap";
import { ClockLoader } from "react-spinners";
import { FaChevronDown } from "react-icons/fa6";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";

export default function LectureList() {
    //state
    const [lectureList, setLectureList] = useState([]);
    const [last, setLast] = useState(false);
    const [size, setSize] = useState(10);

    const [loading, setLoading] = useState(false);

    //effect
    useEffect(() => {
        loadMoreList();
    }, []);

    //callback
    // const loadMoreList = useCallback(() => {
    //     const dataSize = lectureList.length;
    //     const lastLectureNo = dataSize === 0 ? 0 : lectureList[dataSize - 1].lectureNo;
    //     setLoading(true);

    //     axios({
    //         url: "http://localhost:8080/api/lecture/listForReact",
    //         method: "get",
    //         params: {
    //             lastLectureNo: lastLectureNo,
    //             size: size
    //         }
    //     })
    //         .then(response => {
    //             setLectureList([...lectureList, ...response.data.list]);
    //             setLast(response.data.last);
    //         })
    //         .finally(() => {
    //             setLoading(false);
    //         });
    // }, [lectureList, size]);

    const loadMoreList = useCallback(async () => {
        //이미 로딩중이면 차단
        if(loading === true) return;
        setLoading(true);

        const dataSize = lectureList.length;
        const lastLectureNo = dataSize === 0 ? 2147483647 : lectureList[dataSize - 1].lectureNo;

        const response = await axios.get(
            `/api/lecture/lastLectureNo/${lastLectureNo}/size/${size}`
        );
        //덮어쓰기가 아니라 추가 가 필요
        setLectureList([...lectureList, ...response.data.list]);
        setLast(response.data.last);         
        setLoading(false);        
    }, [lectureList, size]);

    return (<>
        <Jumbotron title="강좌 목록" />

        <Row mt={4}>
            <Col xs={6}>
                <Form.Select value={size} onChange={e => setSize(parseInt(e.target.value))}>
                    <option value="5">5개씩 보기</option>
                    <option value="10">10개씩 보기</option>
                    <option value="20">20개씩 보기</option>
                    <option value="50">50개씩 보기</option>
                </Form.Select>
            </Col>
            <Col xs={6} className="text-end">
                <Button as={Link} to="/lecture/add" variant="success">
                    <FaPlus />
                    <span className="ms-2">신규등록</span>
                </Button>
            </Col>
        </Row>

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

        {/* 로딩화면 */}
        {loading === true && (
            <div className="position-fixed top-0 start-0 
                    w-100 h-100 bg-dark bg-opacity-25
                    d-flex justify-content-center align-items-center">
                <div className="d-flex flex-column text-center">
                    <ClockLoader size={75} loading={loading} />
                    <p className="mt-2">불러오는중</p>
                </div>
            </div>
        )}
    </>);
}