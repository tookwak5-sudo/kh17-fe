import { useMemo, useState } from "react"
import './App.css'

function App() {
  //아이디 입력창에 연결될 state
  const [memberId, setMemberId] = useState("");

  // 아이디(state)를 이용해서 원하는 데이터를 계산하기 위한 memo를 생성
  //1. 아이디의 글자수를 계산하는 memo
  //2. 아이디가 5~20글자 이내인지 계산하는 memo
  //(생성방법) const 변수 = useMemo(함수, [연관항목]);
  // * 연관항목을 적으면 해당 내용이 최신화되어 적용됨 (변경사항이 계속 반영됨)
  const count = useMemo(()=>{
    return memberId.length;
  }, [memberId]);

  const valid = useMemo(()=>{
    return count >=5 && count <=20;
  }, [count])

  const regexValid = useMemo(()=>{
    const regex = /^[a-z][a-z0-9]{4,19}$/
    return regex.test(memberId);
  }, [memberId]);

  const feedback = useMemo(()=>{
    return valid == "Yes" ? "맞아" : "틀려";
  }, [valid])
  return (
    <div className="container my-5">
      {/* 점보트론 */}
      <div className="row">
        <div className="col">
          <div className="p-4 bg-dark text-light rounded">
            <h1>입력 이벤트 처리</h1>
            <p>입력 이벤트를 처리하는 방법에 대해서 살펴봅니다</p>
          </div>
        </div>
      </div>

      <div className="row mt-4">
          <label className="col-sm-3 col-form-label">
                  아이디
          </label>
          <div className="col-sm-9">
              <input type="text" className="form-control"
              value={memberId} 
              onChange={
                // function(e){
                //   var value = e.target.value;//vanillaJS
                //   setMemberId(value);
                // }
                e=>setMemberId(e.target.value)
              }
              placeholder="영문 소문자 시작, 숫자 포함 5~20글자"/>
          </div>
      </div>

      <div className="row mt-2">
        <div className="offset-sm-3 col-sm-9">
          {/* 글자수 : {memberId.length} */}
          글자수 : {count}
        </div>
      </div>
      <div className="row mt-2">
        <div className="offset-sm-3 col-sm-9">
          {/* 5~20 글자? : {memberId.length >= 5 && memberId.length <=20 ? "Yes" : "No"} */}
          5~20 글자 : {valid ? "Yes" : "No"}
        </div>
      </div>
      <div className="row mt-2">
        <div className="offset-sm-3 col-sm-9">
          검사결과 : {regexValid ? "Valid" : "inValid"}
        </div>
      </div>
    </div>
  )
}

export default App
