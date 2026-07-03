import { useCallback, useEffect, useState } from "react";
import Jumbotron from "./jumbotron";
import axios from "axios";
import { ClockLoader } from "react-spinners";
import { FaChevronDown } from "react-icons/fa6";

function Exam11() {
    //state
    const [lectureList, setLectureList] = useState([]);
    const [last, setLast] = useState(false);
    const [size, setSize] = useState(10);

    const [loading, setLoading] = useState(false);

    //effect
    useEffect(() => {
        loadMoreList();
    }, []);

    //callback
    const loadMoreList = useCallback(() => {
        const dataSize = lectureList.length;
        const lastLectureNo = dataSize === 0 ? 0 : lectureList[dataSize - 1].lectureNo;
        setLoading(true);

        axios({
            url: "http://localhost:8080/api/lecture/listForReact",
            method: "get",
            params: {
                lastLectureNo: lastLectureNo,
                size: size
            }
        })
            .then(response => {
                console.log(response.data);
                console.log(response.data.list);
                console.log(Array.isArray(response.data.list));
                setLectureList([...lectureList, ...response.data.list]);
                setLast(response.data.last);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [lectureList, size]);

    return (<>
        <Jumbotron title="강좌 목록(더보기 처리)" />

        <div className="row mt-4">
            <div className="col">
                <select value={size} onChange={e=>setSize(parseInt(e.target.value))}>
                    <option value="5">5개씩 보기</option>
                    <option value="10">10개씩 보기</option>
                    <option value="20">20개씩 보기</option>
                    <option value="50">50개씩 보기</option>
                </select>
            </div>
        </div>

        <div className="row mt-4">
            {lectureList.map((lecture) => (
                <div className="col-md-6 col-lg-4" key={lecture.lectureNo}>
                    <div className="card mb-3">
                        <h3 className="card-header text-truncate">{lecture.lectureCategory}</h3>
                        <div className="card-body">                         
                            <h5 className="card-title">{lecture.lectureTitle}</h5>
                            <h6 className="card-subtitle text-muted">{lecture.lectureType}</h6>
                        </div>
                        <div className="card-body">
                            <p className="card-text">강좌에 대한 설명들...</p>
                        </div>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">
                                {lecture.lecturePrice.toLocaleString()}원
                            </li>
                            <li className="list-group-item">
                                {lecture.lectureDuration.toLocaleString()}시간
                            </li>
                            <li className="list-group-item">
                                1시간 당 {(lecture.lecturePrice / lecture.lectureDuration).toLocaleString()}원
                            </li>
                        </ul>
                        <div className="card-body">
                            <a href="#" className="card-link">상세 정보 보기</a>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* 더보기 버튼 */}
        {last === false && (
            <div className="row mt-2">
                <div className="col">
                    <button type="button" className="btn btn-success btn-lg w-100"
                        onClick={loadMoreList}>
                        <FaChevronDown />
                        <span className="mx-2">더보기</span>
                        <FaChevronDown />
                    </button>
                </div>
            </div>
        )}

        {/* 로딩화면 */}
        {loading === true && (
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

export default Exam11;