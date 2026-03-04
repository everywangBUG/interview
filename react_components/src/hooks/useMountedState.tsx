import { useCallback, useEffect, useRef } from "react";

const useMountedState = () => {
    // 保存mounted的状态
    const mountedRef = useRef(false);

    // 使用useCallback，当传给其他的memo组件的时候不会额外的渲染
    const get = useCallback(() => mountedRef.current, [])

    // useEffect在dom操作之后异步执行，即mounted
    useEffect(() => {
        mountedRef.current = true;

        return () => {
            mountedRef.current = false;
        };
    }, []);

    return get;
}

export default  useMountedState;