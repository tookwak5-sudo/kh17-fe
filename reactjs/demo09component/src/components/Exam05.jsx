//import

import { useCallback, useEffect, useMemo, useState } from "react";
import Jumbotron from "./jumbotron";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from 'sweetalert2';
import 'sweetalert2/themes/bulma.css';
import { FaAsterisk, FaPlus } from "react-icons/fa6";
import { ClockLoader } from "react-spinners";
//function
function Exam05() {
    //state
    const [book, setBook] = useState({
        bookTitle: "",
        bookAuthor: "",
        bookPublisher: "",
        bookPublicationDate: "",
        bookPrice: "", // 숫자지만 미입력
        bookPageCount: "", //숫자지만 미입력
        bookGenre: "",
    });

    const [result, setResult] = useState({
        bookTitle: null,
        bookAuthor: null,
        bookPublisher: null,
        bookPublicationDate: null,
        bookPrice: null,
        bookPageCount: null,
        bookGenre: null,
    });

    const [loading, setLoading] = useState(false);

    //Callback
    const ChangeStringValue = useCallback((e) => {
        const { name, value } = e.target; //대상(event.target)에서 name과 value를 구조분해 방법으로 분리
        setBook({
            ...book, //나머지 유지
            [name]: value //입력값만 변경
        });
    }, [book]);
    const ChangeNumericValue = useCallback((e) => {
        const { name, value } = e.target;
        const regex = /[^0-9]+/g;
        const replacement = value.replace(regex, "");
        const newValue = parseInt(replacement);
        setBook({ ...book, [name]: newValue });
    });

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

    const clear = useCallback(() => {
        //입력값 정리
        setBook({
            bookTitle: "",
            bookAuthor: "",
            bookPublisher: "",
            bookPublicationDate: "",
            bookPrice: "", // 숫자지만 미입력
            bookPageCount: "", //숫자지만 미입력
            bookGenre: ""
        })
        //검사결과 정리
        setResult({
            bookTitle: null,
            bookAuthor: null,
            bookPublisher: null,
            bookPublicationDate: null,
            bookPrice: null,
            bookPageCount: null,
            bookGenre: null
        })
    }, []);

    //- 데이터 전송(등록)
    const send = useCallback(() => {
        //로딩 상태로 변경
        setLoading(true);

        axios({
            url: "http://localhost:8080/api/book/insert",
            method: "post",
            data: book,
        })
            // axios
            // .post("http://localhost:8080/api/book/insert", book)
            .then(response => {
                //sweetalert2 생성 코드
                Swal.mixin({
                    toast: true,
                    position: "bottom-start",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.onmouseenter = Swal.stopTimer;
                        toast.onmouseleave = Swal.resumeTimer;
                    }
                }).fire({
                    icon: "success",
                    title: "도서 등록"
                })
                clear();
            })
            .finally(()=>{//성공실패 관계없이 무조건 실행
               setLoading(false); 
            });
    }, [book]);

    //memo
    const valid = useMemo((e) => {
        if (result.bookTitle !== "is-valid") return false;
        if (result.bookAuthor === "is-invalid") return false;
        if (result.bookpublisher === "is-invalid") return false;
        if (result.bookPublicationDate === "is-invalid") return false;
        if (result.bookPrice !== "is-valid") return false;
        if (result.bookPageCount !== "is-valid") return false;
        if (result.bookGenre !== "is-valid") return false;
    }, [result]);

    //effect
    useEffect(() => {
        //처음에는 검사x
        if (result.bookGenre === null && book.bookGenre === "") return;
        //검사함수 실행
        checkBookGenre();
    }, [book.bookGenre, result.bookGenre])

    //view
    return (
        <>
            <Jumbotron title="도서 등록 화면" content="React를 활용해서 도서등록을 구현" />

            {/* 도서 등록 화면 */}
            {/* 도서명 */}
            <div className="row mt-4">
                <label className="col-sm-3 col-form-label">
                    <span>도서명</span>
                    <FaAsterisk className="text-danger" />
                </label>
                <div className="col-sm-9">
                    <input type="text" name="bookTitle"
                        value={book.bookTitle}
                        onChange={ChangeStringValue}
                        onBlur={checkBookTitle}
                        className={`form-control ${result.bookTitle}`}
                        placeholder="e.g., 어린왕자" />
                    <div className="valid-feedback">도서명이 설정되었습니다</div>
                    <div className="invalid-feedback">필수 입력 창 입니다</div>
                </div>
            </div>
            {/* 지은이 */}
            <div className="row mt-4">
                <label className="col-sm-3 col-form-label">
                    <span>지은이</span>
                </label>
                <div className="col-sm-9">
                    <input type="text" name="bookAuthor"
                        value={book.bookAuthor}
                        onChange={ChangeStringValue}
                        onBlur={checkBookAuthor}
                        className={`form-control ${result.bookAuthor}`}
                        placeholder="e.g., 강남" />
                    <div className="valid-feedback">지은이가 설정되었습니다</div>
                    {/* <div className="invalid-feedback">필수 입력 창 입니다</div> */}
                </div>
            </div>
            {/* 출판사 */}
            <div className="row mt-4">
                <label className="col-sm-3 col-form-label">
                    출판사
                </label>
                <div className="col-sm-9">
                    <input type="text" name="bookPublisher"
                        value={book.bookPublisher}
                        onChange={ChangeStringValue}
                        onBlur={checkBookPublisher}
                        className={`form-control ${result.bookPublisher}`} />
                    <div className="valid-feedback">출판사가 설정되었습니다</div>
                    {/* <div className="invalid-feedback">필수 입력 창 입니다</div> */}
                </div>
            </div>

            {/* 출간일 */}
            <div className="row mt-4">
                <label className="col-sm-3 col-form-label">
                    <span>출간일</span>
                    <FaAsterisk className="text-danger" />
                </label>
                <div className="col-sm-9">
                    <input type="date" name="bookPublicationDate"
                        value={book.bookPublicationDate}
                        onChange={ChangeStringValue}
                        onBlur={checkBookPublicationDate}
                        className={`form-control ${result.bookPublicationDate}`} />
                    <div className="valid-feedback">출간일이 설정되었습니다</div>
                    <div className="invalid-feedback">필수 입력 창 입니다</div>
                </div>
            </div>
            {/* 판매가 */}
            <div className="row mt-4">
                <label className="col-sm-3 col-form-label">
                    <span>판매가</span>
                    <FaAsterisk className="text-danger" />
                </label>
                <div className="col-sm-9">
                    <input type="text" inputMode="numeric" name="bookPrice"
                        value={book.bookPrice}
                        onChange={ChangeNumericValue}
                        onBlur={checkBookPrice}
                        className={`form-control ${result.bookPrice}`}
                        placeholder="0이상 1억원 미만" />
                    <div className="valid-feedback">가격이 설정되었습니다</div>
                    <div className="invalid-feedback">판매가는 0 이상 1억원이하로 설정해야 합니다</div>
                </div>
            </div>

            {/* 페이지 */}
            <div className="row mt-4">
                <label className="col-sm-3 col-form-label">
                    <span>페이지</span>
                    <FaAsterisk className="text-danger"></FaAsterisk>
                </label>
                <div className="col-sm-9">
                    <input type="text" inputMode="numeric" name="bookPageCount"
                        value={book.bookPageCount}
                        onChange={ChangeNumericValue}
                        onBlur={checkBookPageCount}
                        className={`form-control ${result.bookPageCount}`} />
                    <div className="valid-feedback">페이지 수가 설정되었습니다</div>
                    <div className="invalid-feedback">페이지 수는 0보다 커야합니다</div>
                </div>
            </div>

            {/* 장르 */}
            <div className="row mt-4">
                <label className="col-sm-3 col-form-label">
                    <span>장르</span>
                    <FaAsterisk className="text-danger" />
                </label>
                <div className="col-sm-9">
                    <select name="bookGenre"
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
                    </select>
                    <div className="valid-feedback">장르가 설정되었습니다</div>
                    <div className="invalid-feedback">필수 입력 창 입니다</div>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col">
                    <button type="button" className="btn btn-success w-100"
                        disabled={valid === false} onClick={send}>
                        <FaPlus className="me-2" />
                        <span>등록하기</span>
                    </button>
                </div>
            </div>


            {/* 로딩상태 (loading === true) 일 때 보여질 화면 */}
            {/* 3항연산자와 같은 방식,  &&: 앞부분이 true면 뒷 부분 확인하기 */}
            {/* { loading === true ? <h1>로딩중</h1> : false } */}
            {/* { loading === true && <h1>로딩중</h1> } */}
            { loading === true && (
            <div className="position-fixed top-0 start-0 
                        w-100 h-100 bg-dark bg-opacity-25
                        d-flex justify-content-center align-items-center">
                <div className="d-flex flex-column text-center">
                    <ClockLoader size={75} loading={loading} />
                    <p className="mt-2">등록중</p>
                </div>
            </div>
            ) }
        </>
    )
}

//export
export default Exam05;