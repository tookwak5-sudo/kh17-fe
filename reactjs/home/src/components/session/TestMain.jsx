import Jumbotron from "@templates/Jumbotron";
import { useCallback, useState } from "react";
import { Button } from "react-bootstrap";
import TestLeft from "./TestLeft";
import TestRight from "./TestRight";

export default function TestMain() {
    //state
    const [count, setCount] = useState(0);

    //callback
    const plusOne = useCallback(()=>setCount(prev=>prev+1), []);
    const plusTen = useCallback(()=>setCount(prev=>prev+10), []);
    return (<>
        <Jumbotron title="통합 저장소(jotai)의 필요성"/>

        <h1>Count : {count}</h1>

        <TestLeft plusOne={plusOne}/>
        <TestRight plusTen={plusTen}/>
    </>)
}