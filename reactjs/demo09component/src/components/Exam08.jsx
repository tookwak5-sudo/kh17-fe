import { useCallback, useEffect, useState } from "react";
import Jumbotron from "./jumbotron";
import axios from "axios";
import { FaTrash } from "react-icons/fa6";
import Swal from "sweetalert2";

function Exam08() {
    //state
    const [lectureList, setLectureList] = useState([]);

    //effect
    useEffect(() => {
        axios({
            url: "http://localhost:8080/api/lecture/list",
            method: "get"
        })
            .then(response => {
                console.log("서버의 대답(응답)", response);
                setLectureList(response.data);
            })
    }, [])

    //callback
    const deleteLecture = useCallback((target) => {
        Swal.fire({
            title: "정말 삭제하시겠습니까?",
            text: "삭제 후에는 복구할 수 없습니다.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "삭제",
            cancelButtonText: "취소"
        })
            .then(result => {
                if (result.isConfirmed) {
                    setLectureList(
                        lectureList.filter(lecture => lecture.lectureNo !== target.lectureNo)
                    );
                }
            })
        // setLectureList(
        //     lectureList.filter(lecture => lecture.lectureNo !== target.lectureNo)
        // );
    }, [lectureList])

    return (<>
        <Jumbotron title="강좌 목록" />
        <div className="row mt-4">
            {lectureList.map(lecture=>(
                <div className="col-md-6 col-lg-4" key={lecture.lectureNo}>
                    <div className ="card mb-3">
                        <h3 className="card-header text-truncate">{lecture.lectureCategory}</h3>
                        <div className ="card-body">
                            <h5 className ="card-title">{lecture.lectureTitle}</h5>
                            <h6 className ="card-subtitle text-muted">{lecture.lectureType}</h6>
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
    </>);
}

export default Exam08;