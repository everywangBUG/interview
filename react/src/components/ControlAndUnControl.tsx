import React, { useEffect, useRef, useState } from "react";

interface CalendarProps {
    defaultValue?: Date,
    value?: Date,
    onChange?: (date: Date) => void
}

const ControlAndUnControl = (props: CalendarProps) => {
    const {
        defaultValue,
        value: propsValue,
        onChange
    } = props;

    const [value, setValue] = useState(() => {
        if (propsValue === undefined) {
            return defaultValue;
        } else {
            return propsValue;
        }
    })

    const isFirstRender = useRef(true);

    const changeValue = (date: Date) => {
        if (propsValue === undefined) {
            setValue(date);
        }
        onChange?.(date);
    }

    useEffect(() => {
        // 如果不是首次渲染且非受控模式下, setValue
        if (!isFirstRender.current && propsValue === undefined) {
            setValue(propsValue);
        }
        isFirstRender.current = false;
    }, [propsValue])

    const mergeValue = propsValue === undefined ? value : propsValue;

    return (
        <>
        <div>{mergeValue?.toLocaleDateString()}</div>
        <div onClick={() => { changeValue(new Date('2026.1.1')) }}>2026.1.1</div>
        <div onClick={() => { changeValue(new Date('2026.1.2')) }}>2026.1.2</div>
        <div onClick={() => { changeValue(new Date('2026.1.3')) }}>2026.1.3</div>
        </>
    )
}

export default ControlAndUnControl;