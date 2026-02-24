import React, { CSSProperties, ReactNode, useRef } from 'react';

export interface WatermarkProps {
    style?: CSSProperties;
    className?: string;
    width?: number;
    height?: number;
    rotate?: number;
    zIndex?: number | string;
    image?: string;
    content?: string | string[];
    fontStyle?: {
        color?: string;
        fontFamily?: string;
        fontSize?: number | string;
        fontWeight?: number | string;
    };
    gap?: [number, number];
    offset?: [number, number];
    getContainer?: () => HTMLElement;
    children?: ReactNode
}

const Watermark: React.FC<WatermarkProps> = (props) => {
    const {
        content,
        style,
        className
    } = props;

    const containerRef = useRef<HTMLDivElement>(null);

    return props.children ?
        (<div
            style={style}
            className={className}
            ref={containerRef}
        >
            {props.children}
        </div>) : null
}

export default Watermark;