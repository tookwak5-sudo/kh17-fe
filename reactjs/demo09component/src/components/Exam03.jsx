//import
import { useCallback, useMemo, useState } from "react";
import Jumbotron from "./jumbotron";

//function
function Exam03() {
    const [country, setCountry] = useState({
        countryRegion : "",
        countryName : "",
        countryCapital : "",
        countryPopulation : 0
    });

    //callback
    const changeStringValue = useCallback(e=>{
        const {name, value} = e.target;
        setCountry({
            ...country,// country값은 유지
            [name] : value // 입력값만 변경

        });
    }, [country]);

    const changeNumericValue = useCallback(e=>{
        const {name, value} = e.target;
        const regex = /[^0-9]+/g; //숫자가 아니면
        const replacement = value.replace(regex, ""); //공백으로 대체
        setCountry({
            ...country,
            [name] : parseInt(replacement || 0)
        },);
    }, [country]);

    
    const regionValid = useMemo(()=>{
        const regex = /^(아시아|아프리카|[남북]아메리카|유럽|오세아니아)$/;
        return regex.test(country.countryRegion);
    }, [country]);

    const nameValid = useMemo(()=>{
        const regex = /^[가-힣]{1,10}/;
        return regex.test(country.countryName);
    }, [country]);

    const capitalValid = useMemo(()=>{
        const regex = /^[가-힣]{1,10}/;
        return regex.test(country.countryCapital);
    }, [country]);

    const populationValid = useMemo(()=>{
        const regex = /[0-9]+/g;
        return regex.test(country.countryPopulation) && country.countryPopulation > 0;
    }, [country]);

    const regionFeedback = useMemo(()=>{
        return regionValid ? "is-valid" : "is-invalid";
    }, [regionValid]);

    const nameFeedback = useMemo(()=>{
        return nameValid ? "is-valid" : "is-invalid";
    }, [nameValid]);

    const capitalFeedback = useMemo(()=>{
        return capitalValid ? "is-valid" : "is-invalid";
    }, [capitalValid]);

    const populationFeedback = useMemo(()=>{
        return populationValid ? "is-valid" : "is-invalid";
    }, [populationValid]);

    const allValid = useMemo(()=>{
        return regionValid 
                && nameValid 
                && capitalValid
                && populationValid;
    }, [regionValid, nameValid, capitalValid, populationValid]);


    return(
    <>  
        <Jumbotron title="국가정보 등록" content="등록을 위한 국가정보를 작성해주세요"/>

        {/* 국가정보 입력화면 */}
        {/* 대륙명 */}
        <div className="row mt-4">
            <label className="col-sm-3 col-form-label">
                대륙명<span className="text-danger">*</span>
            </label>
            <div className="col-sm-9">
                <select type="text" name="countryRegion" className={`form-select ${regionFeedback}`}
                        value={country.countryRegion}
                        onChange={changeStringValue} >
                        <option val="">선택하세요</option>
                        <option val="">아시아</option>
                        <option val="">아프리카</option>
                        <option val="">북아메리카</option>
                        <option val="">남아메리카</option>
                        <option val="">유럽</option>
                        <option val="">오세아니아</option>
                </select>
                    <div className="invalid-feedback">필수 입력 값입니다</div>
            </div>
        </div>

        {/* 국가명 */}
        <div className="row mt-4">
            <label className="col-sm-3 col-form-label">
                국가명<span className="text-danger">*</span>
            </label>
            <div className="col-sm-9">
                <input type="text" name="countryName" className={`form-control ${nameFeedback}`}
                        value={country.countryName}
                        onChange={changeStringValue} 
                        />
                    <div className="invalid-feedback">필수 입력 값입니다</div>
            </div>
        </div>

        {/* 수도 */}
        <div className="row mt-4">
            <label className="col-sm-3 col-form-label">
                수도<span className="text-danger">*</span>
            </label>
            <div className="col-sm-9">
                <input type="text" name="countryCapital" className={`form-control ${capitalFeedback}`}
                        value={country.countryCapital}
                        onChange={changeStringValue} 
                        />
                    <div className="invalid-feedback">필수 입력 값입니다</div>
            </div>
        </div>

        {/* 인구 */}
        <div className="row mt-4">
            <label className="col-sm-3 col-form-label">
                인구<span className="text-danger">*</span>
            </label>
            <div className="col-sm-9">
                <input type="text" name="countryPopulation" className={`form-control ${populationFeedback}`}
                        value={country.countryPopulation}
                        onChange={changeNumericValue} 
                        />
                    <div className="invalid-feedback">필수 입력 값입니다</div>
            </div>
        </div>

        <div className="row mt-4">
            <div className="col">
                <button className="btn btn-success w-100" disabled={allValid === false}>등록</button>
            </div>
        </div>
    </>
    )
}

//export
export default Exam03;