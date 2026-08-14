import Jumbotron from "@templates/Jumbotron";
import { useCallback } from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { Button, Card, Col, ListGroup, Row } from "react-bootstrap";
import Table from "react-bootstrap/Table"
import { Link, useNavigate } from "react-router-dom";

import dayjs from "dayjs";
import "dayjs/locale/ko";
import { FaXmark } from "react-icons/fa6";
dayjs.locale("ko"); //한국어로 설정

export default function PostList() {
    //state
    const [postList, setPostList] = useState([]);

    useEffect(() => {
        loadPosts();
    }, []);
    const loadPosts = useCallback(async () => {
       const url = `${import.meta.env.VITE_SERVER_URL}/api/post/`;
            
    console.log("ENV:", import.meta.env.VITE_SERVER_URL);
    console.log("URL:", url);

        const { data } = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/post/`);
        console.log(data);
        setPostList(data.items);
    }, []);

    return (<>
        <Jumbotron title="게시글 목록" />

        <Row mt={4}>
            <Col>
                <div className="text-nowrap table-responsive">
                    <Table responsive striped hover className="text-align">
                        <thead>
                            <tr>
                                <th>번호</th>
                                <th>제목</th>
                                <th className="text-center">작성일</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* 모노스페이스 터미널에 있는 글자체 로 하면 글자의 모든 폭이 같게 설정되어 보기 쉽다 consolas? */}
                            {postList.map((post) => (
                                <tr key={post.postNo}>
                                    <td>{post.postNo}</td>
                                    <td>
                                        <Link to={`/anonymous/${post.postNo}`}>
                                            {post.postTitle}
                                        </Link>
                                    </td>
                                    <td className="text-center">
                                        {dayjs(post.postCtime).format("YYYY.MM.D")}
                                        </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </Col>
        </Row>
    </>)
}