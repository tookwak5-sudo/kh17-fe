//import
import { useCallback, useEffect, useMemo, useState } from "react";
import Jumbotron from "./jumbotron";
//axios라는 라이브러리에서 제공하는 기본 JS 파일을 불러와서 axios라는 이름으로 쓰겠다
import axios from "axios";
import { toast } from "react-toastify";
import Swal from 'sweetalert2'

//function
function Exam04() {
    //state
    const [lecture, setLecture] = useState({
        lectureTitle: "",
        lectureCategory: "",
        lectureDuration: "", //최초 숫자지만 미입력상태로 설정
        lecturePrice: "", //최초 숫자지만 미입력상태로 설정
        lectureType: "",
    });
    const [result, setResult] = useState({
        lectureTitle: "",
        lectureCategory: "",
        lectureDuration: "",
        lecturePrice: "",
        lectureType: "",
    });

    //Callback
    const ChangeStringValue = useCallback((e) => {
        const { name, value } = e.target;
        setLecture({
            ...lecture, //나머지 유지
            [name]: value //입력값만 변경
        });
    }, [lecture]);
    const ChangeNumericValue = useCallback((e) => {
        const { name, value } = e.target;
        const regex = /[^0-9]+/g;
        const replacement = value.replace(regex, "");
        if (replacement.length === 0) {
            setLecture({ ...lecture, [name]: replacement })
        }
        else {
            setLecture({
                ...lecture, //나머지 유지
                [name]: parseInt(replacement)
            });
        }
    }, [lecture]);

    //검사하여 결과를 갱신하는 함수들
    const checkLectureTitle = useCallback((e) => {
        const valid = lecture.lectureTitle.length > 0;
        const clazz = valid ? "is-valid" : "is-invalid";
        setResult({
            ...result, // 나머지 유지
            lectureTitle: clazz
        });

    }, [lecture.lectureTitle, result]);

    const checkLectureCategory = useCallback((e) => {
        // const regex = /^(이론|실습|시험)$/;
        // const valid = regex.test(lecture.lectureCategory);
        const valid = ['이론', '실습', '시험'].includes(lecture.lectureCategory);
        const clazz = valid ? "is-valid" : "is-invalid";
        setResult({
            ...result,
            lectureCategory: clazz
        });
    }, [lecture.lectureCategory, result]);

    const checkLectureDuration = useCallback((e) => {
        const valid = lecture.lectureDuration !== ""
            && lecture.lectureDuration > 0
            && lecture.lectureDuration % 30 == 0
            && lecture.lectureDuration <= 300
        const clazz = valid ? "is-valid" : "is-invalid";
        setResult({
            ...result,
            lectureDuration: clazz
            // lectureDuration : valid ? "is-valid" : "is-invalid"
        });
    }, [lecture.lectureDuration, result]);

    const checkLecturePrice = useCallback((e) => {
        const valid = lecture.lecturePrice !== "" && lecture.lecturePrice >= 0 && lecture.lecturePrice <= 100000000;
        const clazz = valid ? "is-valid" : "is-invalid";
        setResult({
            ...result,
            lecturePrice: clazz
        });
    }, [lecture.lecturePrice, result]);

    const checkLectureType = useCallback((e) => {
        // const regex = /^(온라인|오프라인|혼합)$/;
        // const valid = regex.test(lecture.lectureType);
        const valid = ['온라인', '오프라인', '혼합'].includes(lecture.lectureType);
        const clazz = valid ? "is-valid" : "is-invalid";
        setResult({
            ...result,
            lectureType: clazz
        });
    }, [lecture.lectureType, result])
    //- 데이터 전송(등록)
    const send = useCallback(() => {
        // $.ajax({
        //     url:"http://localhost:8080/api/lecture/insert",
        //     method:"post",
        //     data: lecture,
        //     success:function(response){
        //         console.log("등록완료!");
        //     }
        // });

        axios({
            url: "http://localhost:8080/api/lecture/insert",
            method: "post",
            data: lecture,
        })
            .then(response => {
                //console.log("등록 완료!");
                //window.alert("등록 완료!");

                //react-toastify 생성 코드
                //toast("등록 완료!");
                //toast.success("등록 완료!");

                //sweetalert2 생성 코드
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "강좌 생성 완료",
                    showConfirmButton: false,
                    timer: 1500 
                });

                //입력값 정리
                setLecture({
                    lectureTitle: "",
                    lectureCategory: "",
                    lectureDuration: "", //최초 숫자지만 미입력상태로 설정
                    lecturePrice: "", //최초 숫자지만 미입력상태로 설정
                    lectureType: ""
                })
                //검사결과 정리
                setResult({
                    lectureTitle: "",
                    lectureCategory: "",
                    lectureDuration: "",
                    lecturePrice: "",
                    lectureType: ""
                })
            });
    }, [lecture]);
    //memo
    const valid = useMemo(() => {
        if (result.lectureTitle !== "is-valid") return false;
        if (result.lectureCategory !== "is-valid") return false;
        if (result.lectureDuration !== "is-valid") return false;
        if (result.lecturePrice !== "is-valid") return false;
        if (result.lectureType !== "is-valid") return false;
    }, [result]);

    //effect
    useEffect(() => {
        //처음에는 검사x
        if (result.lectureCategory === "" && lecture.lectureCategory === "") return;
        //검사함수 실행
        checkLectureCategory();
    }, [lecture.lectureCategory, result.lectureCategory])
    useEffect(() => {
        //처음에는 검사x
        if (result.lectureType === "" && lecture.lectureType === "") return;
        //검사함수 실행
        checkLectureType();
    }, [lecture.lectureType, result.lectureType])

    //view
    return (
        <>
            <Jumbotron title="강좌 등록 화면" content="React를 활용해서 강좌등록을 구현" />

            {/* 강좌 등록 화면 */}
            {/* 강좌명 */}
            <div className="row mt-4">
                <label className="col-sm-3 col-form-label">
                    강좌명<span className="text-danger">*</span>
                </label>
                <div className="col-sm-9">
                    <input type="text" name="lectureTitle"
                        value={lecture.lectureTitle}
                        onChange={ChangeStringValue}
                        onBlur={checkLectureTitle}
                        className={`form-control ${result.lectureTitle}`}
                        placeholder="e.g.,정보처리 산업기사 필기" />
                    <div className="valid-feedback">강좌명이 설정되었습니다</div>
                    <div className="invalid-feedback">필수 입력 창 입니다</div>
                </div>
            </div>
            {/* 카테고리 */}
            <div className="row mt-4">
                <label className="col-sm-3 col-form-label">
                    카테고리<span className="text-danger">*</span>
                </label>
                <div className="col-sm-9">
                    <select name="lectureCategory"
                        value={lecture.lectureCategory}
                        onChange={ChangeStringValue}
                        className={`form-control ${result.lectureCategory}`}>
                        <option value="">선택하세요</option>
                        <option>이론</option>
                        <option>실습</option>
                        <option>시험</option>
                    </select>
                    <div className="valid-feedback">카테고리가 설정되었습니다</div>
                    <div className="invalid-feedback">필수 입력 창 입니다</div>
                </div>
            </div>
            {/* 강의시간 */}
            <div className="row mt-4">
                <label className="col-sm-3 col-form-label">
                    강의시간<span className="text-danger">*</span>
                </label>
                <div className="col-sm-9">
                    <input type="text" inputMode="numeric" name="lectureDuration"
                        value={lecture.lectureDuration}
                        onChange={ChangeNumericValue}
                        onBlur={checkLectureDuration}
                        className={`form-control ${result.lectureDuration}`}
                        placeholder="30시간 단위로 설정가능" />
                    <div className="valid-feedback">강좌시간이 설정되었습니다</div>
                    <div className="invalid-feedback">30시간 단위로 최대 300시간 이내에서 설정 가능합니다</div>
                </div>
            </div>
            {/* 수강료 */}
            <div className="row mt-4">
                <label className="col-sm-3 col-form-label">
                    수강료<span className="text-danger">*</span>
                </label>
                <div className="col-sm-9">
                    <input type="text" inputMode="numeric" name="lecturePrice"
                        value={lecture.lecturePrice}
                        onChange={ChangeNumericValue}
                        onBlur={checkLecturePrice}
                        className={`form-control ${result.lecturePrice}`} />
                    <div className="valid-feedback">수강료가 설정되었습니다</div>
                    <div className="invalid-feedback">수강료는 0 이상으로 설정해야 합니다</div>
                </div>
            </div>
            {/* 강의유형 */}
            <div className="row mt-4">
                <label className="col-sm-3 col-form-label">
                    강의유형<span className="text-danger">*</span>
                </label>
                <div className="col-sm-9">
                    <select name="lectureType"
                        value={lecture.lectureType}
                        onChange={ChangeStringValue}
                        className={`form-control ${result.lectureType}`}>
                        <option value="">선택하세요</option>
                        <option>온라인</option>
                        <option>오프라인</option>
                        <option>혼합</option>
                    </select>
                    <div className="valid-feedback">강의유형이 설정되었습니다</div>
                    <div className="invalid-feedback">필수 입력 창 입니다</div>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col">
                    <button type="button" className="btn btn-success w-100"
                        disabled={valid === false} onClick={send}>
                        + 신규 등록하기
                    </button>
                </div>
            </div>
        </>
    )
}

//export
export default Exam04;