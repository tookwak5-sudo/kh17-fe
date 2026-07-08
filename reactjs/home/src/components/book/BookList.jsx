import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { FaChevronDown, FaPlus, FaTrash } from "react-icons/fa6";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Jumbotron from "@templates/Jumbotron";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/esm/Button";
import { ClockLoader } from "react-spinners";

export default function BookList() {
    const [bookList, setBookList] = useState([]);
    const [last, setLast] = useState(false);
    const [size, setSize] = useState(10);
    
    const [loading, setLoading] = useState(false);

    //effect
    useEffect(() => {
        loadMoreList();
    }, []);

    const loadMoreList = useCallback(async ()=>{
        //이미 로딩중이면 차단
        if(loading === true) return;
        setLoading(true);
        const dataSize = bookList.length;
        const lastBookId = dataSize === 0 ? 2147483647  : bookList[dataSize-1].bookId;

        const response = await axios.post(
            `/api/book/list-more`,
            { lastNo : lastBookId, size : size}
        )
        setBookList([...bookList, ...response.data.list]); //이어쓰기
        setLast(response.data.last);

        setLoading(false);

    }, [bookList, size]);

    //view
    return(<>
        <Jumbotron title="도서 목록"/>
        
        <Row mt={4}>
            <Col xs={6}>
                <Form.Select value={size} onChange={e=>setSize(parseInt(e.target.value))}>
                    <option value="5">5개씩 보기</option>
                    <option value="10">10개씩 보기</option>
                    <option value="20">20개씩 보기</option>
                    <option value="50">50개씩 보기</option>
                </Form.Select>
            </Col>
            <Col xs={6} className="text-end">

                <Button as={Link} to="/book/add" variant="success">
                    <FaPlus/>
                    <span className="ms-2">신규 등록</span>
                </Button>
            </Col>
        </Row>

        <Row className="mt-4">
            <Col>
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
                        <div className="ms-4 text-end">
                            <Link to={`/book/detail/${book.bookId}`}>상세 정보 보기</Link>
                        </div>
                    </li>
                ))}
               </ul>
            </Col>
        </Row>

         {/* 더보기 버튼 */}
        { last === false && (
        <Row mt={2}>
            <Col>
                <Button variant="outline-success" size="lg" onClick={loadMoreList}>
                    <FaChevronDown/>
                    <span className="mx-2">더보기</span>
                    <FaChevronDown/>
                </Button>
            </Col>
        </Row>
        )}

        {/* 로딩화면 */}
        { loading === true && (
        <div className="position-fixed top-0 start-0 
                    w-100 h-100 bg-dark bg-opacity-25
                    d-flex justify-content-center align-items-center">
            <div className="d-flex flex-column text-center">
                <ClockLoader size={75} loading={loading} />
                <p className="mt-2">불러오는중</p>
            </div>
        </div>
        )}
    </>);
}