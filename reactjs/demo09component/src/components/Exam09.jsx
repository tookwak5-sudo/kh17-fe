import { useCallback, useEffect, useState } from "react";
import Jumbotron from "./jumbotron";
import axios from "axios";
import { FaTrash } from "react-icons/fa6";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
function Exam09(){
    const [bookList, setBookList] = useState([]);
    useEffect(()=> {
        axios({
            url: "http://localhost:8080/api/book/list",
            method: "get",
        })
        .then(response => {
            console.log("서버의 응답", response);
            setBookList(response.data);
        })
    }, [])

    //callback
    const deleteBook = useCallback((target)=>{
        Swal.fire({
            title: "정말 삭제하시겠습니까?",
            text: "삭제 후에는 복구할 수 없습니다.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "삭제",
            cancelButtonText: "취소"
        })
        .then(result => {
            if(result.isConfirmed) {
                setBookList(
                    bookList.filter(book => book.bookId !== target.bookId)
                );
                toast.success("삭제가 완료되었습니다.");
            }
        })
    }, [bookList])

    return(<>
        <Jumbotron title="도서 목록"/>
        <div className="row mt-4">
            <div className="col">
               <ul className="list-group">
                {bookList.map(book=>(
                    <li className="list-group-item" key={book.bookId}>
                        <p className="text-muted">
                            <span>{book.bookGenre}</span>
                        </p>
                        <h3>{book.bookTitle}</h3>

                        {/* ??는 앞 항목이 null, undefined 등 확실하게 없는 경우 다음을 실행 */}
                        {/* ||는 앞 항목이 null, false, 0 등 부정적인 경우 다음을 실행 */}

                        {/* <div>지은이 : {book.bookAutor === null ? "없음" : book.bookAuthor}</div> */}
                        {/* <div>지은이 : {book.bookAutor || "없음"}</div> */}
                        <div>지은이 : {book.bookAutor ?? "없음"}</div>
                        <div>출판사 : {book.bookPublisher || "없음"}</div>

                        <div className="ms-4"> 
                            책에 대한 설명 ~~~~.
                        </div>

                        <div className="ms-4"> 
                            {book.bookPrice.toLocaleString()}원
                        </div>
                        <div className="ms-4"> 
                            {book.bookPageCount.toLocaleString()}p
                        </div>
                    </li>
                ))}
               </ul>
            </div>
        </div>
    </>);
}

export default Exam09;