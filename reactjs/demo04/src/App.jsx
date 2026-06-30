import { useState } from 'react'
import './App.css'

function App() {
  const [size, setSize] = useState(300);
  return (
    <>
      <h1>이미지 크기조절</h1>
      <hr></hr>
      <button onClick={()=>setSize(Math.max(100,size-50))}>작게</button>
      <span>현재 : {size}px</span>
      <button onClick={()=>setSize(Math.min(600,size+50))}>크게</button>
      <hr></hr>
      <img src="https://picsum.photos/500" width={size}></img>
    </>
  )
}

export default App
