import React, { useEffect, useReducer, useState } from 'react';

const reducer = (state, action) => {
    switch(action.type) {
        case 'add':
            state += action.num
    }

    return state;
}

const Closure = () => {
    const [count, setCount] = useState(0);
    const [count1, setCount1] = useState(0);
    const [count2, dispatch] = useReducer(reducer, 0);
    const [count3, setCount3] = useState(0);
    
    useEffect(() => {
        const timer = setInterval(() => {
            // 闭包导致每次都是在count为0的基础上+1
            setCount(count + 1);
            // 第一种方式使用setState的勾子的第二个参数
            setCount1(preCount => preCount += 1);
            // 使用useReducer解决
            dispatch({ type: 'add', num: 1 });
        }, 2000);

        return () => {
            clearInterval(timer);
        }
    }, [])

    // 使用useEffect的依赖项数组解决
    useEffect(() => {
        // 适用于在外边要使用count3的的情况
        console.log(count3);
        // 每次都要跑定时器，在这里不适用
        const timer1 = setInterval(() => {
            setCount3(count3 + 1)
        }, 2000);

        return () => {
            clearInterval(timer1);
        }
    }, [count3])

    return <div>
            <div>闭包不能+1：{count}</div>
            <div>使用setState中的勾子的第二个参数解决+1：{count1}</div>
            <div>使用useReducer解决+1：{count2}</div>
            <div>使用useEffect的依赖项数组解决：{count3}</div>
        </div>
}

export default Closure;