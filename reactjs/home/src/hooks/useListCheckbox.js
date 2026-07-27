import { useCallback } from "react";

export default function useListCheckbox(setCondition) {
    const changeListValue = useCallback(e=>{
        const { name, value, checked } = e.target;

        if(checked) { //체크되었다면
            setCondition(prev=>({
                ...prev,
                // [name] : [ ...prev.accountLevels , value ] // 전개연산
                // accountLevels : prev.accountLevels.concat(value) // concat사용
                // [name] : [ ...prev["accountLevels"], value]
                [name] : [ ...prev[name], value] 
            }));
        }
        else {//체크 안되었다면
            setCondition(prev=>({
                ...prev,
               // [name] : prev.accountLevels.filter(level => level != value)
               [name] : prev[name].filter(level => level != value)
            })); 
        }
        e=>setCondition(
                        prev=>({
                            ...prev, 
                            accountLevels : [...prev.accountLevels, "브론즈"]
                            })
                        )
    }, []);

    return changeListValue;
}