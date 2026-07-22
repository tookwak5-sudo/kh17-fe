import Jumbotron from "@templates/Jumbotron";
import { Col, Form, Row } from "react-bootstrap";

export default function AccountPasswordChange() {

    return(<>
        <Jumbotron title="비밀번호 변경"/>

        <Row className="mt-4">
            <Form.Label column sm={3}>현재 비밀번호</Form.Label>
            <Col sm={0}>
                <Form.Control type="text" name="originPw"
                    placeholder="현재 비밀번호"/>
            </Col>
        </Row>
        <Row className="mt-4">
            <Form.Label column sm={3}>새 비밀번호</Form.Label>
            <Col sm={0}>
                <Form.Control type="text" name="changePw"
                    placeholder="새 비밀번호"/>
            </Col>
        </Row>
        <Row className="mt-4">
            <Form.Label column sm={3}>새 비밀번호 확인</Form.Label>
            <Col sm={0}>
                <Form.Control type="text" name="changePw"
                    placeholder="새 비밀번호 확인"/>
            </Col>
        </Row>
    </>)
}