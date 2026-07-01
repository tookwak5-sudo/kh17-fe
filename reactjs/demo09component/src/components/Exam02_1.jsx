//import
import { useCallback, useMemo, useState } from "react";
import Jumbotron from "./jumbotron";

//function
function Exam02_1() {
    //state는 하나의 객체로 관리 (state핵심데이터 memo 파생데이터)
    const [student, setStudent] = useState({
        studentName: "",
        kScore: 0,
        eScore: 0,
        mScore: 0,
    });

    const changeStudent = useCallback(e => {
        const { name, value } = e.target;
        setStudent({
            ...student, //나머지 항목은 유지
            [name]: value //입력값만 변경해라
        });
    }, [student]);

    //callback - 문자열입력(changeStringValue), 정수입력(changeNumericValue)
    const changeStringValue = useCallback(e=>{
        const { name, value } = e.target;
        setStudent({...student, [name]:value});
    }, [student]);

    const changeNumericValue = useCallback(e=>{
        const { name, value } = e.target;
        const regex = /[^0-9]+/g;
        const replacement = value.replace(regex, "");
        setStudent({...student, [name]:parseInt(replacement || 0)}); //js에서는 앞에 문자가 부정일 때 값을 ||으로 넣을 수 있다
    }, [student]);
    // const changeDecimalValue = useCallback(e=>{}, []);


    //memo
    const sum = useMemo(()=>{
        return student.kScore 
                + student.eScore
                + student.mScore;
    }, [changeNumericValue]);
    const average = useMemo(()=>{
        return sum / 3;
    }, [sum]);
    return (
        <>
            {/* 내가 만든 점보트론을 불러와서 적용 */}
            <Jumbotron title="학생 성적 계산기2" content="시험 결과를 입력하시면 평균과 총점을 계산해드립니다." />

            {/* 아이디 입력화면 */}
            <div className="row mt-4">
                <label className="col-sm-3 col-form-lable">이름</label>
                <div className="col-sm-9">
                    <input type="text" name="studentName" className="form-control"
                        value={student.studentName}
                        onChange={changeStringValue} />
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
                        onChange={changeNumericValue} />
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
                        onChange={changeNumericValue} />
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
                        onChange={changeNumericValue} />
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
export default Exam02_1;