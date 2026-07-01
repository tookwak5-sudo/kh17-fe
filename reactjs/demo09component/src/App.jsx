import { useCallback, useState } from "react";
import './App.css'
import Jumbotron from "./components/jumbotron"//.jsx 생략
import Exam01 from "./components/Exam01";
import Exam02 from "./components/Exam02";
import Exam02_1 from "./components/Exam02_1";
import Exam03 from "./components/Exam03";

function App() {

  // 개별적으로 관리할 때
  // const [memberId, setMemberId] = useState("");
  // const [memberNickname, setMemberNickname] = useState("");

  //state는 하나의 객체로 관리 (state핵심데이터 memo 파생데이터)
  const [member, setMember] = useState({
    memberId : "",
    memberNickname : ""
  });

  //통합 설정 함수(콜백)
  // - React에서는 함수를 만들 때 useCallback 훅을 사용
  // - 방법 : const 함수명 = useCallback(함수, [연관항목(없으면 비워도 무방)]);
  const changeMember = useCallback(e=>{
    // const name = e.target.name;
    // const value = e.target.value; 아래방식으로 한 개가 아닌 한번에 관리
    const {name, value} = e.target;
    //console.log(e.target);
    setMember({
        ...member, //나머지 항목은 유지
        [name] : value
        // 무엇을 : 얼마로
        //[e.target.name] : e.target.value //내가 원하는 항목을 변경
    });
  }, [member]);

  return (
  <div className="container my-5">
    
    {/* <Exam01/>

    <hr/>

    <Exam02/>

    <hr/> */}

    {/* <Exam02_1/> */}

    <hr/>

    <Exam03/>
  </div>
  )
}

export default App
