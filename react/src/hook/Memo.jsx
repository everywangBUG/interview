import React, { memo, useState, useEffect } from 'react';


// memo的作用是父组件的props变化的时候，才会重新渲染子组件
const Memo = () => {
    const [num, setNum] = useState(0);

    useEffect(() => {
        setInterval(() => {
            setNum(count => count += 2);
        }, 2000)
    }, []);
    
    return <>
        <div>{num}</div>
        {/* <Son count={888} /> */}
        <SonMemo value={999} />
    </>
}

const Son = (props) => {
    // count没有变化但是父组件重新渲染一定会触发子组件的渲染
    console.log(props.count, '间隔两秒打印一次num');

    return <div>
        {props.count}
    </div>
}

const SonMemo = memo((props) => {
    // 使用memo后如果props没有变化只打印一次
    console.log(props.value, '只打印一次');

    return <div>
        {props.value}
    </div>
})

export default Memo;