import { Route, Routes } from "react-router-dom";
import Home from "@components/Home";

import CountryAdd from "@components/country/CountryAdd";
import CountryList from "@components/country/CountryList";
import CountryDetail from "@components/country/CountryDetail";
import CountryEdit from "@components/country/CountryEdit";
import CountrySearch from "@components/country/CountrySearch";
import CountryComplexSearch from "@components/country/CountryComplexSearch";


import LectureAdd from "@components/lecture/LectureAdd";
import LectureList from "@components/lecture/LectureList";
import LectureDetail from "@components/lecture/LectureDetail";
import LectureEdit from "@components/lecture/LectureEdit";
import LectureComplexSearch from "@components/lecture/LectureComplexSearch";

import BookAdd from "@components/book/BookAdd";
import BookList from "@components/book/BookList";
import BookDetail from "@components/book/BookDetail";
import BookEdit from "@components/book/BookEdit";
import BookSpa from "@components/book/BookSpa";

import NotFound from "@error/NotFound";

export default function Body() {

    return(
    <Routes>
        <Route path="/" element={<Home/>}/>
        
        {/* 국가 */}
        <Route path="/country/list" element={<CountryList/>}/>
        <Route path="/country/add" element={<CountryAdd/>}/>
        {/* 제일 마지막에 적혀있는 값을 countryNo라는 이름으로 관리하겠다 */}
        <Route path="/country/detail/:countryNo" element={<CountryDetail/>}/>
        <Route path="/country/edit/:countryNo" element={<CountryEdit/>}/>
        <Route path="/country/search" element={<CountrySearch/>}/>
        <Route path="/country/complex" element={<CountryComplexSearch/>}/>
        
        {/* 강좌 */}
        <Route path="/lecture/list" element={<LectureList/>}/>
        <Route path="/lecture/add" element={<LectureAdd/>}/>
        <Route path="/lecture/detail/:lectureNo" element={<LectureDetail/>}/>
        <Route path="/lecture/edit/:lectureNo" element={<LectureEdit/>}/>
        <Route path="/lecture/complex" element={<LectureComplexSearch/>}/>
        {/* 도서 */}
        <Route path="/book/list" element={<BookList/>}/>
        <Route path="/book/add" element={<BookAdd/>}/>
        <Route path="/book/detail/:bookId" element={<BookDetail/>}/>
        <Route path="/book/edit/:bookId" element={<BookEdit/>}/>
        <Route path="/book/spa" element={<BookSpa/>}/>
        {/* fallback route */}
        <Route path="*" element={<NotFound/>}/>
    </Routes>
    )
}