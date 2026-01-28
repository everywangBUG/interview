import React from 'react';
import { useLayoutEffect, useEffect, useState, useRef } from 'react';

const UseLayoutEffect = () => {
    const [toggle, setToggle] = useState(false);
    const [effectStyle, setEffectStyle] = useState(null);
    const [layoutStyle, setLayoutStyle] = useState(null);
    const layoutRef = useRef(null);
    const effectRef = useRef(null);
    // useLayoutEffect先执行effect再渲染绘制，同步执行effect
    useLayoutEffect(() => {
        if (layoutRef.current) {
            // 同步测量和更新DOM
            const rect = layoutRef.current.getBoundingClientRect();
            console.log(rect.width, 'layoutRect');
            // 在浏览器绘制前完成更新
            setLayoutStyle({
                transform: `translateX(${rect.width}px)`,
                backgroundColor: 'skyblue',
                transition: 'transform 0.3s, background-color 0.3s'
            })

            // 立即同步更新，不会有中间动画效果
            // 使用requestAnimationFrame确保在下一帧之前更新
            requestAnimationFrame(() => {
                setLayoutStyle({
                    transform: 'translateX(0px)',
                    backgroundColor: 'skyblue',
                    transition: 'transform 0.3s, background-color 0.3s'
                })
            }, 200)
        }
    }, [toggle]);

    // useEffect先渲染后执行effect副作用，异步执行effect
    useEffect(() => {
        if (effectRef.current) {
            const rect = effectRef.current.getBoundingClientRect();
            console.log(rect.width, 'effectRect');
            setEffectStyle({
                transform: `translateX(${rect.width}px)`,
                backgroundColor: 'blue',
                transition: 'transform 0.3s, background-color 0.3s'
            })
            
            setTimeout(() => {
                setEffectStyle({
                    transform: 'translateX(0px)',
                    backgroundColor: 'blue',
                    transition: 'transform 0.3s, background-color 0.3s'
                })
            }, 200)
        }
    }, [toggle]);
    
    return (
        <div>
            <button onClick={() => setToggle(!toggle)}>切换</button>
            <div
                ref={layoutRef}
                style={{
                    width: '200px',
                    height: '100px',
                    backgroundColor: 'skyblue',
                    ...layoutStyle
                }}
                >
            </div>
            <div
                ref={effectRef}
                style={{
                    width: '200px',
                    height: '100px',
                    backgroundColor: 'red',
                    ...effectStyle
                }}
                >
            </div>
        </div>
    )
}

export default UseLayoutEffect;
