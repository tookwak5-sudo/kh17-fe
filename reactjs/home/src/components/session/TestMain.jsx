import Jumbotron from "@templates/Jumbotron";
import { useCallback, useState } from "react";
import { Button } from "react-bootstrap";
import TestLeft from "./TestLeft";
import TestRight from "./TestRight";
import { countState } from "@src/utils/storage";
import { useAtom } from "jotai";

export default function TestMain() {
    // component단위로 작동하는 react state
    // const [count, setCount] = useState(0);

    // jotai
    const [count, setCount] = useAtom(countState); // storage에 만든 jotai state

    return (<>
        <Jumbotron title="통합 저장소(jotai)의 필요성"/>

        <h1>Count : {count}</h1>

        <TestLeft />
        <TestRight />
    </>)
}