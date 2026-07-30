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

import AccountJoin from "@components/account/AccountJoin";
import AccountJoinSuccess from "@components/account/AccountJoinSuccess";
import AccountJoinFail from "@components/account/AccountJoinFail";
import AccountPassword from "@components/account/AccountPassword";
import AccountChange from "@components/account/AccountChange";
import AccountLogin from "@components/account/AccountLogin";
import AccountNeedUpdate from "@components/account/AccountNeedUpdate";

import MyPage from "@components/account/MyPage";

import AdminUsers from "@components/admin/AdminUsers";
import AdminUsersScroll from "@components/admin/AdminUsersScroll";
import AdminUserDetail from "@components/admin/AdminUserDetail";

import NotFound from "@error/NotFound";

import AdminSaleAdd from "@components/admin/sale/AdminSaleAdd";

import SaleList from "@components/sale/SaleList";
import SaleDetail from "@components/sale/SaleDetail";

import TestMain from "@components/session/TestMain";

// Guard
import Private from "@guard/Private";
import Admin from "@guard/Admin";
import AccountBlock from "@error/AccountBlock";

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

        {/* 회원 관련 */}
        <Route path="/account/join" element={<AccountJoin/>}/>
        <Route path="/account/joinSuccess" element={<AccountJoinSuccess/>}/>
        <Route path="/account/joinFail" element={<AccountJoinFail/>}/>
        <Route path="/account/login" element={<AccountLogin/>}/>
        {/* private -> 비회원을 방지하는 요소 */}
        <Route path="/account/mypage" element={<Private><MyPage/></Private>}/>
        <Route path="/account/password" element={<Private><AccountPassword/></Private>}/>
        <Route path="/account/change" element={<Private><AccountChange/></Private>}/>
        <Route path="/account/needUpdate" element={<Private><AccountNeedUpdate/></Private>}/>
        
        {/* 상품 */}
        <Route path="/sale/list" element={<SaleList/>}/>
        <Route path="/sale/detail/:saleNo" element={<SaleDetail/>}/>
        {/* 관리자 */}
        <Route path="/admin/users" element={<Admin><AdminUsers/></Admin>}/>
        <Route path="/admin/users2" element={<Admin><AdminUsersScroll/></Admin>}/>
        <Route path="/admin/detail/:accountId" element={<Admin><AdminUserDetail/></Admin>}/>
        <Route path="/admin/saleAdd" element={<Admin><AdminSaleAdd/></Admin>}/>
        
        {/* 세션테스트 */}
        <Route path="/session/test" element={<TestMain/>}/>

        {/* error */}
        <Route path="/account/block" element={<AccountBlock/>}/>
        {/* fallback route */}
        <Route path="*" element={<NotFound/>}/>
    </Routes>
    )
}