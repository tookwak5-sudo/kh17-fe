//import

import { useCallback, useEffect, useMemo, useState } from "react";
import Jumbotron from "./jumbotron";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from 'sweetalert2';
import 'sweetalert2/themes/bulma.css';
//function
function Exam05() {
    //state
    const [book, setBook] = useState({
        bookTitle : "",
        bookAuthor : "",
        bookPublisher : "",
        bookPublicationDate : "",
        bookPrice : "", // 숫자지만 미입력
        bookPageCount : "", //숫자지만 미입력
        bookGenre : ""
    });

    const [result, setResult] = useState({
        bookTitle : "",
        bookAuthor : "",
        bookPublisher : "",
        bookPublicationDate : "",
        bookPrice : "",
        bookPageCount : "",
        bookGenre : ""
    });
    
    //Callback
    const ChangeStringValue = useCallback((e)=>{
        const {name, value} = e.target;
        setBook({
            ...book, //나머지 유지
            [name] : value //입력값만 변경
        });
    }, [book]);
    const ChangeNumericValue = useCallback((e)=>{
        const {name, value} = e.target;
        const regex = /[^0-9]+/g;
        const replacement = value.replace(regex, "");
        if(replacement.length === 0){
            setBook({...book, [name] : replacement})
        }
        else{
            setBook({
                ...book, //나머지 유지
                [name] : parseInt(replacement)
            });
        }
    });

    //검사하여 결과를 갱신하는 함수들
    const checkBookTitle = useCallback((e)=>{
        const valid = book.bookTitle.length > 0;
        const clazz = valid ? "is-valid" : "is-invalid";
        setResult({
            ...result, // 나머지 유지
            bookTitle : clazz
        });

    }, [book.bookTitle, result]);

    const checkBookAuthor = useCallback((e)=>{
        const regex = /^[^!@#$]+$/;
        const valid = regex.test(book.bookAuthor);
        const clazz = valid ? "is-valid" : "is-invalid";
        setResult({
            ...result, // 나머지 유지
            bookAuthor : clazz
        });

    }, [book.bookAuthor, result]);

    const checkBookPublisher = useCallback((e)=>{
        const valid = book.bookPublisher.length > 0;
        const clazz = valid ? "is-valid" : "";
        setResult({
            ...result, // 나머지 유지
            bookPublisher : clazz
        });

    }, [book.bookPublisher, result]);
    const checkBookPublicationDate = useCallback((e)=>{
        const regex = /^([0-9]{4})-(((02)-(0[1-9]|1[0-9]|2[0-9]))|((0[469]|11)-(0[1-9]|1[0-9]|2[0-9]|30))|((0[13578]|1[02])-(0[1-9]|1[0-9]|2[0-9]|3[01])))$/;
        const valid = regex.test(book.bookPublicationDate);
        const clazz = valid ? "is-valid" : "";
        setResult({
            ...result,
            bookPublicationDate : clazz
        });
    }, [book.bookPublicationDate, result]);

    const checkBookPrice = useCallback((e)=>{
        const valid = book.bookPrice !== "" && book.bookPrice >= 0 && book.bookPrice <= 100000000;
        const clazz = valid ? "is-valid" : "is-invalid";
        setResult ({
            ...result,
            bookPrice : clazz
        });
    }, [book.bookPrice, result]);

    const checkBookPageCount = useCallback((e)=>{
        const valid = book.bookPageCount !== "" && book.bookPageCount > 0;
        const clazz = valid ? "is-valid" : "is-invalid";
        setResult ({
            ...result,
            bookPageCount : clazz
        });
    }, [book.bookPageCount, result]);

    const checkBookGenre = useCallback((e)=>{
        // const regex = /^(판타지|교양|소설|역사|과학|추리소설|자기계발|수험서)$/;
        // const valid = regex.test(book.bookGenre);
        const valid = ['판타지', '교양', '소설', '역사', '과학', '추리소설', '자기계발', '수험서'].includes(book.bookGenre);
        const clazz = valid ? "is-valid" : "is-invalid";
        setResult({
            ...result,
            bookGenre : clazz
        });
    }, [book.bookGenre, result]);
    
    //- 데이터 전송(등록)
    const send = useCallback(()=> {
        axios({
            url: "http://localhost:8080/api/book/insert",
            method: "post",
            data: book,
        })
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
            });

            //입력값 정리
            setBook({
                bookTitle : "",
                bookAuthor : "",
                bookPublisher : "",
                bookPublicationDate : "",
                bookPrice : "", // 숫자지만 미입력
                bookPageCount : "", //숫자지만 미입력
                bookGenre : ""
            })
            //검사결과 정리
            setResult({ 
                bookTitle : "",
                bookAuthor : "",
                bookPublisher : "",
                bookPublicationDate : "",
                bookPrice : "",
                bookPageCount : "",
                bookGenre : ""
            })
        })
    }, [book]);

    //memo
    const valid = useMemo((e)=>{
        if(result.bookTitle !== "is-valid") return false; 
        if(result.bookAuthor !== "is-valid") return false; 
        if(result.bookPrice !== "is-valid") return false; 
        if(result.bookPageCount !== "is-valid") return false; 
        if(result.bookGenre !== "is-valid") return false; 
    });

    //effect
    useEffect(()=>{
        //처음에는 검사x
        if(result.bookGenre === "" && book.bookGenre === "") return;
        //검사함수 실행
        checkBookGenre();
    }, [book.bookGenre, result.bookGenre])

    //view
    return(
        <>
            <Jumbotron title="도서 등록 화면" content="React를 활용해서 도서등록을 구현"/>
            
            {/* 도서 등록 화면 */}
            {/* 도서명 */}
            <div className="row mt-4">
                <label className="col-sm-3 col-form-label">
                    도서명<span className="text-danger">*</span>
                </label>
                <div className="col-sm-9">
                    <input type="text" name="bookTitle" 
                            value={book.bookTitle}
                            onChange={ChangeStringValue}
                             onBlur={checkBookTitle}
                                className={`form-control ${result.bookTitle}`}/>
                    <div className="valid-feedback">강좌명이 설정되었습니다</div>
                    <div className="invalid-feedback">필수 입력 창 입니다</div>
                </div>
            </div>
            {/* 지은이 */}
            <div className="row mt-4">
                <label className="col-sm-3 col-form-label">
                    지은이<span className="text-danger">*</span>
                </label>
                <div className="col-sm-9">
                    <input type="text" name="bookAuthor" 
                            value={book.bookAuthor}
                            onChange={ChangeStringValue}
                             onBlur={checkBookAuthor}
                                className={`form-control ${result.bookAuthor}`}/>
                    <div className="valid-feedback">지은이가 설정되었습니다</div>
                    <div className="invalid-feedback">필수 입력 창 입니다</div>
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
                                className={`form-control ${result.bookPublisher}`}/>
                    <div className="valid-feedback">출판사가 설정되었습니다</div>
                    {/* <div className="invalid-feedback">필수 입력 창 입니다</div> */}
                </div>
            </div>

            {/* 출간일 */}
            <div className="row mt-4">
                <label className="col-sm-3 col-form-label">
                    출간일
                </label>
                <div className="col-sm-9">
                    <input type="date" name="bookPublicationDate" 
                            value={book.bookPublicationDate}
                            onChange={ChangeStringValue}
                             onBlur={checkBookPublicationDate}
                                className={`form-control ${result.bookPublicationDate}`}/>
                    <div className="valid-feedback">출간일이 설정되었습니다</div>
                    {/* <div className="invalid-feedback">필수 입력 창 입니다</div> */}
                </div>
            </div>
            {/* 판매가 */}
            <div className="row mt-4">
                <label className="col-sm-3 col-form-label">
                    판매가<span className="text-danger">*</span>
                </label>
                <div className="col-sm-9">
                    <input type="text" inputMode="numeric" name="bookPrice" 
                            value={book.bookPrice}
                            onChange={ChangeNumericValue}
                            onBlur={checkBookPrice}
                            className={`form-control ${result.bookPrice}`}
                            placeholder="0이상 1억원 미만"    />
                    <div className="valid-feedback">가격이 설정되었습니다</div>
                    <div className="invalid-feedback">판매가는 0 이상 1억원이하로 설정해야 합니다</div>
                </div>
            </div>

            {/* 페이지 */}
            <div className="row mt-4">
                <label className="col-sm-3 col-form-label">
                    페이지<span className="text-danger">*</span>
                </label>
                <div className="col-sm-9">
                    <input type="text" inputMode="numeric" name="bookPageCount" 
                            value={book.bookPageCount}
                            onChange={ChangeNumericValue}
                             onBlur={checkBookPageCount}
                                className={`form-control ${result.bookPageCount}`}/>
                    <div className="valid-feedback">페이지 수가 설정되었습니다</div>
                    <div className="invalid-feedback">페이지 수는 0보다 커야합니다</div>
                </div>
            </div>

            {/* 장르 */}
            <div className="row mt-4">
                <label className="col-sm-3 col-form-label">
                    장르<span className="text-danger">*</span>
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
                    disabled={valid === false} onClick={send}>신규 도서 등록하기</button>
                </div>
            </div>
        </>
    )
}

//export
export default Exam05;