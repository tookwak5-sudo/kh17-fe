import { useCallback, useEffect, useState } from "react";
import Jumbotron from "./jumbotron";
import axios from "axios";
import { FaChevronDown } from "react-icons/fa6";
import { ClockLoader } from "react-spinners";

function Exam10() {
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
        <Jumbotron title="더보기 방식의 목록" />

        <div className="row mt-4">
            <div className="col">
                <select value={size} onChange={e=>setSize(parseInt(e.target.value))}>
                    <option value="5">5개씩 보기</option>
                    <option value="10">10개씩 보기</option>
                    <option value="20">20개씩 보기</option>
                    <option value="50">50개씩 보기</option>
                </select>
            </div>
        </div>


        <div className="row mt-4">
            <div className="col">
                <div className="text-nowrap table-responsive">
                    <table className="table table-hover table-striped">
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
                                    <td>{country.countryName}</td>
                                    <td>{country.countryRegion}</td>
                                    <td>{country.countryCapital}</td>
                                    <td className="text-end">{country.countryPopulation.toLocaleString()}</td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        {/* 더보기 버튼 */}
        { last === false && (
        <div className="row mt-2">
            <div className="col">
                <button type="button" className="btn btn-success btn-lg w-100"
                        onClick={loadMoreList}>
                    <FaChevronDown/>
                    <span className="mx-2">더보기</span>
                    <FaChevronDown/>
                </button> 
            </div>
        </div>
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

export default Exam10;