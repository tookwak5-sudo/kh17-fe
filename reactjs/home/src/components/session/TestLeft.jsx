import { useAtom } from "jotai";
import { Button } from "react-bootstrap";
import { countState } from "../../utils/storage";

export default function() {
    const [count, setCount] = useAtom(countState); // storage에 만든 jotai state
    
    return(<>
         <Button variant="primary" className="me-2" 
            onClick={e=>setCount(count+1)}>+1</Button>
    </>)
}