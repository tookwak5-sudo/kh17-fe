import Jumbotron from "@templates/Jumbotron";
import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge, Button, Col, Container, Form, ListGroup, ListGroupItem, Modal, Row } from "react-bootstrap";
import { FaAsterisk, FaChevronDown, FaPlus, FaSquarePen, FaTrash, FaXmark } from "react-icons/fa6";
import { replace } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function BookSpa() {
    //모달을 띄우기 위한 state
    const [modal, setModal] = useState(false);

    const closeModal = useCallback(() => {
        resetBook();
        setModal(false);
    }, [])

    //목록
    const [bookList, setBookList] = useState([]);
    const [last, setLast] = useState(false);
    const [size, setSize] = useState(10);
    const lastBookId = useMemo(() => {
        return bookList.length > 0 ? bookList[bookList.length - 1].bookId : 0;
    }, [bookList]); //bookList가 변할때마다 마지막 아이디를 찾는건 좋은 방법(개발자도구에서 모니터링 가능)
    const loadList = useCallback(async () => {
        // const response = await axios.get(`/api/book/lastBookId/${lastBookId}/size/${size}`);
        const response = await axios.post(
            "/api/book/list-more",
            { lastNo: lastBookId, size: size }
        );
        // setBookList(response.data.list);//덮어쓰기
        setBookList([...bookList, ...response.data.list]); //이어쓰기
        setLast(response.data.last);
    }, [lastBookId, size]);

    useEffect(() => {
        loadList();
    }, []);


    //등록
    const [book, setBook] = useState({
        bookTitle: "",
        bookAuthor: "",
        bookPublisher: "",
        bookPublicationDate: "",
        bookPrice: 0,
        bookPageCount: 0,
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

    const ChangeStringValue = useCallback(e => {
        // const name = e.target.name;
        // const value = e.target.value;
        const { name, value } = e.target;
        setBook({ ...book, [name]: value });
    }, [book])
    const ChangeNumericValue = useCallback(e => {
        const { name, value } = e.target;
        const replacement = value.replace(/[^0-9]+/g, "");
        const number = parseInt(replacement || 0);
        setBook({ ...book, [name]: number });
    }, [book]);

    //검사하여 결과를 갱신하는 함수들
     const checkBookTitle = useCallback((e) => {
        const valid = book.bookTitle.length > 0;
        const clazz = valid ? "is-valid" : "is-invalid";
        
        //아래와 같이 setResuilt를 하면 여러개의 setResult가 실행될 때 순차실행이 안된다(비동기 실행)
        // setResult({
        //     ...result, // 나머지 유지
        //     bookTitle: clazz
        // });
        // 만약 동시 다발적인 setResult가 발생할 수 있고 이 경우 순차적인 실행을 원한다면 (동기 실행)
        setResult(prev=>({
            ...prev,
            bookTitle : valid ? "is-valid" : "is-invalid"
        }))
    }, [book, result]);

    const checkBookAuthor = useCallback((e) => {
        const regex = /^[^!@#$]+$/;
        // const valid = book.bookAuthor?.length === 0
        //     || regex.test(book.bookAuthor);
        const valid = !book.bookAuthor
            || regex.test(book.bookAuthor);
        const clazz = valid ? "is-valid" : "is-invalid";
        // setResult({
        //     ...result, // 나머지 유지
        //     bookAuthor: clazz
        // });
        setResult(prev=>({
            ...prev,
            bookAuthor : clazz
        }));
    }, [book.bookAuthor, result]);

    const checkBookPublisher = useCallback((e) => {
        // setResult({
        //     ...result, // 나머지 유지
        //     bookPublisher: "is-valid"
        // });
        setResult(prev=>({
            ...prev,
            bookPublisher : "is-valid"
        }));

    }, [book.bookPublisher, result]);
    const checkBookPublicationDate = useCallback((e) => {
        const regex = /^([0-9]{4})-(((02)-(0[1-9]|1[0-9]|2[0-9]))|((0[469]|11)-(0[1-9]|1[0-9]|2[0-9]|30))|((0[13578]|1[02])-(0[1-9]|1[0-9]|2[0-9]|3[01])))$/;
        const valid = !book.bookPublicationDate
            || regex.test(book.bookPublicationDate);
        const clazz = valid ? "is-valid" : "is-invalid";
        // setResult({
        //     ...result,
        //     bookPublicationDate: clazz
        // });
        setResult(prev=>({
            ...prev,
            bookPublicationDate : clazz
        }));
    }, [book.bookPublicationDate, result]);

    const checkBookPrice = useCallback((e) => {
        const valid = book.bookPrice !== "" && book.bookPrice >= 0 && book.bookPrice <= 100000000;
        const clazz = valid ? "is-valid" : "is-invalid";
        // setResult({
        //     ...result,
        //     bookPrice: clazz
        // });
        setResult(prev=>({
            ...prev,
            bookPrice : clazz
        }));
    }, [book.bookPrice, result]);

    const checkBookPageCount = useCallback((e) => {
        const valid = book.bookPageCount !== "" && book.bookPageCount > 0;
        const clazz = valid ? "is-valid" : "is-invalid";
        // setResult({
        //     ...result,
        //     bookPageCount: clazz
        // });
        setResult(prev=>({
            ...prev,
            bookPageCount : clazz
        }));
    }, [book.bookPageCount, result]);

    const checkBookGenre = useCallback((e) => {
        // const regex = /^(판타지|교양|소설|역사|과학|추리소설|자기계발|수험서)$/;
        // const valid = regex.test(book.bookGenre);
        const valid = ['판타지', '교양', '소설', '역사', '과학', '추리소설', '자기계발', '수험서'].includes(book.bookGenre);
        const clazz = valid ? "is-valid" : "is-invalid";
        // setResult({
        //     ...result,
        //     bookGenre: clazz
        // });
        setResult(prev=>({
            ...prev,
            bookGenre : clazz
        }));
    }, [book.bookGenre, result]);

    const allValid = useMemo(() => {
        if (result.bookTitle !== "is-valid") return false; // 필수
        if (result.bookAuthor === "is-invalid") return false; //선택
        if (result.bookPublisher === "is-invalid") return false; //선택
        if (result.bookPublicationDate === "is-invalid") return false; //선택
        if (result.bookPrice !== "is-valid") return false; //필수
        if (result.bookPageCount !== "is-valid") return false; //필수
        if (result.bookGenre !== "is-valid") return false; //필수
        return true;
    }, [result]);

    const resetBook = useCallback(() => {
        setBook({
            bookTitle: "",
            bookAuthor: "",
            bookPublisher: "",
            bookPublicationDate: "",
            bookPrice: 0,
            bookPageCount: 0,
            bookGenre: "",
        })
        setResult({
            bookTitle: null,
            bookAuthor: null,
            bookPublisher: null,
            bookPublicationDate: null,
            bookPrice: null,
            bookPageCount: null,
            bookGenre: null,
        });
    }, [book]);

    useEffect(() => {
    //처음에는 검사x
    if (result.bookGenre === null && book.bookGenre === "") return;
    //검사함수 실행
    checkBookGenre();
    }, [book.bookGenre, result.bookGenre])

    //전송
    const save = useCallback(async ()=>{
        const response = await axios.post("/api/book/", book);
        toast.success("신규 도서가 등록되었습니다.");
        // setModal(false); //모달 닫는 건 맞지만, (권장하지 않음)
        closeModal(); //모달을 닫는 함수를 부른다 (권장)

        //목록 갱신을 어떻게 할 것인가?
        //1. 내가 등록한 데이터만 목록 맨 앞에 추가한다 (갱신한 척 한다)
        //2. 진짜 목록을 갱신한다

        //1. setBookList([신규정보, 기존목록]); //근데 등록을 하는데 목록을 감시?
        //- 연관 항목으로 설정되어 있어야 기존 값을 알아낼 수 있음
        //setBookList([response.data, ...bookList]);  연관항목 , [book, bookList]

        //- 값 변경을 함수 형태로 설정하면 과거값을 추적하지 않아도 사용 가능
        setBookList(prev=>([response.data, ...prev]));
    }, [book /* , bookList */]);
    const edit = useCallback(async ()=>{
        const response = await axios.put(`/api/book/${book.bookId}`, book);
        toast.success(`${book.bookId}번 도서 정보 변경완료`);
        closeModal();
        //서버의 응답 결과(response.data)를 bookList에서 찾아서 덮어쓰기 한다(목록이 갱신된 척 한다)
        //setBookList(bookList.map(...)); <- 연관함수 bookList필수
        setBookList(prev=>prev.map(
            book=>{
                if(book.bookId === response.data.bookId) { //내가 찾던 책이면
                    return {...response.data}; //서버가 보내준 결과로 바꿔주고
                }
                return {...book}; //나머지는 그대로 재사용
            }
        ));
    }, [book]);
    // 모달을 띄우는 함수
    const openModal = useCallback(()=>{
        setModal(true);
    }, []);
    const openModalToEdit = useCallback(target=>{
        //setBook(target); //target이 바라보는 대상을 동일하게 바라보도록 설정해라(얕은복사, shallow copy)
        setBook({...target}); //target의 모든 데이터를 복사해서 쳐다보도록 설정해라 (깊은복사, deep copy)
        openModal();
    }, []);

    const isAddMode = useMemo(()=>{
        return book.bookId === undefined;
    }, [book]);

    //isAddMode가 true가 되면 수정이 시작되었다는 뜻이므로 검사를 한ㅂ너 수행해두자
    useEffect(()=>{
        if(isAddMode === true) return;

        checkBookTitle();
        checkBookAuthor();
        checkBookPublicationDate();
        checkBookPublisher();
        checkBookPrice();
        checkBookPageCount();
        // checkBookGenre();
    }, [isAddMode]);

    //도서 삭제 함수
    const deleteBook = useCallback(async (target)=>{
        const result = await Swal.fire({
            title:"해당 도서를 삭제하시겠습니까?",
            text:"삭제한 도서는 다시 복구할 수 없습니다",
            icon:"warning",
            showCancelButton:true,
            confirmButtonText:"네, 삭제하겠습니다",
            cancelButtonText:"아니오, 나중에 삭제하겠습니다"
        });
        if(result.isConfirmed === false) return;
        //실제 삭제 요청
        const response = await axios.delete(`/api/book/${target.bookId}`);
        //목록에서 찾아서 삭제하여 지워진 척
        setBookList(prev=>prev.filter(
            book=> book.bookId !== target.bookId
        ))
        //알림
        toast.success("도서 삭제가 완료되었습니다");
    }, []);

    return (<>
        <Jumbotron title="도서 CURD 통합 구현" content="한 페이지에서 CRUD를 모두 처리해보자" />

        {/* 등록을 위한 모달으 띄우는 버튼 */}
        <Row className="mt-4">
            <Col className="text-end">
                <Button variant="success" onClick={openModal}>
                    <FaPlus />
                    <span>신규 등록</span>
                </Button>
            </Col>
        </Row>

        {/* 목록 */}
        <Row className="mt-4">
            <Col>
                <ListGroup>
                    {bookList.map(book => (
                        <ListGroup.Item key={book.bookId}>
                            <div className="p-4">
                                <h2 className="d-flex align-items-end">
                                    <Badge>{book.bookId}</Badge>
                                    <span className="ms-2">{book.bookTitle}</span>
                                    <small className="text-muted ms-4 fs-5">{book.bookGenre}</small>
                                </h2>
                                <hr />
                                <p className="text-muted">
                                    {/* {book.bookAuthor ? book.bookAuthor : "작자 미상"} */}
                                    <span>{book.bookAuthor || "작자 미상"}</span>
                                    <span className="ms-4">{book.bookPublisher}</span>
                                </p>
                                <p className="mt-2">도서에 대한 설명......</p>
                                <hr />
                                <p className="text-info">
                                    <span className="ms-4">{book.bookPrice.toLocaleString()}원</span>
                                    <span className="ms-4">{book.bookPageCount.toLocaleString()}p</span>
                                    {book.bookPublicationDate && (
                                        <span className="ms-4">{book.bookPublicationDate} 출간</span>
                                    )}
                                </p>

                                {/* 수정 삭제 패널 */}
                                <div className="text-end">
                                    <FaSquarePen className="text-warning" size={36} 
                                            onClick={e=>openModalToEdit(book)}/>
                                    <FaTrash className="text-danger ms-4" size={36}
                                             onClick={e=>deleteBook(book)}/>
                                </div>
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>

                {/* 더보기 */}
                {last !== true && ( //last가 true가 아니면 다음이 나와라
                    <Button variant="outline-info" className="w-100" onClick={loadList}>
                        <FaChevronDown />
                        <span className="mx-2">더보기</span>
                        <FaChevronDown />
                    </Button>
                )}
            </Col>
        </Row>

        {/* 모달 */}
        <Modal
            show={modal}
            onHide={closeModal}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    {isAddMode ? "신규 도서 등록" : `${book.bookId}번 도서 정보 수정`}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container fluid>
                    <Row className="mt-4">  {/* <Form.Group as={Row} 도 가능*/}
                        <Form.Label column sm={3}>
                            <span>도서명</span>
                            <FaAsterisk className="text-danger"/>
                        </Form.Label>
                        <Col sm={9}>
                            <Form.Control type="text" name="bookTitle" value={book.bookTitle}
                                onChange={ChangeStringValue} onBlur={checkBookTitle}
                                placeholder="e.g., 어린왕자"
                                className={result.bookTitle}/>
                            <div className="valid-feedback">도서명이 설정되었습니다</div>
                            <div className="invalid-feedback">필수 작성 항목입니다</div>
                        </Col>
                    </Row>
                    <Row className="mt-4">  {/* <Form.Group as={Row} 도 가능*/}
                        <Form.Label column sm={3}>지은이</Form.Label>
                        <Col sm={9}>
                            <Form.Control type="text" name="bookAuthor" value={book.bookAuthor}
                                onChange={ChangeStringValue} onBlur={checkBookAuthor}
                                placeholder="e.g., 생택쥐페르"
                                className={result.bookAuthor}/>
                        </Col>
                    </Row>
                    <Row className="mt-4">  {/* <Form.Group as={Row} 도 가능*/}
                        <Form.Label column sm={3}>
                            <span>출판사</span>
                            <FaAsterisk className="text-danger"/>
                        </Form.Label>
                        <Col sm={9}>
                            <Form.Control type="text" name="bookPublisher" value={book.bookPublisher}
                                onChange={ChangeStringValue} 
                                onBlur={checkBookPublisher}
                                className={result.bookPublisher}
                                placeholder="e.g., 더미북스"/>
                        </Col>
                    </Row>
                    <Row className="mt-4">  {/* <Form.Group as={Row} 도 가능*/}
                        <Form.Label column sm={3}>
                            <span>출간일</span>
                        </Form.Label>
                        <Col sm={9}>
                            <Form.Control type="date" name="bookPublicationDate" value={book.bookPublicationDate}
                                onChange={ChangeStringValue} 
                                onBlur={checkBookPublicationDate}
                                className={result.bookPublicationDate}/>
                        </Col>
                    </Row>
                    <Row className="mt-4">  {/* <Form.Group as={Row} 도 가능*/}
                        <Form.Label column sm={3}>
                            <span>판매가</span>
                            <FaAsterisk className="text-danger"/>
                        </Form.Label>
                        <Col sm={9}>
                            <Form.Control type="text" name="bookPrice" value={book.bookPrice}
                                onChange={ChangeNumericValue} onBlur={checkBookPrice}
                                className={result.bookPrice}
                                inputMode="numeric" placeholder="e.g., 어린왕자"/>
                                <div className="valid-feedback">판매가 설정되었습니다</div>
                            <div className="invalid-feedback">정상적인 숫자 형태로 작성하세요</div>
                        </Col>
                    </Row>
                    <Row className="mt-4">  {/* <Form.Group as={Row} 도 가능*/}
                        <Form.Label column sm={3}>
                            <span>페이지</span>
                            <FaAsterisk className="text-danger"/>
                        </Form.Label>
                        <Col sm={9}>
                        <Form.Control type="text" inputMode="numeric" name="bookPageCount"
                        value={book.bookPageCount}
                        onChange={ChangeNumericValue}
                        onBlur={checkBookPageCount}
                        className={result.bookPageCount} />
                        <div className="valid-feedback">페이지 수가 설정되었습니다</div>
                        <div className="invalid-feedback">페이지 수는 0보다 커야합니다</div>
                        </Col>
                    </Row>
                     <Row className="mt-4">  {/* <Form.Group as={Row} 도 가능*/}
                        <Form.Label column sm={3}>
                            <span>장르</span>
                            <FaAsterisk className="text-danger"/>
                        </Form.Label>
                        <Col sm={9}>
                            <Form.Select type="text" name="bookGenre" value={book.bookGenre}
                                onChange={ChangeStringValue}
                                className={result.bookGenre}
                                >
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
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={closeModal}>
                    <FaXmark/>
                    <span>취소하기</span>
                </Button>
                {isAddMode ? (
                <Button variant="success" disabled={allValid === false}
                        onClick={save}>
                    <FaPlus/>
                    <span>등록하기</span>
                </Button>
                ) : (
                <Button variant="warning" disabled={allValid === false}
                        onClick={edit}>
                    <FaSquarePen/>
                    <span>수정하기</span>
                </Button>
                )}               
            </Modal.Footer>
        </Modal>
    </>)
}