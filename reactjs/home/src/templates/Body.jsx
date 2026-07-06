import { Route, Routes } from "react-router-dom";
import CountryList from "../components/country/CountryList";
import CountryAdd from "../components/country/CountryAdd";
import CountryDetail from "../components/country/CountryDetail";
import LectureList from "../components/lecture/LectureList";
import BookList from "../components/book/BookList";
import Home from "../components/Home";
import NotFound from "../assets/NotFound";
import LectureAdd from "../components/lecture/LectureAdd";
import LectureDetail from "../components/lecture/LectureDetail";


export default function Body() {

    return(
    <Routes>
        <Route path="/" element={<Home/>}/>
        
        {/* 국가 */}
        <Route path="/country/list" element={<CountryList/>}></Route>
        <Route path="/country/add" element={<CountryAdd/>}></Route>
        {/* 제일 마지막에 적혀있는 값을 countryNo라는 이름으로 관리하겠다 */}
        <Route path="/country/detail/:countryNo" element={<CountryDetail/>}></Route>
        
        {/* 강좌 */}
        <Route path="/lecture/list" element={<LectureList/>}></Route>
        <Route path="/lecture/add" element={<LectureAdd/>}></Route>
        <Route path="/lecture/detail/:lectureNo" element={<LectureDetail/>}></Route>
        {/* 도서 */}
        <Route path="/book/list" element={<BookList/>}></Route>

        {/* fallback route */}
        <Route path="*" element={<NotFound/>}/>
    </Routes>
    )
}