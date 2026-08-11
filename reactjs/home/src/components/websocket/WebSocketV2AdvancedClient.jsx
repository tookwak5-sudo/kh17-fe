import { Client } from "@stomp/stompjs";
import Jumbotron from "@templates/Jumbotron";
import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { FaPaperPlane } from "react-icons/fa6";
import SockJS from "sockjs-client";
import { v4 as uuidv4 } from 'uuid'; //랜덤한 UUID한 개 생성
import "./WebSocketV2AdvancedClient.css";

export default function WebSocketV2AdvancedClient() {

    //웹소켓은 전화와 같아서 연결을 해줘야하는데, client 객체가 필요하고
    const [client, setClient] = useState(null); //서버와의 연결정보를 가진 객체(들어오자 마자)
    const [uuid] = useState(() => uuidv4());//현재 사용자의 식벼)
    const [history, setHistory] = useState([]); //메세지 저장소
    const [input, setInput] = useState("");//사용자의 입력

    useEffect(() => {
        //최초 1회 실행해야할 작업
        const client = connectToServer();
        setClient(client);

        //페이지 이탈 시 해야할 작업
        return () => { //마무리 작업을 하는 함수 clean up (해주지 않으면 터짐)
            disconnectFromServer(client);
            setClient(null);
        };
    }, []);

    //연결 함수
    const connectToServer = useCallback(() => {
        //[1]연결(socket) 생성
        // const socket = new WebSocket("ws://localhost:8080/ws"); //순수설정일때는 이렇게 해줘야함
        const socket = new SockJS(`${import.meta.env.VITE_SERVER_URL}/ws`); //이미 백엔드에서 sockjs연결을 해줬기 때문에 이렇게 사용

        //[2]연결을 관리할 도구(client) 생성하여 반환
        // - client에 구독할 채널(/public/basic), 메세지 수/발신에 대한 코드를 콜백 함수 형태로 설정
        // - 구독할 채널 : /public/basic
        // - 메세지를 보내 ㄹ채널 : /app/basic
        const client = new Client({
            //연결 객체를 생성하는 함수
            webSocketFactory: () => socket,
            //(+추가) 서버로 전달될 헤더 설정
            connectHeaders: {
                uuid: uuid
            },

            //웹소켓의 상황별 Callback 지정(구독지정)
            onConnect: () => { //연결되었을 때
                client.subscribe("/public/advanced", (message) => {
                    const json = JSON.parse(message.body); //JSON 해석하기
                    setHistory(prev => [...prev, json]); //히스토리에 누적
                });
            },
            //디버깅 설정(옵션)
            debug: (str) => console.log(str)
        });
        //클라이언트 활성화
        client.activate();

        return client;
    }, [uuid]);

    //연결 종료 함수
    const disconnectFromServer = useCallback((client) => {
        if (client) {//client가 존재한다면
            client.deactivate();//비활성화
        }
    }, []);

    //메세지 전송 함수
    const sendMessage = useCallback(() => {
        //보낼 수 있는 상태인지를 검증
        if (isConnect === false) return;
        if (input.trim() === "") return;

        //메세지 전송을 위한 JSON 데이터 생성
        const json = { content: input }; //WebSocketV1RequestVO : String content

        //STOMP 규격에 맞는 메세지 생성
        const stompMessage = {
            destination: "/app/advanced", //서버로 보낼 목적지
            headers: { uuid: uuid }, //(+ 추가)헤더를 key=value 형태로 전달
            body: JSON.stringify(json), //전송할 내용 (직렬화된 JSON)

        };
        //전송
        client.publish(stompMessage);
        setInput(""); //입력값 청소
    }, [client, input]);

    //client가 연결중인지 확인하는 메모
    const isConnect = useMemo(() => {
        if (client === null) return false; //client가 없는 경우
        if (client.active === false) return false; //deactivate() 상태인 경우
        return true;
    }, [client]);

    //시간을 표시해야 되는 상황인지 판정하는 함수
    const checkTimeVisible = useCallback((curr, prev)=>{
        //이렇게하면 (===이렇게 안하고) null, undefined 다 제거
        //비어있으면 시간 표시
        if(!curr) return true;//null, undefined 모두 제거 
        if(!prev) return true;//null, undefined 모두 제거

        if(curr.sender !== prev.sender) return true; //작성자가 다르면 시간 표시

        const currTime = dayjs(curr.time);
        const prevTime = dayjs(prev.time);
        const isSameTime = currTime.isSame(prevTime, "minute");
        return isSameTime === false; //작성시간이 다르면 시간 표시
    }, []);

    const checkSenderVisible = useCallback((curr, next)=>{
        if(!curr) return true; //null, undefined 제거
        if(!next) return true; //null, undefined 제거

        if(curr.sender !== next.sender) return true; //작성자가 다르면 표시

        return false;
    }, []);

    //(+추가) 스크롤을 끝으로 갱신기키는 처리 (반대도 가능) , * reverse인 상황
    const messageWrapperRef = useRef();
    useEffect(()=>{
        // messageWrapperRef.current.scrollTop = 0;// 처음으로 (하단) 보내는 코드
        messageWrapperRef.current.scrollTop = -messageWrapperRef.current.scrollHeight;
    }, [history]);

    return (<>
        <Jumbotron title="WebSocket Version 2" content="STOMP 메세지에 헤더를 추가해서 사용하기" />

        <Row className="mt-5">
            <Form.Label column sm={3}>메세지 입력</Form.Label>
            <Col sm={9}>
                <div className="d-flex">
                    {/* 입력창과 버튼은 연결이 활성화 되어있을 경우에만 사용 가능하도록 서렂ㅇ */}
                    <Form.Control type="text" disabled={isConnect === false}
                        value={input} onChange={e => setInput(e.target.value)}
                        onKeyUp={e => {
                            //엔터를 누르고 올렸을 때, 전송버튼과 동일한 기능을 실행
                            if (e.key === "Enter") sendMessage();
                        }}
                    />

                    <Button variant="success" className="text-nowrap ms-2"
                        disabled={isConnect === false} onClick={sendMessage}>
                        <FaPaperPlane />
                        <span className="ms-2 d-none d-sm-inline">전송</span>
                    </Button>
                </div>
            </Col>
        </Row>

        <Row className="mt-5">
            <Col>
                {/* 메세지 영역 생성 */}
                <div className="message-wrapper" ref={messageWrapperRef}>
                    {history.map((message, index) => {
                        //추가 계산 코드 작성
                        const my = uuid === message.sender;
                        const isDiffSender = checkSenderVisible(history[index], history[index+1]);
                        return(
                        <div className={`message-outer ${my ? "my" : ""}`} key={index} >
                            <div className="message-inner">
                                {/* 가로로 3칸을 나눠 순서대로 프로필/작성자+내용/작성시각으로 구현 */}
                                {!my && (
                                <div className="profile-wrapper">
                                {(isDiffSender) && (
                                    <img src="https://picsum.photos/100"/>
                                )}
                                </div>
                                )}
                                <div className="content-wrapper">
                                    {(!my && isDiffSender) && (
                                    <div className="sender">{message.sender}</div>
                                    )}
                                    <div className="content">
                                        <div className="body">{message.content}</div>
                                        {/* 시간은 경우에 따라서 나오지 않을 수도 있다 */}
                                        <div className="time">
                                        { checkTimeVisible(history[index], history[index-1]) &&(
                                            dayjs(message.time).format("a h:mm")
                                        )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        )
                    })}
                </div> 
            </Col>
        </Row>
    </>)
}