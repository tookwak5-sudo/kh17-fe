import Jumbotron from "@templates/Jumbotron";
import { useCallback, useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { Button, Col, Form, Row } from "react-bootstrap";
import { FaPaperPlane } from "react-icons/fa6";
export default function WebSocketV1BasicClient() {

    //WebSocket은 연결을 기반으로 하기 때문에 연결에 사용할 객체가 있어야 한다
    const [client, setClient] = useState(null); //서버와의 연결정보를 가진 객체(들어오자 마자)
    const [input, setInput] = useState("");//사용자의 입력

    //WebSocket 연결은 들어오자마자 해야하며, 나갈 때 반드시 해제해야 한다
    //→ 연관항목이 없는 useEffect를 사용하고 Clean-Up 함수를 생성해야 한다
    useEffect(() => {
        //최초 1회 실행해야할 작업
        const client = connectToServer();
        setClient(client);

        //페이지 이탈 시 해야할 작업
        return () => {
            disconnectFromServer(client);
            setClient(null);
        };
    }, []);

    //연결 함수
    const connectToServer = useCallback(() => {
        //[1]연결(socket) 생성
        const socket = new SockJS("http://localhost:8080/ws")

        //[2]연결을 관리할 도구(client) 생성하여 반환
        // - client에 구독할 채널(/public/basic), 메세지 수/발신에 대한 코드를 콜백 함수 형태로 설정
        // - 구독할 채널 : /public/basic
        // - 메세지를 보내 ㄹ채널 : /app/basic
        const client = new Client({
            //연결 객체를 생성하는 함수
            webSocketFactory: () => socket,
            //웹소켓의 상황별 Callback 지정(구독지정)
            onConnect: () => { //연결되었을 때
                //client.subscribe(채널명, 콜백함수);
                client.subscribe("/public/basic", (message) => {
                    console.log(message);
                });
            },
            //디버깅 설정(옵션)
            debug: (str) => console.log(str)
        });
        //클라이언트 활성화
        client.activate();

        return client;
    }, []);
    //연결 종료 함수
    const disconnectFromServer = useCallback((client) => {
        if (client) {//client가 존재한다면
            client.deactivate();//비활성화
        }
    }, []);

    //메세지 전송 함수
    const sendMessage = useCallback(()=>{
        
        //메세지 전송을 위한 JSON 데이터 생성
        const json = { content : input };

        //STOMP 규격에 맞는 메세지 생성
        const stompMessage = {
            destination: "/app/basic", //서버로 보낼 목적지
            body: JSON.stringify(json), //전송할 내용 (직렬화된 JSON)
        };

        //전송
        client.publish(stompMessage);
    }, [client, input]);

    return (<>
        <Jumbotron title="WebSocket Version 1" content="기본 웹소켓 예제" />

        <Row className="mt-5">
            <Form.Label column sm={3}>메세지 입력</Form.Label>
            <Col sm={9}>
                <div className="d-flex">
                    <Form.Control type="text" 
                            value={input} onChange={e=>setInput(e.target.value)}/>

                    <Button variant="success" className="text-nowrap ms-2" 
                                                            onClick={sendMessage}>
                        <FaPaperPlane />
                        <span className="ms-2 d-none d-sm-inline">전송</span>
                    </Button>
                </div>
            </Col>
        </Row>
    </>)
}