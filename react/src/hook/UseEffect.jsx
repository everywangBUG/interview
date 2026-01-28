import React, { useEffect, useState } from 'react';

const getData = async () => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(666);
        }, 5000)
    })
}

const UseEffect = () => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        getData().then((data) => {
            setCount(data);
        });

        const timer = setInterval(() => {
            console.log(count, 'count');
        }, 2000)

        // 再次执行Effect之前，会先执行清理函数
        return () => {
            clearInterval(timer);
        }
    }, [count]) // 必须传空数组才能执行serCount刷新页面，传空数组每次都执行

    return (
        <button type='text' onClick={() => setCount(preCount => preCount += 1)}>{count}</button>
    )
}

export default UseEffect;