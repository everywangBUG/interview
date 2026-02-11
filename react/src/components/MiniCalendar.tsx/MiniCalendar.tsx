import React, { ReactElement, useState } from 'react';
import './MiniCalendar.css';

const MiniCalendar = () => {
    const [date, setDate] = useState(new Date());

    const handlePreDate = () => {
        setDate(new Date(date.getFullYear(), date.getMonth() - 1, date.getDate()));
    }

    const handlePostDate = () => {
        setDate(new Date(date.getFullYear(), date.getMonth() + 1, date.getDate()));
    }

    const renderDays = () => {
        const days = [] as ReactElement[];
        
        // 获取本月有几天
        const daysOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

        // 获取一号对应的星期几
        const firstDayOfWeek = new Date(date.getFullYear(), date.getMonth(), 1).getDay();

        // 渲染空格
        Array.from({length: firstDayOfWeek}, (_, index) => {
            days.push(<div key={`empty-index`} className='empty'></div>)
        })

        // 渲染当月天数
        Array.from({length: daysOfMonth}, (_, index) => {
            days.push(<div key={index} className='day'>{index  + 1}</div>)
        })

        return days;
    }

    return <div className='calendar'>
        <div className='header'>
            <button onClick={() => handlePreDate()}>&lt;</button>
            <div>{date.getFullYear()}年{date.getMonth() + 1}月{date.getDate()}日</div>
            <button onClick={() => handlePostDate()}>&gt;</button>
        </div>
        <div className='days'>
            <div className='day'>日</div>
            <div className='day'>一</div>
            <div className='day'>二</div>
            <div className='day'>三</div>
            <div className='day'>四</div>
            <div className='day'>五</div>
            <div className='day'>六</div>
            <>
                {
                    renderDays()
                }
            </>
        </div>
    </div>
}

export default MiniCalendar;