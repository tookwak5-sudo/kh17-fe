import { useState } from 'react';
import './App.css'

function App() {
  const [value, setValue] = useState(0);
  return (
    <>
      <h1>이체 금액 입력화면</h1>
      {/* <div>{value}원</div> */}
      <input value={value} readOnly/>

      <hr/>

      <button onClick={()=>setValue(value + 10000000)}>천만</button>
      <button onClick={()=>setValue(value + 1000000)}>백만</button>
      <button onClick={()=>setValue(value + 100000)}>십만</button>
      <button onClick={()=>setValue(value + 10000)}>만</button>
      <button onClick={()=>setValue(value + 1000)}>천</button>
      <button onClick={()=>setValue(value + 100)}>백</button>
      <button onClick={()=>setValue(value + 10)}>십</button>
      <button onClick={()=>setValue(value + 1)}>일</button>
      <hr/>
      <button onClick={()=>setValue(parseInt(value / 10))}>x</button>
      <button onClick={()=>setValue(0)}>지우기</button>
      <div>
        금액을 입력하세요
      </div>
    </>
  )
}

export default App
