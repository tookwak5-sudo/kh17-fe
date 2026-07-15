import { Button } from "react-bootstrap";

export default function TestRight({plusTen}){
    return(<>
        <Button variant="primary" className="me-2" 
        onClick={plusTen}>+10</Button>
    </>)
}