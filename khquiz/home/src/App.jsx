import { Col, Container, Row } from "react-bootstrap";
import Header from "./templates/Header";
import Body from "./templates/Body"
import Menu from "./templates/Menu"
import Footer from "./templates/Footer"

export default function App() {
  return (
    <Container fluid>
      {/* 헤더 */}
      <Row className="d-none d-md-block my-4">
        <Col className="py-2">
          <Header />
        </Col>
      </Row>

      {/* 메뉴 */}

      <Menu />

      {/* 본문 */}
      <Row className="my-4" style={{ minHeight: 450 }}>
        <Col sm={{ span: 10, offset: 1 }} md={{ span: 8, offset: 2 }}>
          <Body />
        </Col>
      </Row>

      <hr />
      {/* 푸터 */}
      <Row className="mt-4">
        <Col>
          <Footer />
        </Col>
      </Row>

    </Container>
  );
}