import { useEffect } from "react";

const useLifeCycles = (mount: Function, unMounted: Function) => {
    useEffect(() => {
        // dom操作后异步执行，执行mounted函数
        if (mount) {
            mount();
        }

        return () => {
            // 清理之后卸载组件，执行unMounted函数
            unMounted();
        }
    }, [])
}

export default useLifeCycles;