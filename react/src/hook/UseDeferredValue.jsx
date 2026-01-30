import React,{
    useState,
    useDeferredValue,
    useRef,
    memo,
    forwardRef
} from 'react';

const UseDeferredValue = () => {
    const [value, setValue] = useState('');
    const listRef = useRef(null);
    const containerRef = useRef(null);
    // 使用deferredValue作为不紧急更新的部分
    const deferredValue = useDeferredValue(value);

    return <div ref={containerRef}>
        <input
            type='text'
            value={value}
            onChange={(e) => setValue(e.target.value)}
        />
        <LongList value={deferredValue} ref={listRef} />
    </div>
}

const LongList = memo(forwardRef((props, ref) => {
    const renderList = (value) => {
        const items = [];
        for (let i = 0; i <= 50000; i++) {
            value && items.push(<div key={i}>{value}</div>)
        }

        return items;
    }

    return (
        <div className='list' ref={ref}>
            {
                renderList(props.value)
            }
        </div>
    )
}))

export default UseDeferredValue;