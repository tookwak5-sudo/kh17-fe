import { useState } from "react"
import './App.css'
import { useMemo } from "react";

function App() {
  const [pr, setPr] = useState(["", ""]);
  const count = useMemo(()=>{
    return pr.map(text=> text.length);
  }, [pr])


  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");
  const [q3, setQ3] = useState("");
  const [q4, setQ4] = useState("");
  const [q5, setQ5] = useState("");
  
  const count1 = useMemo(()=>{
    return q1.length;
  }, [q1]);
  const count2 = useMemo(()=>{
    return q2.length;
  }, [q2]);
  const count3 = useMemo(()=>{
    return q3.length;
  }, [q3]);
  const count4 = useMemo(()=>{
    return q4.length;
  }, [q4]);
  const count5 = useMemo(()=>{
    return q5.length;
  }, [q5]);

  const valid1 = useMemo(()=>{
    return count1 <= 1000;
  }, [count1]);
  const valid2 = useMemo(()=>{
    return count2 <= 1000;
  }, [count2]);
  const valid3 = useMemo(()=>{
    return count3 <= 1000;
  }, [count3]);
  const valid4 = useMemo(()=>{
    return count4 <= 1000;
  }, [count4]);
  const valid5 = useMemo(()=>{
    return count5 <= 1000;
  }, [count5]);

  const class1 = useMemo(()=>{
    return valid1 ? "" : "text-danger";
  }, [valid1]);
  const class2 = useMemo(()=>{
    return valid2 ? "" : "text-danger";
  }, [valid2]);
  const class3 = useMemo(()=>{
    return valid3 ? "" : "text-danger";
  }, [valid3]);
  const class4 = useMemo(()=>{
    return valid4 ? "" : "text-danger";
  }, [valid4]);
  const class5 = useMemo(()=>{
    return valid5 ? "" : "text-danger";
  }, [valid5]);

  const allValid = useMemo(()=>{
    return q1.length > 0 && valid1 
          && q2.length > 0 && valid2
          && q3.length > 0 && valid3
          && q4.length > 0 && valid4
          && q5.length > 0 && valid5
  }, [q1, q2, q3, q4, q5, valid1, valid2, valid3, valid4, valid5]);

  return (
    <div className="container my-5">
        {/* 점보트론 */}
        <div className="row">
          <div className="col">
            <div className="p-4 bg-dark text-light rounded">
              <h1>자기소개서</h1>
              <p>작성하 내용이 사실과 다를 경우 합격이 무효처리가 될 수 있습니다.</p>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col">
            <label className="col col-form-label">
              (Q1) 당신의 성장과정에 대해서 설명해주세요
            </label>
            <div>
              <textarea className="form-control w-100" rows="10" 
                        value={q1}
                        onChange={e=>{setQ1(e.target.value)}}></textarea>
              </div>
              </div>
              <div className={`text-end ${class1}`}>
                {count1} / 1000글자
              </div>
        </div>
        <div className="row mt-4">
          <div className="col">
            <label className="col col-form-label">
              (Q2) 당신 성격의 장단점
            </label>
            <div>
              <textarea className="form-control w-100" rows="10" 
                        value={q2}
                        onChange={e=>{setQ2(e.target.value)}}></textarea>
              </div>
              </div>
              <div className={`text-end ${class2}`}>
                {count2} / 1000글자
              </div>
        </div>
        <div className="row mt-4">
          <div className="col">
            <label className="col col-form-label">
              (Q3) 당신이 역경을 이겨낸 경험을 소개해주세요
            </label>
            <div>
              <textarea className="form-control w-100" rows="10" 
                        value={q3}
                        onChange={e=>{setQ3(e.target.value)}}></textarea>
              </div>
              </div>
              <div className={`text-end ${class3}`}>
                {count3} / 1000글자
              </div>
        </div>
        <div className="row mt-4">
          <div className="col">
            <label className="col col-form-label">
              (Q4) it관련 지식입력
            </label>
            <div>
              <textarea className="form-control w-100" rows="10" 
                        value={q4}
                        onChange={e=>{setQ4(e.target.value)}}></textarea>
              </div>
              </div>
              <div className={`text-end ${class4}`}>
                {count4} / 1000글자
              </div>
        </div>
        <div className="row mt-4">
          <div className="col">
            <label className="col col-form-label">
              (Q5) 가장 최근에 만든 프로잭트
            </label>
            <div>
              <textarea className="form-control w-100" rows="10" 
                        value={q5}
                        onChange={e=>{setQ5(e.target.value)}}></textarea>
              </div>
              </div>
              <div className={`text-end ${class5}`}>
                {count5} / 1000글자
              </div>
        </div>

        {/* <div className="row mt-4">
          <div className="col">
            <label className="col col-form-label">
              (Q1) 당신의 성장과정에 대해서 설명해주세요
            </label>
            <div>
              <textarea className="form-control w-100" rows="10" 
                        value={pr[0]}
                        onChange={
                          e=>{
                            const copy = [...pr];
                            copy[0] = e.target.value;
                            setPr(copy);
                          }
                        }
                        />
            </div>
          </div>
        </div>
        <div className="row mt-2">
          <div className="col text-end">
            {count[0]} / 1000글자
          </div>
        </div>

        <div className="row mt-4">
          <div className="col">
            <label className="col col-form-label">
              (Q1) 최근 관심있던 IT관련 뉴스는 무엇인가요?
            </label>
            <div>
              <textarea className="form-control w-100" rows="10" 
                        value={pr[1]}
                        onChange={
                          e=>{
                            const copy = [...pr];
                            copy[1] = e.target.value;
                            setPr(copy);
                          }
                        }
                        />
            </div>
          </div>
        </div>
        <div className="row mt-2 text-end">
          <div className="col">
            {count[1]} / 1000글자
          </div>
        </div> */}
        {/* 제출버튼 */}
        <div className="row mt-5">
          <div className="col">
            <button className="btn btn-lg btn-success w-100"
              disabled={allValid === false}>
              제출하기
            </button>
          </div>
        </div>
    </div>
  )
}

export default App
