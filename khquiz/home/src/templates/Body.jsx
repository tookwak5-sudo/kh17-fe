import { Route, Routes } from "react-router-dom";
import Home from "@components/Home";
import PostWrite from "@components/post/PostWrite";
import PostList from "@components/post/PostList";
import PostDetail from "@components/post/PostDetail";
import PostEdit from "@components/post/PostEdit";

export default function Body() {
    return(
        <Routes>
            <Route path="/" element={<Home/>}/>

            {/* 게시판 */}
            <Route path="/anonymous/add" element={<PostWrite/>}/>
            <Route path="/anonymous/" element={<PostList/>}/>
            <Route path="/anonymous/:postNo" element={<PostDetail/>}/>
            <Route path="/anonymous/:postNo/edit" element={<PostEdit/>}/>
        </Routes>
    )
}