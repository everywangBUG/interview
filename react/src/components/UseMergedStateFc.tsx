import React from 'react';
import UseMergedState from '../hook/UseMergedState';

interface UseMergedStateFcProps {
    value?: Date,
    defaultValue?: Date,
    onChange?: (date: Date) => void
}

const UseMergedStateFc = (props: UseMergedStateFcProps) => {
    const {
        value: propsValue,
        defaultValue,
        onChange
    } = props;

    const [mergeValue, setValue] = UseMergedState(
        new Date(),
        {
            defaultValue,
            value: propsValue
        },
        onChange
    );

    return (
        <>
            <div>{mergeValue.toLocaleDateString()}</div>
            <div onClick={() => { setValue((preDate) => {
                const newDate = new Date(preDate);
                newDate.setFullYear(2027, 0, 1);
                return newDate
            }) }}>点击加一年：2026.1.1</div>
            <div onClick={() => { setValue(new Date('2026.1.2')) }}>2026.1.2</div>
            <div onClick={() => { setValue(new Date('2026.1.3')) }}>2026.1.3</div>
        </>
    )
}

export default UseMergedStateFc;