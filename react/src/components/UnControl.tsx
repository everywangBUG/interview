import React, { useState } from 'react';


interface CalendarProps {
    defaultValue?: Date,
    onChange: (date: Date) => void
}

const Calendar = (props: CalendarProps) => {
    // 传入defaultValue值，只能由用户传入defaultValue值，不能直接传入value控制
    const { defaultValue = new Date(), onChange } = props;
  
    const [value, setValue] = useState<Date>(defaultValue);

    const changeValue = (date: Date) => {
      setValue(date);
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

export default Calendar;