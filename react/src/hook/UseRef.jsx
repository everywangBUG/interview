import React, { useEffect, useRef, useState } from 'react';

const UseRef = () => {
    const inputRef = useRef(null);
    const numRef = useRef(0);
    const [, forceRender] = useState(0);

    useEffect(() => {
        inputRef.current && inputRef.current.focus();
    })

    return (<div>
        <input ref={inputRef} type='text' />
        <div
            onClick={() => {
                numRef.current += 1;
                forceRender(Math.random());
            }}
        >{numRef.current}</div>
    </div>)
}

export default UseRef;