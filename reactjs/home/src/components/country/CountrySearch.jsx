import Jumbotron from "@templates/Jumbotron";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Col, Form, ListGroup, Row } from "react-bootstrap";
import { throttle, debounce } from "lodash-es";

export default function CountrySearch() {
    //state
    const [keyword, setKeyword] = useState("");
    const [searchList, setSearchList] = useState([]);

    //callback
    const changeKeyword = useCallback(e=>{
            setKeyword(e.target.value);
    }, []);

    useEffect(()=>{
        searchKeyword(keyword);
    }, [keyword]);
    //throttle, debounce 설정 시 주의사항
    //throttle(함수, 실행주기) → 새로운 함수가 생성됨 -> 입력 중에 발생
    //debounce(함수, 실행주기) → 새로운 함수가 생성됨 -> blur와 비슷하게 쓰임 입력(event)을 쉬면 발생
    //-(주의) 함수를 만들 때 연관항목을 설정하지 말아야 한다 (함수가 재생성이 ㄷ안되야 함)
    //-일반적으로 실행주기는 250ms ~ 350ms 정도가 적당 (1초에 3~4번)
    const searchKeyword = useCallback(throttle(async (keyword)=>{
        if(keyword.length === 0) {
            //키워드가 업으면 검색결과 지워
            setSearchList([]);
            return;
        }
        console.log("searchKeyword 실행");

        const response = await axios.get(`/api/country/countryName/${keyword}`);
        setSearchList(response.data);
    }, 350), []);

    return(<>
        <Jumbotron title="국가명 검색 샘플"/> 

        {/* 검색창 */}
        <Row className="mt-4">
            <Col>
                <div className="position-relative">
                <Form.Control placeholder="검색어 입력" size="lg"
                    value={keyword} 
                    onChange={changeKeyword}/>
                <ListGroup className="position-absolute start-0 end-0 top-100">
                    {searchList.map(country=>(
                        <ListGroup.Item key={country.countryNo}>
                            {country.countryName}
                        </ListGroup.Item>
                    ))}

                </ListGroup>
                </div>
            </Col>
        </Row>

        <Row className="mt-4">
            <Col>
                <h2>결과 표시될 영역</h2>
            </Col>
        </Row>
    </>)
}