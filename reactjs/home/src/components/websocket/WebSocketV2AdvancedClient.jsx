import { Client } from "@stomp/stompjs";
import Jumbotron from "@templates/Jumbotron";
import { useCallback, useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { v4 as uuidv4} from 'uuid'; //랜덤한 UUID한 개 생성

export default function WebSocketV2AdvancedClient() {

    const [client, setClient] = useState(null); //서버와의 연결정보를 가진 객체(들어오자 마자)
    const [uuid] = useState(()=>uuidv4());//현재 사용자의 식벼)

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
        const socket = new SockJS(`${import.meta.env.VITE_SERVER_URL}/ws`);

        //[2]연결을 관리할 도구(client) 생성하여 반환
        // - client에 구독할 채널(/public/basic), 메세지 수/발신에 대한 코드를 콜백 함수 형태로 설정
        // - 구독할 채널 : /public/basic
        // - 메세지를 보내 ㄹ채널 : /app/basic
        const client = new Client({
            //연결 객체를 생성하는 함수
            webSocketFactory: () => socket,
            //(+추가) 서버로 전달될 헤더 설정
            conncectHeaders: {
                uuid : uuid
            },           
            
            //웹소켓의 상황별 Callback 지정(구독지정)
            onConnect: () => { //연결되었을 때
               
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

    return (<>
        <Jumbotron title="WebSocket Version 2" content="STOMP 메세지에 헤더를 추가해서 사용하기" />
    </>)
}