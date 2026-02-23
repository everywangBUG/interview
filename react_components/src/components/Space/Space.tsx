import React, { useMemo } from 'react';
import cs from 'classnames';
import './Space.scss';

export interface SpaceProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    style?: React.CSSProperties;
    size?: SizeType | [SizeType, SizeType];
    direction?: 'horizontal' | 'vertical';
    align?: 'start' | 'end' | 'center' | 'baseline';
    split?: React.ReactNode;
    wrap?: boolean;
}

export type SizeType = 'small' | 'middle' | 'large' | number | undefined;

const spaceSize = {
    small: 8,
    middle: 16,
    large: 24
}

const getNumberSize = (size: SizeType) => {
    return typeof size === 'string' ? spaceSize[size] : size || 0
}

const Space: React.FC<SpaceProps> = props => {
    const {
        className,
        style,
        direction = 'horizontal',
        align,
        size,
        split,
        wrap = 'true',
        children,
        ...otherProps
    } = props;

    const childrenNodes = React.Children.toArray(children)

    const nodes = childrenNodes.map((child: any, i) => {
        const key = child && child.key || `space-item-${i}`;

        return <div key={key} className='space-item'>
            {child}
        </div>
    })

    const [horizontalSize, verticalSize] = useMemo(() =>
        (Array.isArray(size) ? size : ([size, size] as [SizeType, SizeType]).map(item => getNumberSize(item))),
        [size]
    );

    const otherStyle: React.CSSProperties = {};

    otherStyle.rowGap = horizontalSize;
    otherStyle.columnGap = verticalSize;

    if (wrap) {
        otherStyle.flexWrap = 'wrap';
    }
    
    const mergeAlign = direction === 'horizontal' && align === undefined ? 'center' : align;
    const cn = cs(
        'space',
        `space-${direction}`,
        {
            [`space-align-${mergeAlign}`]: mergeAlign,
        },
        className
    )

    return <div className={cn} style={{ ...style, ...otherStyle}} {...otherProps}>
        {nodes}
    </div>
}

export default Space;