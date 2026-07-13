import Jumbotron from "@templates/Jumbotron"
import axios from "axios";
import { useCallback, useState } from "react"
import { Col, Form, Row } from "react-bootstrap"

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
        const response = await axios.post("/api/lecture/complexSearch", condition);
        setLectureList(response.data.list);
        setLast(response.data.last);
    }, [condition]);

    //view
    return(<>
        <Jumbotron title="강좌 복합 검색 예제" content="조건이 있을지 없을지 모르는 형태를 처리해봅시다" />

        {/* 검색 화면 */}
        <Row className="mt-4">
            <Form.Label column sm={3}>강좌명</Form.Label>
            <Col sm={9}>
                <Form.Control type="text"/>
            </Col>
        </Row>
    </>)

}