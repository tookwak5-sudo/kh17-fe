//import 여긴 import없음

import { useCallback, useState } from "react";
import Jumbotron from "./jumbotron";

//function
function Exam01() {
    // 개별적으로 관리할 때
    // const [memberId, setMemberId] = useState("");
    // const [memberNickname, setMemberNickname] = useState("");

    //state는 하나의 객체로 관리 (state핵심데이터 memo 파생데이터)
    const [member, setMember] = useState({
        memberId: "",
        memberNickname: ""
    });

    //통합 설정 함수(콜백)
    // - React에서는 함수를 만들 때 useCallback 훅을 사용
    // - 방법 : const 함수명 = useCallback(함수, [연관항목(없으면 비워도 무방)]);
    const changeMember = useCallback(e => {
        // const name = e.target.name;
        // const value = e.target.value; 아래방식으로 한 개가 아닌 한번에 관리
        const { name, value } = e.target;
        //console.log(e.target);
        setMember({
            ...member, //나머지 항목은 유지
            [name]: value
            // 무엇을 : 얼마로
            //[e.target.name] : e.target.value //내가 원하는 항목을 변경
        });
    }, [member]);


    return (
        <>
            {/* 내가 만든 점보트론을 불러와서 적용 */}
            <Jumbotron title="객체 state 다루기" content="입력창 여러개를 하나의 state로 관리하는 법을 배웁니다" />

            {/* 아이디 입력화면 */}
            <div className="row mt-4">
                <label className="col-sm-3 col-form-lable">아이디</label>
                <div className="col-sm-9">
                    <input type="text" name="memberId" className="form-control"
                        value={member.memberId}
                        onChange={changeMember} />
                    <div className="valid-feedback">멋진 아이디 입니다</div>
                    <div className="invalid-feedback">사용중이거나 사용할 수 없는 형식입니다</div>
                </div>
            </div>

            {/* 닉네임 입력화면 */}
            <div className="row mt-4">
                <label className="col-sm-3 col-form-lable">닉네임</label>
                <div className="col-sm-9">
                    <input type="text" name="memberNickname" className="form-control"
                        value={member.memberNickname}
                        onChange={changeMember} />
                    <div className="valid-feedback">멋진 닉네임 입니다</div>
                    <div className="invalid-feedback">사용중이거나 사용할 수 없는 형식입니다</div>
                </div>
            </div>
        </>
    );
}

//export
export default Exam01;