import React from 'react';
import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

const Input = forwardRef((_, ref) => {
    const inputRef = useRef(null);
    
    useImperativeHandle(ref, () => {
        return {
            aaa() {
                inputRef.current?.focus();
            }
        }
    }, [inputRef])

    return <input type='text' ref={inputRef} />
})

const ForwardRef = () => {
    const ref = useRef(null);

    useEffect(() => {
        // 使用forwardRef转发，使用子组件的ref
        // ref.current?.focus();
        // 使用useImperativeHandle勾子暴露子组件的方法
        ref.current?.aaa();
    }, [])

    return <Input ref={ref} />
}

export default ForwardRef;