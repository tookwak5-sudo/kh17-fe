// 통합 상태(state) 저장소
// - utils/storage/index.js
// - 통합하여 관리할 데이터들을 죠-타이(jotai) 기술에서 제공하는 도구로 생성한 뒤 내보내기
// - 필요한 컴포넌트에서 여기서 만든 도구들을 import하여 사용 (properties로 전달할 필요가 없다)

// - 생성방법 : atom 함수 사용 

// - TestMain, TestLeft, TestRight에서 공유할 count라는 이름의 통합상태(atom)을 생성

import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

//default는 한 번만 가능 export는 여러번 가능
//const [count, setCount] = useState(0); (react)
export const countState = atom(0);

//로그인 결과를 저장할 통합상태 생성
//- 새로고침이 되더라도 데이터가 유지 될 필요가 있음
//- session storage에 저장하면 현재 화면에서만 유효(데이터 유지)
//- localStorage에 저장하면 겄다 켜도 유효(데이터 유지)

// export const loginUserState = atom(null); // 새로고침 시 데이터 사라짐
export const loginUserState = atomWithStorage("loginUserState", "", window.sessionStorage); //세션 스토리지 저장
// export const loginUserState = atomWithStorage("loginUserState", "", window.localStorage); //로컬 스토리지 저장


//마지막에 개발자 도구에 표시될 라벨을 설정 (위치 무관)
countState.debugLabel = "연습용 카운트";
loginUserState.debugLabel = "loginUserState";