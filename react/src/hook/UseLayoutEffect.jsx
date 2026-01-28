import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';

const LayoutEffectDemo = () => {
  const [count, setCount] = useState(0);
  const [effectStyle, setEffectStyle] = useState({});
  const [layoutStyle, setLayoutStyle] = useState({});
  const [toggle, setToggle] = useState(true);
  
  const effectRef = useRef(null);
  const layoutRef = useRef(null);
  
  // useEffect 版本 - 在绘制后执行
  useEffect(() => {
    console.log('useEffect 执行');
    
    if (toggle && effectRef.current) {
      // 模拟DOM测量
      const rect = effectRef.current.getBoundingClientRect();
      
      // 这里会先看到元素在原始位置，然后跳转到新位置
      setEffectStyle({
        transform: `translateX(${rect.width}px)`,
        backgroundColor: 'lightcoral',
        transition: 'transform 0.3s, background-color 0.3s'
      });
      
      // 故意延迟，让闪烁更明显
      setTimeout(() => {
        setEffectStyle({
          transform: 'translateX(0px)',
          backgroundColor: 'lightcoral',
          transition: 'transform 0.3s, background-color 0.3s'
        });
      }, 100);
    }
  }, [toggle]);
  
  // useLayoutEffect 版本 - 在绘制前执行
  useLayoutEffect(() => {
    console.log('useLayoutEffect 执行');
    
    if (toggle && layoutRef.current) {
      // 同步测量和更新DOM
      const rect = layoutRef.current.getBoundingClientRect();
      
      // 在浏览器绘制前完成所有更新
      setLayoutStyle({
        transform: `translateX(${rect.width}px)`,
        backgroundColor: 'lightblue',
        transition: 'transform 0.3s, background-color 0.3s'
      });
      
      // 立即同步更新，不会有中间状态
      // 注意：这里使用requestAnimationFrame确保在下一帧之前更新
      requestAnimationFrame(() => {
        setLayoutStyle({
          transform: 'translateX(0px)',
          backgroundColor: 'lightblue',
          transition: 'transform 0.3s, background-color 0.3s'
        });
      });
    }
  }, [toggle]);
  
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>useEffect vs useLayoutEffect 对比演示</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => setToggle(!toggle)}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          切换效果 (当前: {toggle ? '开' : '关'})
        </button>
        
        <button 
          onClick={() => setCount(count + 1)}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          触发重新渲染: {count}
        </button>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
        {/* useEffect 示例 */}
        <div style={{ width: '45%', padding: '20px', border: '2px solid #ccc', borderRadius: '10px' }}>
          <h2 style={{ color: 'lightcoral' }}>useEffect (会闪烁)</h2>
          <p>你会看到元素先出现在原始位置，然后跳转到右侧，再动画返回</p>
          
          <div
            ref={effectRef}
            style={{
              width: '200px',
              height: '100px',
              backgroundColor: 'lightcoral',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              fontWeight: 'bold',
              borderRadius: '8px',
              margin: '20px auto',
              ...effectStyle
            }}
          >
            useEffect
          </div>
          
          <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
            <h4>执行流程:</h4>
            <ol>
              <li>组件渲染</li>
              <li>浏览器绘制元素(原始位置)</li>
              <li>useEffect 执行，测量元素</li>
              <li>状态更新触发重新渲染</li>
              <li>浏览器重新绘制(新位置)</li>
              <li>用户看到"闪烁"效果</li>
            </ol>
          </div>
        </div>
        
        {/* useLayoutEffect 示例 */}
        <div style={{ width: '45%', padding: '20px', border: '2px solid #ccc', borderRadius: '10px' }}>
          <h2 style={{ color: 'lightblue' }}>useLayoutEffect (不闪烁)</h2>
          <p>元素直接动画从右侧滑入，看不到初始位置</p>
          
          <div
            ref={layoutRef}
            style={{
              width: '200px',
              height: '100px',
              backgroundColor: 'lightblue',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              fontWeight: 'bold',
              borderRadius: '8px',
              margin: '20px auto',
              ...layoutStyle
            }}
          >
            useLayoutEffect
          </div>
          
          <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
            <h4>执行流程:</h4>
            <ol>
              <li>组件渲染</li>
              <li>useLayoutEffect 同步执行，测量元素</li>
              <li>状态更新触发重新渲染(同一周期内)</li>
              <li>浏览器一次性绘制最终结果</li>
              <li>用户看不到中间状态</li>
            </ol>
          </div>
        </div>
      </div>
      
      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#e9ecef', borderRadius: '10px' }}>
        <h3>关键区别总结:</h3>
        <ul>
          <li><strong>useEffect</strong>: 异步执行，用户可能看到DOM更新前后的"闪烁"</li>
          <li><strong>useLayoutEffect</strong>: 同步执行，在浏览器绘制前完成所有更新</li>
          <li><strong>何时使用useLayoutEffect</strong>: 当DOM测量/更新会明显影响视觉表现时</li>
          <li><strong>性能注意</strong>: useLayoutEffect会阻塞渲染，过度使用可能影响性能</li>
        </ul>
      </div>
      
      {/* 另一个更简单的对比示例 */}
      <div style={{ marginTop: '40px', borderTop: '2px solid #ddd', paddingTop: '20px' }}>
        <h3>简单位置测量示例:</h3>
        
        <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
          <div style={{ flex: 1 }}>
            <h4>useEffect (有闪烁):</h4>
            <PositionMeasurementEffect />
          </div>
          
          <div style={{ flex: 1 }}>
            <h4>useLayoutEffect (无闪烁):</h4>
            <PositionMeasurementLayoutEffect />
          </div>
        </div>
      </div>
    </div>
  );
};

// useEffect 组件
const PositionMeasurementEffect = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef(null);
  
  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setPosition({ x: rect.x, y: rect.y });
    }
  }, []);
  
  return (
    <div
      ref={ref}
      style={{
        width: '150px',
        height: '80px',
        backgroundColor: position.x > 0 ? 'lightgreen' : 'lightgray',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background-color 0.5s',
        borderRadius: '8px'
      }}
    >
      位置: ({Math.round(position.x)}, {Math.round(position.y)})
    </div>
  );
};

// useLayoutEffect 组件
const PositionMeasurementLayoutEffect = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef(null);
  
  useLayoutEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setPosition({ x: rect.x, y: rect.y });
    }
  }, []);
  
  return (
    <div
      ref={ref}
      style={{
        width: '150px',
        height: '80px',
        backgroundColor: position.x > 0 ? 'lightgreen' : 'lightgray',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background-color 0.5s',
        borderRadius: '8px'
      }}
    >
      位置: ({Math.round(position.x)}, {Math.round(position.y)})
    </div>
  );
};

export default LayoutEffectDemo;