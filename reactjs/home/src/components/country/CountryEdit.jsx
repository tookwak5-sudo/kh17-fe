import axios from "axios";
import {Row, Form, Col, Button} from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import Jumbotron from "@templates/Jumbotron";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FaAsterisk, FaList, FaSquarePen, FaXmark } from "react-icons/fa6";
import { toast } from "react-toastify";

export default function CountryEdit() {
    const { countryNo } = useParams();

    if (/^[0-9]+$/.test(countryNo) === false) { //숫자가 아니면
        toast.error("입력이 올바르지 않습니다");
        return <Navigate to="/country/list" replace />
    }

    const navigate = useNavigate();

    const [country, setCountry] = useState({ //입력 데이터를 관리하는 state
        countryRegion : "",
        countryName : "",
        countryCapital : "",
        countryPopulation : 0
    });

    //시작하자마자 1번 불러오게 하기(연관함수 비워두기)
    useEffect(() => {
        loadData();
    }, []);

    const loadData = useCallback(async () => {
        const response = await axios.get(`/api/country/${countryNo}`);
        setCountry(response.data);
    }, []);

    const [result, setResult] = useState({ //판정 결과를 관리하는 state
        countryRegion: "",
        countryName: "",
        countryCapital: "",
        countryPopulation: ""
    });

    //callback - 호출 가능한 함수 (연관항목을 적어 갱신 최소화)
    const changeStringValue = useCallback(e => {
        const { name, value } = e.target;
        setCountry({
            ...country,// 나머지값은 유지
            [name]: value // 입력값만 변경
        });
    }, [country]);

    const changeNumericValue = useCallback(e => {
        const { name, value } = e.target;
        const regex = /[^0-9]+/g; //숫자가 아니면
        const replacement = value.replace(regex, ""); //공백으로 대체
        const result = parseInt(replacement); // 숫자로 변환
        setCountry({
            ...country,
            [name]: (result || 0) //변수면 []
        },);
    }, [country]);

    //검사하여 결과를 갱신하는 함수들
    const checkCountryRegion = useCallback(() => {
        const regex = /^(아시아|아프리카|[남북]아메리카|유럽|오세아니아)$/;
        const valid = regex.test(country.countryRegion);
        setResult({
            ...result,
            countryRegion: (valid ? "is-valid" : "is-invalid") // 변수가 아니라 상수이기 때문에 []x
        });
    }, [country.countryRegion, result]);
    const checkCountryName = useCallback(() => {
        const regex = /^[가-힣]{1,10}$/;
        const valid = regex.test(country.countryName);
        setResult({
            ...result,
            countryName: valid ? "is-valid" : "is-invalid"
        });
    }, [country.countryName, result]);

    const checkCountryCapital = useCallback(() => {
        const valid = country.countryCapital.length > 0;
        setResult({
            ...result,
            countryCapital: valid ? "is-valid" : "is-invalid"
        });
    }, [country.countryCapital, result]);

    const checkCountryPopulation = useCallback(() => {
        const valid = country.countryPopulation > 0;
        setResult({
            ...result,
            countryPopulation: valid ? "is-valid" : "is-invalid"
        });
    }, [country.countryPopulation, result]);

    //데이터 전송 함수
    // const send = ()=> {}; 연관항목의 유무(useCallback사용시 연관 검색 호출 할 때만 출력되어)
    const send = useCallback(async () => {
        const response = await axios.put(`/api/country/${countryNo}`, country);
        toast.success("국가 정보 변경이 완료되었습니다");
        navigate(`/country/detail/${countryNo}`);
    }, [country]);

    //memo - state를 이용해서 추가적으로 계산해내는 데이터
    const valid = useMemo(() => {
        if (result.countryRegion !== "is-valid") return false;
        if (result.countryName !== "is-valid") return false;
        if (result.countryCapital !== "is-valid") return false;
        if (result.countryPopulation !== "is-valid") return false;
        return true;
    }, [result]);

    //effect - 특정항목이 변경될 때마다 자동 실행되는 코드블럭 (낭비의 끝판왕)
    //사용법 : useEffect(함수, [연관항목]);

    //country에서 countryRegion이 변경되자마자 checkCountryRegion 함수 실행하세요!
    useEffect(() => {
        //처음에는 검사하지 마세요
        if (country.countryRegion === "" && result.countryRegion === "") return;

        //검사함수를 실행하세요
        checkCountryRegion();
    }, [country.countryRegion, result.countryRegion]);


    return (<>  
        <Jumbotron title="국가 정보 수정 화면"/>

        {/* 국가정보 입력화면 */}
        {/* 대륙명 */}
        <Row className="mt-4">
            <Form.Label column sm={3}>
                <span>대륙명</span>
                <FaAsterisk className="text-danger"/>
            </Form.Label>
            <Col sm={9}>
                <Form.Select type="text" name="countryRegion" className={result.countryRegion}
                        value={country.countryRegion}
                         onChange={changeStringValue}>
                        <option value="">선택하세요</option>
                        <option>아시아</option>
                        <option>아프리카</option>
                        <option>북아메리카</option>
                        <option>남아메리카</option>
                        <option>유럽</option>
                        <option>오세아니아</option>
                </Form.Select>
                    <div className="invalid-feedback">필수 입력 값입니다</div>
            </Col>
        </Row>

        {/* 국가명 */}
        <Row className="mt-4">
            <Form.Label column sm={3}>
                <span>국가명</span>
                <FaAsterisk className="text-danger"/>
            </Form.Label>       
            <Col sm={9}>
                <Form.Control type="text" name="countryName" className={result.countryName}
                        value={country.countryName}
                        onChange={changeStringValue} 
                        onBlur={checkCountryName}
                        />
                    <div className="valid-feedback">국가 이름이 설정되었습니다</div>
                    <div className="invalid-feedback">국가명은 한글로만 작성 가능합니다</div>
            </Col>
        </Row>

        {/* 수도 */}
        <Row className="mt-4">
            <Form.Label column sm={3}>
                <span>수도</span>
                <FaAsterisk className="text-danger"/>
            </Form.Label>     
            <Col sm={9}>
                <Form.Control type="text" name="countryCapital" className={result.countryCapital}
                        value={country.countryCapital}
                        onChange={changeStringValue}
                        onBlur={checkCountryCapital} 
                        />
                    <div className="valid-feedback">수도명이 설정되었습니다</div>
                    <div className="invalid-feedback">필수 입력 값입니다</div>
            </Col>
        </Row>

        {/* 인구 */}
        <Row className="mt-4">
            <Form.Label column sm={3}>
                <span>인구수</span>
                <FaAsterisk className="text-danger"/>
            </Form.Label>     
            <div className="col-sm-9">
                <Form.Control type="text" name="countryPopulation" className={result.countryPopulation}
                        value={country.countryPopulation}
                        onChange={changeNumericValue} 
                        onBlur={checkCountryPopulation}
                        />
                    <div className="valid-feedback">인구가 설정되었습니다</div>
                    <div className="invalid-feedback">인구는 0보다 커야합니다</div>
            </div>
        </Row>

        <Row className="mt-5">
            <Col className="text-end">
                <Button as={Link} to={`/country/list`} variant="secondary">
                    <FaList className="me-2"/>
                    <span>목록으로</span>
                </Button>
                <Button as={Link} to={`/country/detail/${countryNo}`} variant="danger" className="ms-2">
                    <FaXmark className="me-2"/>
                    <span>취소하기</span>
                </Button>
                <Button type="button" variant="success" className="ms-2" 
                disabled={valid === false} onClick={send}>
                <FaSquarePen className="me-2"/>
                <span>수정하기</span>
                </Button>
            </Col>
        </Row>
    </>)
}