//React Bootstrap의 Placeholder를 더 편하게 사용할 수 있도록 만든 컴포넌트

import { Placeholder } from "react-bootstrap";

export default function LoadingText(
    {
        //  value = undefined, //기본값이  undefined이기 때문에 없어도 안적어도 됨
        value,
        width = 80,
        height = "1em",
        line = 1
    }
) {
    if(value === undefined){
        return(
        <Placeholder as="span" animation="glow" style={
            {   
                display : "inline-flex", 
                flexDirection : "column",
                gap : "0.25em", // 줄과 줄사이의 틈(설정 x 시 딱 붙어서 나옴)
                width : width,
            }
        }>
            {/* line에 들어있는 숫자만큼의 크기를 가지는 배열을 만들어서 map을 사용 */}
            {Array.from({ length : line }).map((_, index)=>(
                <Placeholder key={index} style={
                    {
                        display : "block",
                        width  : width, //외부에서 전달된 width를 설정
                        height : height //외부에서 전달된 height를 설정
                    }
                }/>
            ))}
        </Placeholder>
        )
    }
    else {
        return <span style={
                { 
                    diplay : "inline-block",
                    height : height //외부에서 전달된 height를 설정
                }
            }>{value}</span>;
            // "\u00A0" <- 띄어쓰기
    }
}