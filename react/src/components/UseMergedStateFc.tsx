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

    const [mergeValue, setValue] = UseMergedState(new Date(), { defaultValue, value: propsValue });

    const changeValue = (date: Date) => {
        if (propsValue === undefined) {
            setValue(date);
        }
        onChange?.(date);
    }

    return (
        <>
            <div>{mergeValue?.toLocaleDateString()}</div>
            <div onClick={() => { changeValue(new Date('2026.1.1')) }}>2026.1.1</div>
            <div onClick={() => { changeValue(new Date('2026.1.2')) }}>2026.1.2</div>
            <div onClick={() => { changeValue(new Date('2026.1.3')) }}>2026.1.3</div>
        </>
    )
}

export default UseMergedStateFc;