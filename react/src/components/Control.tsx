import React, { useState } from 'react';


interface CalendarProps {
    value?: Date,
    onChange: (date: Date) => void
}

const Calendar1 = (props: CalendarProps) => {
    // 传入value，通过点击时间回调onChange设置父组件的value值，受控组件
    const { value = new Date(), onChange } = props;
  
    const changeValue = (date: Date) => {
      onChange?.(date);
    }
    
    return (
      <>
        <div>{value.toLocaleDateString()}</div>
        <div onClick={() => { changeValue(new Date('2026.1.1')) }}>2026.1.1</div>
        <div onClick={() => { changeValue(new Date('2026.1.2')) }}>2026.1.2</div>
        <div onClick={() => { changeValue(new Date('2026.1.3')) }}>2026.1.3</div>
      </>
    )
}

export default Calendar1;