import React, { useTransition, useState } from 'react';

const UseTransition = () => {
    const [value, setValue] = useState('');
    const [isPending, startTransition] = useTransition();
    const [list, setList] = useState([]);

    const renderItem = (value) => {
        const items = [];
        for (let i = 0; i <= 50000; i++) {
            value && items.push(<div key={i}>{value}</div>)
        }
        setList(items);
    }

    const handleInputChange = (e) => {
        // 传入useTransition函数中，标记为非进紧急更新
        setValue(e.target.value);
        startTransition(() => {
            renderItem(e.target.value);
        });
    }

    console.log(isPending, 'isPending');

    return <div>
        <input type='text' value={value} onChange={handleInputChange} />
        {
            isPending
                ? <div>正在加载......</div>
                : list.map((it, index) => <div key={index}>{it}</div>)
        }
    </div>
}

export default UseTransition;   