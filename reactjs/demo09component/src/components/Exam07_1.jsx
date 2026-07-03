import { useCallback, useEffect, useState } from "react";
import Jumbotron from "./jumbotron";
import { FaTrash } from "react-icons/fa6";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import axios from "axios";

function Exam07_1() {
    //서버에서 조회했다고 가정하고 state를 구현
    const [countryList, setCountryList] = useState([]);

    //effect
    // - 시작하자마자 서버에서 비동기통신으로 국가 목록을 달라고 1회 요청
    // - useEffect(함수, []);
    // - 연관항목을 비워두면 최초 1회만 실행되는 구문이 된다
    useEffect(() => {
        axios({
            url: "http://localhost:8080/api/country/list",
            method: "get"
        })
            .then(response => {
                console.log("서버의 대답(응답)", response);
                setCountryList(response.data);
            });
    }, []);

    //callback
    const deleteCountry = useCallback((target) => {
        Swal.fire({
            title: "정말 삭제하시겠습니까?",
            text: "삭제 후에는 복구할 수 없습니다.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "삭제",
            cancelButtonText: "취소"
        })
            //이후작업
            .then(result => {
                if (result.isConfirmed) {//확인
                    setCountryList(
                        countryList.filter(country => country.countryNo !== target.countryNo)
                    );
                    toast.success("삭제가 완료되었습니다.");
                }
            });
    }, [countryList]);
    return (<>
        <Jumbotron title="객체 배열 state와 화면제어" />

        <div className="row mt-4">
            <div className="col">
                <div className="text-nowrap table-responsive">
                    <table className="table table-hover table-striped">
                        <thead>
                            <tr>
                                <th>번호</th>
                                <th>국가</th>
                                <th>대륙</th>
                                <th>수도</th>
                                <th className="text-end">인구</th>
                                <th>관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* 모노스페이스 터미널에 있는 글자체 로 하면 글자의 모든 폭이 같게 설정되어 보기 쉽다 consolas? */}
                            {countryList.map((country) => (
                                <tr key={country.countryNo}>
                                    <td>{country.countryNo}</td>
                                    <td>{country.countryName}</td>
                                    <td>{country.countryRegion}</td>
                                    <td>{country.countryCapital}</td>
                                    <td className="text-end">{country.countryPopulation.toLocaleString()}</td>
                                    <td><FaTrash className="text-danger" onClick={(e) => deleteCountry(country)} /></td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    </>)
}

export default Exam07_1;