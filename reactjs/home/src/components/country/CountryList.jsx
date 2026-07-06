import Jumbotron from "../../templates/Jumbotron";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { FaChevronDown, FaPlus } from "react-icons/fa6";
import { ClockLoader } from "react-spinners";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from 'react-bootstrap/Button';
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table"
import { Link } from "react-router-dom";

export default function CountryList() {
 //state
    const [countryList, setCountryList] = useState([]);
    const [last, setLast] = useState(false);
    const [size, setSize] =useState(10);

    const [loading, setLoading] = useState(false);

    //effect
    useEffect(() => {
        loadMoreList();
    }, []);

    //callback
    const loadMoreList = useCallback(()=>{
        const dataSize = countryList.length;
        const lastCountryNo = dataSize === 0 ? 0 : countryList[dataSize-1].countryNo;
        setLoading(true);

        axios({
            url : "http://localhost:8080/api/country/listForReact",
            method : "get",
            params : {//GET 방식일 때
                lastCountryNo : lastCountryNo,
                size : size
            }
        })
        .then(response=>{
            //덮어쓰기가 아니라 추가(이어쓰기)가 필요
            // setCountryList(response.data.list);//덮어쓰기
            console.log(countryList, response.data.list);
            setCountryList([...countryList, ...response.data.list]);//이어쓰기
            setLast(response.data.last);
        })
        .finally(()=>{
            setLoading(false);
        });
    }, [countryList, size]); //이전 last정보는 필요없기 때문에 연관항목에서는 필요없음

    return (<>
        <Jumbotron title="국가 목록" />

        <Row mt={4}>
            <Col xs={6}>
                <Form.Select value={size} onChange={e=>setSize(parseInt(e.target.value))}>
                    <option value="5">5개씩 보기</option>
                    <option value="10">10개씩 보기</option>
                    <option value="20">20개씩 보기</option>
                    <option value="50">50개씩 보기</option>
                </Form.Select>
            </Col>
            <Col xs={6} className="text-end">
                {/* <Link to="/country/add" className="btn btn-success">
                <FaPlus/>
                    <span className="ms-2">신규 등록</span>
                </Link> */}

                <Button as={Link} to="/country/add" variant="success">
                    <FaPlus/>
                    <span className="ms-2">신규 등록</span>
                </Button>
            </Col>
        </Row>


        <Row mt={4}>
            <Col>
                <div className="text-nowrap table-responsive">
                    <Table responsive striped hover className="text-align">
                        <thead>
                            <tr>
                                <th>국가</th>
                                <th>대륙</th>
                                <th>수도</th>
                                <th className="text-end">인구</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* 모노스페이스 터미널에 있는 글자체 로 하면 글자의 모든 폭이 같게 설정되어 보기 쉽다 consolas? */}
                            {countryList.map((country) => (
                                <tr key={country.countryNo}>
                                    <td>
                                        <Link to={`/country/detail/${country.countryNo}`}>
                                        {country.countryName}
                                        </Link>
                                    </td>
                                    <td>{country.countryRegion}</td>
                                    <td>{country.countryCapital}</td>
                                    <td className="text-end">{country.countryPopulation.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
             </Col>
        </Row>

        {/* 더보기 버튼 */}
        { last === false && (
        <Row mt={2}>
            <Col>
                <Button variant="outline-success" size="lg" onClick={loadMoreList}>
                    <FaChevronDown/>
                    <span className="mx-2">더보기</span>
                    <FaChevronDown/>
                </Button>
            </Col>
        </Row>
        )}

        {/* 로딩화면 */}
        { loading === true && (
        <div className="position-fixed top-0 start-0 
                    w-100 h-100 bg-dark bg-opacity-25
                    d-flex justify-content-center align-items-center">
            <div className="d-flex flex-column text-center">
                <ClockLoader size={75} loading={loading} />
                <p className="mt-2">불러오는중</p>
            </div>
        </div>
        )}
    </>)
}