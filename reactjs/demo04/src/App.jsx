import { useState } from 'react'
import './App.css'

function App() {
  //이 화면은 이미지의 "크기"를 조절하는 것이 목표
  //"크기"를 state로 관리해서 화면과 연결시켜두고 변경하도록 처리
  const [size, setSize] = useState(300);

  return (
    <>
      <h1>이미지 크기조절</h1>
      <hr/>
      <button onClick={()=>setSize(150)}>작게</button>
      <button onClick={()=>setSize(300)}>보통</button>
      <button onClick={()=>setSize(400)}>크게</button>
      
      <div>
        현재 크기 : {size}px
        &nbsp;&nbsp;
        <button onClick={()=>setSize(Math.min(400, size+10))}>+</button>
        <button onClick={()=>setSize(Math.max(150, size-10))}>-</button>
      </div>

      <hr/>

      <img src="https://picsum.photos/300"
          className="target"
          width={size} height={size}/>
    </>
  )
}

export default App
