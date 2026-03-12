import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import "./Card.scss";

export const Box = () => {
    const ref = useRef(null);

    const [, drag] = useDrag(() => ({
        type: 'box',
        item: {
            coloe: 'red'
        }
    }));

    drag(ref);

    return <div ref={ref} className="box"></div>
}

export const Container = () => {
    const ref = useRef(null);

    const [, drop] = useDrop(() => ({
        accept: 'box',
        drop(item) {
            console.log(item);
        }
    }))

    drop(ref);

    return <div className="container"></div>
}
