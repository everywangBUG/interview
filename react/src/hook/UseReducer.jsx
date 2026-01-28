import React, { useState } from 'react';
import { useReducer } from 'react';
import { produce } from 'immer';

const reducer = (state, action) => {
    switch(action.type) {
        case 'add':
            return {
                ...state,
                a: {
                    ...state.a,
                    b: {
                        ...state.b,
                        c: 10,
                        d: state.a.b.d + action.num,
                    }
                }
            }
        case 'minus':
            return {
                ...state,
                a: {
                    ...state.a,
                    b: {
                        ...state.b,
                        c: 10,
                        d: state.a.b.d - action.num,
                    }
                }
            }
    }
    return state;
}

const produceReducer = (state, action) => {
    switch(action.type) {
        case 'add':
            return produce(state, (draftState) => {
                draftState.a.b.d = state.a.b.d + action.num;
            })
        case 'minus':
            return produce(state, (draftState) => {
                draftState.a.b.d = state.a.b.d - action.num;
            })
    }
}

const UseReducer = () => {
    const [res, dispatch] = useReducer(reducer, 'zero', () => {
        return {
            a: {
                b: {
                    c: 0,
                    d: 10
                },
                e: 0,
            },
            f: 0
        }
    })

    const [produceRes, produceDispatch] = useReducer(produceReducer, 'zero', () => {
        return {
            a: {
                b: {
                    c: 0,
                    d: 10
                },
                e: 0,
            },
            f: 0
        }
    })

    const [data, setData] = useState({
        a: {
            b: {
                c: 10,
                d: 20
            }
        }
    })

    return <div>
        <button type='text' onClick={() => dispatch({type: 'add', num: 100})}>加</button>
        <button type='text' onClick={() => dispatch({type: 'minus', num: 10})}>减</button>
        <div>{JSON.stringify(res)}</div>
        <div>{res.a.b.d}</div>

        <button type='text' onClick={() => produceDispatch({type: 'add', num: 100})}>加</button>
        <button type='text' onClick={() => produceDispatch({type: 'minus', num: 10})}>减</button>
        <div>{JSON.stringify(produceRes)}</div>
        <div>{produceRes.a.b.d}</div>

        <button onClick={() => setData((preState) => {
            return produce(preState, (draftState) => {
                draftState.a.b.c += 1;
            })
        })}>使用immer库的produceAPI深度对象加1</button>
        <div>{data.a.b.c}</div>
    </div>
}

export default UseReducer;