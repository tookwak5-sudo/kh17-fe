import { Route, Routes } from "react-router-dom";
import CountryList from "../components/country/CountryList";
import LectureList from "../components/lecture/LectureList";
import BookList from "../components/book/BookList";
import Home from "../components/Home";
import NotFound from "../assets/NotFound";
import CountryAdd from "../components/country/CountryAdd";


export default function Body() {

    return(
    <Routes>
        <Route path="/" element={<Home/>}/>
        
        {/* 국가 */}
        <Route path="/country/list" element={<CountryList/>}></Route>
        <Route path="/country/add" element={<CountryAdd/>}></Route>
       
       {/* 강좌 */}
        <Route path="/lecture/list" element={<LectureList/>}></Route>

        {/* 도서 */}
        <Route path="/book/list" element={<BookList/>}></Route>

        {/* fallback route */}
        <Route path="*" element={<NotFound/>}/>
    </Routes>
    )
}