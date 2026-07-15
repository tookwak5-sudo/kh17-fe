// 통합 상태(state) 저장소
// - utils/storage/index.js
// - 통합하여 관리할 데이터들을 죠-타이(jotai) 기술에서 제공하는 도구로 생성한 뒤 내보내기
// - 필요한 컴포넌트에서 여기서 만든 도구들을 import하여 사용 (properties로 전달할 필요가 없다)

// - 생성방법 : atom 함수 사용 

// - TestMain, TestLeft, TestRight에서 공유할 count라는 이름의 통합상태(atom)을 생성

import { atom } from "jotai";

//default는 한 번만 가능 export는 여러번 가능
//const [count, setCount] = useState(0); (react)
export const countState = atom(0);

// - 로그인 결과를 저장할 통합상태 생성
export const loginState = atom(null); //초기값 null


//마지막에 개발자 도구에 표시될 라벨을 설정 (위치 무관)
countState.debugLabel = "연습용 카운트";
loginState.debugLabel = "loginState";