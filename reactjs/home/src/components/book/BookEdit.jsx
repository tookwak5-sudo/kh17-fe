import axios from "axios";
import {Row, Form, Col, Button} from "react-bootstrap";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import Jumbotron from "@templates/Jumbotron";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { FaAsterisk, FaPlus } from "react-icons/fa6";
import { ClockLoader } from "react-spinners";
import { apiClient } from "../../utils/reaxios";

export default function BookEdit() {
    const { bookId } = useParams();

    if (/^[0-9]+$/.test(bookId) === false) {
        toast.error("입력이 올바르지 않습니다");
        return <Navigate to="/book/list" replace />
    }

    const navigate = useNavigate();
    const [book, setBook] = useState({
        bookTitle: "",
        bookAuthor: "",
        bookPublicationDate: "",
        bookPrice: "",
        bookPublisher: "",
        bookPageCount: "",
        bookGenre: "",
    });
    
    useEffect(() => {
        loadData();
    }, []);

    const loadData = useCallback(async () => {
        const response = await apiClient.get(`/book/${bookId}`);
        console.log(response.data);
        setBook(response.data);
    }, []);

    const [result, setResult] = useState({
        bookTitle: "",//
        bookAuthor: "",
        bookPublicationDate: "",//
        bookPrice: "",//
        bookPublisher: "",
        bookPageCount: "",//
        bookGenre: "",//
    });

    //Callback
    const ChangeStringValue = useCallback((e) => {
        const { name, value } = e.target;
        setBook({
            ...book, //나머지 유지
            [name]: value //입력값만 변경
        });
    }, [book]);
    const ChangeNumericValue = useCallback((e) => {
        const { name, value } = e.target;
        const regex = /[^0-9]+/g;
        const replacement = value.replace(regex, "");
        const result = parseInt(replacement); //숫자로 변환
        if (result.length === 0) {
            setBook({
                ...book,
                [name]: replacement // []대괄호는 변수를 뜻함
            });
        } else {
            setBook({
                ...book,
                [name]: (result || 0) // []대괄호는 변수를 뜻함
            });
        }

    }, [book]);

    //검사하여 결과를 갱신하는 함수들
    const checkBookTitle = useCallback((e) => {
        const valid = book.bookTitle.length > 0;
        const clazz = valid ? "is-valid" : "is-invalid";
        setResult({
            ...result, // 나머지 유지
            bookTitle: clazz
        });

    }, [book, result]);

    const checkBookAuthor = useCallback((e) => {
        const regex = /^[^!@#$]+$/;
        const valid = book.bookAuthor.length === 0
            || regex.test(book.bookAuthor);
        const clazz = valid ? "is-valid" : "is-invalid";
        setResult({
            ...result, // 나머지 유지
            bookAuthor: clazz
        });

    }, [book.bookAuthor, result]);

    const checkBookPublisher = useCallback((e) => {
        setResult({
            ...result, // 나머지 유지
            bookPublisher: "is-valid"
        });

    }, [book.bookPublisher, result]);
    const checkBookPublicationDate = useCallback((e) => {
        const regex = /^([0-9]{4})-(((02)-(0[1-9]|1[0-9]|2[0-9]))|((0[469]|11)-(0[1-9]|1[0-9]|2[0-9]|30))|((0[13578]|1[02])-(0[1-9]|1[0-9]|2[0-9]|3[01])))$/;
        const valid = book.bookPublicationDate.length === 0
            || regex.test(book.bookPublicationDate);
        const clazz = valid ? "is-valid" : "is-invalid";
        setResult({
            ...result,
            bookPublicationDate: clazz
        });
    }, [book.bookPublicationDate, result]);

    const checkBookPrice = useCallback((e) => {
        const valid = book.bookPrice !== "" && book.bookPrice >= 0 && book.bookPrice <= 100000000;
        const clazz = valid ? "is-valid" : "is-invalid";
        setResult({
            ...result,
            bookPrice: clazz
        });
    }, [book.bookPrice, result]);

    const checkBookPageCount = useCallback((e) => {
        const valid = book.bookPageCount !== "" && book.bookPageCount > 0;
        const clazz = valid ? "is-valid" : "is-invalid";
        setResult({
            ...result,
            bookPageCount: clazz
        });
    }, [book.bookPageCount, result]);

    const checkBookGenre = useCallback((e) => {
        // const regex = /^(판타지|교양|소설|역사|과학|추리소설|자기계발|수험서)$/;
        // const valid = regex.test(book.bookGenre);
        const valid = ['판타지', '교양', '소설', '역사', '과학', '추리소설', '자기계발', '수험서'].includes(book.bookGenre);
        const clazz = valid ? "is-valid" : "is-invalid";
        setResult({
            ...result,
            bookGenre: clazz
        });
    }, [book.bookGenre, result]);

    const send = useCallback(async () => {
        const response = await apiClient.post("/book/", book);
        toast.success("도서 등록이 완료되었습니다");
        navigate("/book/list");
    }, [book]);

    useEffect(() => {
        //처음에는 검사x
        if (result.bookGenre === "" && book.bookGenre === "") return;
        //검사함수 실행
        checkBookGenre();
    }, [book.bookGenre, result.bookGenre])

    //memo
    const valid = useMemo(() => {
        if (result.bookTitle !== "is-valid") return false;
        if (result.bookAuthor === "is-invalid") return false;
        if (result.bookpublisher === "is-invalid") return false;
        if (result.bookPublicationDate === "is-invalid") return false;
        if (result.bookPrice !== "is-valid") return false;
        if (result.bookPageCount !== "is-valid") return false;
        if (result.bookGenre !== "is-valid") return false;
    }, [result]);

    return (<>
        <Jumbotron title="도서 수정 화면"/>

        {/* 도서 수정 화면 */}
        {/* 도서명 */}
        <Row className="mt-4">
            <Form.Label column sm={3}>
                <span>도서명</span>
                <FaAsterisk className="text-danger" />
            </Form.Label>
            <Col sm={9}>
                <Form.Control type="text" name="bookTitle"
                    value={book.bookTitle}
                    onChange={ChangeStringValue}
                    onBlur={checkBookTitle}
                    className={`form-control ${result.bookTitle}`}
                    placeholder="e.g., 어린왕자" />
                <div className="valid-feedback">도서명이 설정되었습니다</div>
                <div className="invalid-feedback">필수 입력 창 입니다</div>
            </Col>
        </Row>
        {/* 지은이 */}
        <Row className="mt-4">
            <Form.Label column sm={3}>
                <span>지은이</span>
            </Form.Label>
            <Col sm={9}>
                <Form.Control type="text" name="bookAuthor"
                    value={book.bookAuthor ?? ""}
                    onChange={ChangeStringValue}
                    onBlur={checkBookAuthor}
                    className={`form-control ${result.bookAuthor}`}
                    placeholder="e.g., 강남" />
                <div className="valid-feedback">지은이가 설정되었습니다</div>
                {/* <div className="invalid-feedback">필수 입력 창 입니다</div> */}
            </Col>
        </Row>
        {/* 출판사 */}
        <Row className="mt-4">
            <Form.Label column sm={3}>
                출판사
            </Form.Label>
            <Col sm={9}>
                <input type="text" name="bookPublisher"
                    value={book.bookPublisher ?? ""}
                    onChange={ChangeStringValue}
                    onBlur={checkBookPublisher}
                    className={`form-control ${result.bookPublisher}`} />
                <div className="valid-feedback">출판사가 설정되었습니다</div>
                {/* <div className="invalid-feedback">필수 입력 창 입니다</div> */}
            </Col>
        </Row>

        {/* 출간일 */}
        <Row className="mt-4">
            <Form.Label column sm={3}>
                <span>출간일</span>
                <FaAsterisk className="text-danger" />
            </Form.Label>
            <Col sm={9}>
                <Form.Control type="date" name="bookPublicationDate"
                    value={book.bookPublicationDate}
                    onChange={ChangeStringValue}
                    onBlur={checkBookPublicationDate}
                    className={`form-control ${result.bookPublicationDate}`} />
                <div className="valid-feedback">출간일이 설정되었습니다</div>
                <div className="invalid-feedback">필수 입력 창 입니다</div>
            </Col>
        </Row>
        {/* 판매가 */}
        <Row className="mt-4">
            <Form.Label column sm={3}>
                <span>판매가</span>
                <FaAsterisk className="text-danger" />
            </Form.Label>
            <Col sm={9}>
                <Form.Control type="text" inputMode="numeric" name="bookPrice"
                    value={book.bookPrice}
                    onChange={ChangeNumericValue}
                    onBlur={checkBookPrice}
                    className={`form-control ${result.bookPrice}`}
                    placeholder="0이상 1억원 미만" />
                <div className="valid-feedback">가격이 설정되었습니다</div>
                <div className="invalid-feedback">판매가는 0 이상 1억원이하로 설정해야 합니다</div>
            </Col>
        </Row>

        {/* 페이지 */}
        <Row className="mt-4">
            <Form.Label column sm={3}>
                <span>페이지</span>
                <FaAsterisk className="text-danger"></FaAsterisk>
            </Form.Label>
            <Col sm={9}>
                <Form.Control type="text" inputMode="numeric" name="bookPageCount"
                    value={book.bookPageCount}
                    onChange={ChangeNumericValue}
                    onBlur={checkBookPageCount}
                    className={`form-control ${result.bookPageCount}`} />
                <div className="valid-feedback">페이지 수가 설정되었습니다</div>
                <div className="invalid-feedback">페이지 수는 0보다 커야합니다</div>
            </Col>
        </Row>

        {/* 장르 */}
        <Row className="mt-4">
            <Form.Label column sm={3}>
                <span>장르</span>
                <FaAsterisk className="text-danger" />
            </Form.Label>
            <Col sm={9}>
                <Form.Select name="bookGenre"
                    value={book.bookGenre}
                    onChange={ChangeStringValue}
                    className={`form-control ${result.bookGenre}`}>
                    <option value="">선택하세요</option>
                    <option>판타지</option>
                    <option>교양</option>
                    <option>소설</option>
                    <option>역사</option>
                    <option>과학</option>
                    <option>추리소설</option>
                    <option>자기계발</option>
                    <option>수험서</option>
                </Form.Select>
                <div className="valid-feedback">장르가 설정되었습니다</div>
                <div className="invalid-feedback">필수 입력 창 입니다</div>
            </Col>
        </Row>

        <Row className="mt-4">
            <Col>
                <Button type="button" className="w-100"
                    disabled={valid === false} onClick={send}>
                    <FaPlus className="me-2" />
                    <span>수정하기</span>
                </Button>
            </Col>
        </Row>
    </>)
}