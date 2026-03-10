import React, { CSSProperties, ReactNode, useCallback, useEffect, useRef } from 'react';
import { useWatermark } from './useWatermark';

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
        className,
        zIndex,
        width,
        height,
        rotate,
        image,
        fontStyle,
        gap,
        offset,
    } = props;

    const containerRef = useRef<HTMLDivElement>(null);

    const getContainer = useCallback(() => {
        return props.getContainer ? props.getContainer() : containerRef.current!;
    }, [containerRef.current, props.getContainer()]);

    const { generateWatermark } = useWatermark({
        zIndex,
        width,
        height,
        rotate,
        image,
        content,
        fontStyle,
        gap,
        offset,
        getContainer
    })


    useEffect(() => {
       generateWatermark({
        zIndex,
        width,
        height,
        rotate,
        image,
        content,
        fontStyle,
        gap,
        offset,
        getContainer
       });
    }, [
        zIndex,
        width,
        height,
        rotate,
        image,
        content,
        JSON.stringify(props.fontStyle),
        JSON.stringify(props.gap),
        JSON.stringify(props.offset),
        getContainer
    ])

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