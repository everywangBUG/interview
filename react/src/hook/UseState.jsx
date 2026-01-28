import React from 'react';
import { useState } from 'react';

const UseState = () => {
    const [count, setCount] = useState(() => {
        const num1 = 1 + 2;
        const num2 = 2 + 3;
        
        return num1 + num2;
    })

    return (
        <button type='text' onClick={() => setCount((preCount) => preCount += 1)}>{count}</button>
    )
}

export default UseState;