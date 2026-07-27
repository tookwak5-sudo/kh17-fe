import Jumbotron from "@templates/Jumbotron";
import { Button, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function AccountNeedUpdate() {
    return(<>
        <Jumbotron title="비밀변호 변경이 필요합니다"/>
        <Row>
            <Col>
            <Button as={Link} to={`/account/password`}>
                <span>비밀번호 변경하기</span>
            </Button>
            </Col>
        </Row>
    </>)
}