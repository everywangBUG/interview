import React, { useState, useEffect, useRef, Dispatch, SetStateAction, useCallback } from 'react';

/**
 * @template T 状态值的类型
 * @param props 可选配的对象
 * @param defaultStateValue 当没有defaultValue和value默认的值
 * @param props.defaultValue 非受控模式下的默认值
 * @param props.value 受控模式下的默认值
 * @returns 返回一个元组：[当前值， 设置值的函数]
 */

function UseMergedState<T> (
    defaultStateValue: T,
    props?: {
        defaultValue?: T,
        value?: T
    },
    onChange?: (value: T) => void
): [T, Dispatch<SetStateAction<T>>] {
    const { defaultValue, value: propsValue } = props || {};

    const isFirstRender = useRef(true);

    const [stateValue, setStateValue] = useState<T>(() => {
        // 如果propsValue有值，受控模式，直接返回
        if (propsValue !== undefined) {
            return propsValue;
        } else if (defaultValue !== undefined) {
            // 非受控模式返回defaultValue
            return defaultValue;
        } else {
            // porps为空，返回defaultStateValue
            return defaultStateValue;
        }
    })

    const isFunction = (value: unknown): value is Function => typeof value === 'function'; 

    const setState = useCallback((value: SetStateAction<T>) => {
        let res = isFunction(value) ? value(stateValue) : value;

        // 非受控模式，更新内部状态
        if (propsValue === undefined) {
            setStateValue(res);
        }
        
        onChange?.(res);
    }, [stateValue])

    useEffect(() => {
        if (!isFirstRender.current && propsValue === undefined) {
            // 非空断言设置为setStateValue为undefined
            setStateValue(propsValue!);
        }
        isFirstRender.current = false;
    }, [propsValue])

    const mergeValue = propsValue === undefined ? stateValue : propsValue
    
    return [mergeValue, setState];
}

export default UseMergedState;