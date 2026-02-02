import React, { useCallback, useEffect, useRef } from 'react';

const UseInterval = (fn, delay) => {
    const ref = useRef();
    const timerRef = useRef();

    // 每次渲染保存最新的函数
    useEffect(() => {
        ref.current = fn;
    });

    // 清理函数
    const clean = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
    }, [])

    // 重置定时器
    useEffect(() => {
        if (delay === null) {
            clean();
            return;
        }

        clean();

        // 创建新的定时器
        timerRef.current = setInterval(() => {
            ref.current?.();
        }, delay);

        return clean;
    }, [delay, clean]);

    return clean;
}

export default UseInterval;
