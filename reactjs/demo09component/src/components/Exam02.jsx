//import 여긴 import없음

import { useCallback, useMemo, useState } from "react";
import Jumbotron from "./jumbotron";

//function
function Exam02() {
    //state는 하나의 객체로 관리 (state핵심데이터 memo 파생데이터)
    const [student, setStudent] = useState({
        studentName: "",
        kScore: "",
        eScore: "",
        mScore: "",
    });

    //통합 설정 함수(callback)
    // - React에서는 함수를 만들 때 useCallback 훅을 사용
    // - 방법 : const 함수명 = useCallback(함수, [연관항목(없으면 비워도 무방)]);
    const changeStudent = useCallback(e => {
        const { name, value } = e.target;
        setStudent({
            ...student, //나머지 항목은 유지
            [name]: value //입력값만 변경해라
        });
    }, [student]);

    const sum = useMemo(()=>{
        return parseInt(student.kScore) 
                + parseInt(student.eScore) 
                + parseInt(student.mScore);
    }, [changeStudent]);
    const average = useMemo(()=>{
        return sum / 3;
    }, [sum]);
    return (
        <>
            {/* 내가 만든 점보트론을 불러와서 적용 */}
            <Jumbotron title="학생 성적 계산기" content="시험 결과를 입력하시면 평균과 총점을 계산해드립니다." />

            {/* 아이디 입력화면 */}
            <div className="row mt-4">
                <label className="col-sm-3 col-form-lable">이름</label>
                <div className="col-sm-9">
                    <input type="text" name="studentName" className="form-control"
                        value={student.studentName}
                        onChange={changeStudent} />
                    <div className="valid-feedback">멋진 아이디 입니다</div>
                    <div className="invalid-feedback">사용중이거나 사용할 수 없는 형식입니다</div>
                </div>
            </div>
            {/* 국어점수 입력화면 */}
            <div className="row mt-4">
                <label className="col-sm-3 col-form-lable">국어점수</label>
                <div className="col-sm-9">
                    <input type="text" inputMode="numeric" name="kScore" className="form-control"
                        value={student.kScore}
                        onChange={changeStudent} />
                    <div className="valid-feedback">멋진 아이디 입니다</div>
                    <div className="invalid-feedback">사용중이거나 사용할 수 없는 형식입니다</div>
                </div>
            </div>
            {/* 영어 입력화면 */}
            <div className="row mt-4">
                <label className="col-sm-3 col-form-lable">영어점수</label>
                <div className="col-sm-9">
                    <input type="text" inputMode="numeric" name="eScore" className="form-control"
                        value={student.eScore}
                        onChange={changeStudent} />
                    <div className="valid-feedback">멋진 아이디 입니다</div>
                    <div className="invalid-feedback">사용중이거나 사용할 수 없는 형식입니다</div>
                </div>
            </div>
            {/* 수학 입력화면 */}
            <div className="row mt-4">
                <label className="col-sm-3 col-form-lable">수학점수</label>
                <div className="col-sm-9">
                    <input type="text" inputMode="numeric" name="mScore" className="form-control"
                        value={student.mScore}
                        onChange={changeStudent} />
                    <div className="valid-feedback">멋진 아이디 입니다</div>
                    <div className="invalid-feedback">사용중이거나 사용할 수 없는 형식입니다</div>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col">
                    <div className="shadow p-4 rounded bordered">
                        <p>{student.studentName}님의 성적은 다음과 같습니다</p>
                        <p>총점{sum}점, 평균{average.toFixed(2)}점</p>
                    </div>
                </div>
            </div>
        </>
    );
}

//export
export default Exam02;