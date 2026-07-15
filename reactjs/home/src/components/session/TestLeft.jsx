import { Button } from "react-bootstrap";

export default function({plusOne}) {
    return(<>
         <Button variant="primary" className="me-2" 
         onClick={plusOne}>+1</Button>
    </>)
}