import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Jumbotron from "@templates/Jumbotron";
import { Button, Col, Form, Row } from "react-bootstrap";
import { FaCheck, FaList, FaPenToSquare, FaSquarePen, FaTrash, FaXmark } from "react-icons/fa6";
import { toast } from "react-toastify";
import { apiClient } from "../../utils/reaxios";

export default function BookDetail() {
    const { bookId } = useParams();

    if(/^[0-9]+$/.test(bookId) === false) {
        toast.error("입력이 올바르지 않습니다");
        return <Navigate to="/book/list" replace/>
    }

    const navigate = useNavigate();
    const [book, setBook] = useState(null);

    useEffect(()=>{
        loadData();
    }, []);

    const loadData = useCallback(async ()=>{
        const response = await apiClient.get(`/book/${bookId}`);
        setBook(response.data);
        setBackup(response.data);
    }, []);

    const deleteBook = useCallback(async ()=>{
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

        const response = await apiClient.delete(`/book/${bookId}`);
        toast.error("도서 삭제가 완료되었습니다");
        navigate("/book/list");
    }, [bookId]);

    const [backup, setBackup] = useState(null);
    const [editMode, setEditMode] = useState({
        bookTitle : false,
        bookAuthor : false,
        bookPublicationDate : false,
        bookPrice : false,
        bookPublisher : false,
        bookPageCount : false,
        bookGenre : false,
    });

    //입력 함수
    const changeStringValue = useCallback(e=>{
        const {name, value} = e.target;
        setBook({ ...book, [name] : value })
    }, [book]);
    const changeNumericValue = useCallback(e=>{
        const {name, value} = e.target;
        const regex = /[^0-9]+/g;
        const replacement = value.replace(regex, "");
        const number = parseInt(replacement || 0);
        setBook({
            ...book,
            [name] : number
        });
    }, [book]);

    //도서정보 변경하는 함수
    const updateBook = useCallback(async (field)=>{
        const response = await apiClient.patch(
            `/book/${bookId}`, 
            { [field] : book[field]}
        );

        //백업을 갱신
        setBackup({...backup, [field]:book[field] });
        //수정모드를 취소
        setEditMode({...editMode, [field]:false});
        //알림(옵션)
        toast.success("정보가 변경되었습니다.");
    }, [book, backup, editMode]);

    const cancelUpdate = useCallback((field)=>{
        setBook({...book, [field]: backup[field]});
        setEditMode({...editMode, [field] : false});
        toast.error("정보 변경이 취소되었습니다");
    }, [book, backup, editMode]);

    const startUpdate = useCallback((field)=>{
        setEditMode({...editMode, [field] : true});
    }, [editMode]);

   return(<>
            <Jumbotron title="도서 수정 화면"/>

            {/* 도서 등록 화면 */}
            {/* 도서명 */}
            { book === null ? (
                <h1>로딩중입니다...</h1>
            ) : (<>
                <Row className="mt-4">
                    <Col sm={3} className="text-info fw-bold">
                        도서명
                    </Col>
                    <Col sm={9}>
                        { editMode.bookTitle !== true ? (<>
                            <span>{book.bookTitle}</span>
                            <FaSquarePen className="text-warning ms-2"
                                onClick={e=>startUpdate("bookTitle")}/>
                        </>) : (<>
                        <Form.Control type="text" className="w-auto d-inline-block"
                            name="bookTitle" value={book.bookTitle}
                            onChange={changeStringValue}/>
                            <FaCheck className="text-success ms-2"
                                    onClick={e=>updateBook("bookTitle")}/>
                            <FaXmark className="text-danger ms-2"
                                    onClick={e=>cancelUpdate("bookTitle")}/>
                        </>) }
                    </Col>
                </Row>

                <Row className="mt-4">
                    <Col sm={3} className="text-info fw-bold">
                        지은이
                    </Col>
                    <Col sm={9}>
                        { editMode.bookAuthor !== true ? (<>
                        <span>{book.bookAuthor}</span>
                        <FaSquarePen className="text-warning ms-2"
                            onClick={e=>startUpdate("bookAuthor")}/>
                        </>) : (<>
                        <Form.Control type="text" className="w-auto d-inline-block"
                            name="bookAuthor" value={book.bookAuthor}
                            onChange={changeStringValue}/>
                            <FaCheck className="text-success ms-2"
                                    onClick={e=>updateBook("bookAuthor")}/>
                            <FaXmark className="text-danger ms-2"
                                    onClick={e=>cancelUpdate("bookAuthor")}/>
                        </>) }
                    </Col>
                </Row>
                 <Row className="mt-4">
                    <Col sm={3} className="text-info fw-bold">
                        출판사
                    </Col>
                    <Col sm={9}>
                        { editMode.bookPublisher !== true ? (<>
                        <span>{book.bookPublisher}</span>
                        <FaSquarePen className="text-warning ms-2"
                            onClick={e=>startUpdate("bookPublisher")}/>
                        </>) : (<>
                        <Form.Control type="text" className="w-auto d-inline-block"
                            name="bookPublisher" value={book.bookPublisher}
                            onChange={changeStringValue}/>
                            <FaCheck className="text-success ms-2"
                                    onClick={e=>updateBook("bookPublisher")}/>
                            <FaXmark className="text-danger ms-2"
                                    onClick={e=>cancelUpdate("bookPublisher")}/>
                        </>) }
                    </Col>
                </Row>
                <Row className="mt-4">
                    <Col sm={3} className="text-info fw-bold">
                        출간일
                    </Col>
                    <Col sm={9}>
                        { editMode.bookPublicationDate !== true ? (<>
                        <span>{book.bookPublicationDate}</span>
                        <FaSquarePen className="text-warning ms-2"
                            onClick={e=>startUpdate("bookPublicationDate")}/>
                        </>) : (<>
                        <Form.Control type="date" className="w-auto d-inline-block"
                            name="bookPublicationDate" value={book.bookPublicationDate}
                            onChange={changeStringValue}/>
                            <FaCheck className="text-success ms-2"
                                    onClick={e=>updateBook("bookPublicationDate")}/>
                            <FaXmark className="text-danger ms-2"
                                    onClick={e=>cancelUpdate("bookPublicationDate")}/>
                        </>) }
                    </Col>
                </Row>
                 <Row className="mt-4">
                    <Col sm={3} className="text-info fw-bold">
                        판매가
                    </Col>
                    <Col sm={9}>
                        { editMode.bookPrice !== true ? (<>
                        <span>{book.bookPrice}</span>
                        <FaSquarePen className="text-warning ms-2"
                            onClick={e=>startUpdate("bookPrice")}/>
                        </>) : (<>
                        <Form.Control type="date" className="w-auto d-inline-block"
                            name="bookPrice" value={book.bookPrice}
                            onChange={changeNumericValue}/>
                            <FaCheck className="text-success ms-2"
                                    onClick={e=>updateBook("bookPrice")}/>
                            <FaXmark className="text-danger ms-2"
                                    onClick={e=>cancelUpdate("bookPrice")}/>
                        </>) }
                    </Col>
                </Row>
                <Row className="mt-4">
                    <Col sm={3} className="text-info fw-bold">
                        페이지
                    </Col>
                    <Col sm={9}>
                        { editMode.bookPageCount !== true ? (<>
                        <span>{book.bookPageCount}</span>
                        <FaSquarePen className="text-warning ms-2"
                            onClick={e=>startUpdate("bookPageCount")}/>
                        </>) : (<>
                        <Form.Control type="text" className="w-auto d-inline-block"
                            name="bookPageCount" value={book.bookPageCount}
                            onChange={changeNumericValue}/>
                            <FaCheck className="text-success ms-2"
                                    onClick={e=>updateBook("bookPageCount")}/>
                            <FaXmark className="text-danger ms-2"
                                    onClick={e=>cancelUpdate("bookPageCount")}/>
                        </>) }
                    </Col>
                </Row>
                <Row className="mt-4">
                    <Col sm={3} className="text-info fw-bold">
                        장르
                    </Col>
                    <Col sm={9}>
                        { editMode.bookGenre !== true ? (<>
                        <span>{book.bookGenre}</span>
                        <FaSquarePen className="text-warning ms-2"
                            onClick={e=>startUpdate("bookGenre")}/>
                        </>) : (<>
                        <Form.Select className="w-auto d-inline-block"
                            name="bookPageCount" value={book.bookGenre}
                            onChange={changeStringValue}>
                            <option>판타지</option>
                            <option>교양</option>
                            <option>소설</option>
                            <option>역사</option>
                            <option>과학</option>
                            <option>추리소설</option>
                            <option>자기계발</option>
                            <option>수험서</option>
                        </Form.Select>
                        <FaCheck className="text-success ms-2"
                                onClick={e=>updateBook("bookGenre")}/>
                        <FaXmark className="text-danger ms-2"
                                onClick={e=>cancelUpdate("bookGenre")}/>
                        </>) }
                    </Col>
                </Row>
            </>)}
            
            <hr/>
            <Row className="mt-5">
                <Col className="text-end">
                    <Button className="ms-2" variant="danger"
                        onClick={deleteBook}>
                        <FaTrash className="me-2"/>
                        <span>삭제하기</span>
                    </Button>
                    <Button className="ms-2" variant="warning"
                        as={Link} to={`/book/edit/${bookId}`}>
                        <FaPenToSquare className="me-2"/>
                        <span>수정하기</span>
                    </Button>
                    <Button className="ms-2" variant="secondary"
                            as={Link} to="/country/list">
                        <FaList className="me-2"/>
                        <span>목록으로</span>
                    </Button>
                </Col>
            </Row>
        </>);
}