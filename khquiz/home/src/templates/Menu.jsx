import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from "react-router-dom";

export default function Menu() {

    return (<>
        <Navbar expand="md" className="bg-body-tertiary sticky-top"
            bg="dark" data-bs-theme="dark">
            <Container fluid>
                {/* 메인 브랜드 로고 */}
                <Navbar.Brand as={Link} to="/">KH정보교육원</Navbar.Brand>
                {/* 접이식 버튼(좁은 화면에서만 보임) */}
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                {/* 접이식 영역(좁은 화면에서만 보임) */}
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <NavDropdown title="게시판" id="basic-nav-dropdown">
                            <NavDropdown.Item as={Link} to="/anonymous">게시글 목록</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/anonymous/add">게시글 등록</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </>)
}