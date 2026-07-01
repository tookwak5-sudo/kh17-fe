import { useState } from 'react'
import './App.css'

function App() {
  const [ role, setRole ] = useState("primary");
  return (
    <div className="container my-5">
      {/* 점보트론 */}
      <div className="row">
        <div className="col">
          <div className="p-4 bg-dark text-light rounded">
            <h1>색상 변경 예제</h1>
            <p>버튼을 눌러 색상을 변경하도록 처리합니다</p>
          </div>
        </div>
      </div>
      {/* 실제 화면 */}
      <div className="row mt-4">
        <div className="col text-center">
          <button type="button" onClick={() => setRole("primary")} className="btn btn-primary">Primary</button>
          <button type="button" onClick={() => setRole("secondary")} className="btn btn-secondary ms-1">Secondary</button>
          <button type="button" onClick={() => setRole("success")} className="btn btn-success ms-1">Success</button>
          <button type="button" onClick={() => setRole("info")} className="btn btn-info ms-1">Info</button>
          <button type="button" onClick={() => setRole("warning")} className="btn btn-warning ms-1">Warning</button>
          <button type="button" onClick={() => setRole("danger")} className="btn btn-danger ms-1">Danger</button>
          <div className="col text-center">
            <h2 className={`text-${role}`}>Hello ReactJs</h2>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
