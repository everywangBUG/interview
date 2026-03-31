import React, { FC, useEffect, useState } from "react";

interface AppProps {

}

const Theme: FC<AppProps> = (props) => {
    const [config, setConfig] = useState({ theme: "dark" });
    
    useEffect(() => {
        console.log("update data");
    }, [config])
    
    const updateConfig = () => {
        // 重新设置相同的值也会打印useEffect里的log，因为引用类型变了，会使用Object.is()进行比较，设置新的对象的引用地址不一样，故重新打印
        setConfig({ theme: "dark" });
    }

    return <>
        <button onClick={updateConfig} type="button" style={{width: "150px"}}>点击我切换主题</button>
        <div>{config.theme}</div>
    </>
}

export default Theme;