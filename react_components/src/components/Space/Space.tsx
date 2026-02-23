import React from 'react';
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

const Space: React.FC<SpaceProps> = props => {
    const {
        className,
        style,
        direction = 'horizontal',
        align,
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

    const mergeAlign = direction === 'horizontal' && align === undefined ? 'center' : align;
    const cn = cs(
        'space',
        `space-${direction}`,
        {
            [`space-align-${mergeAlign}`]: mergeAlign,
        },
        className
    )

    return <div className={cn} style={style} {...otherProps}>
        {nodes}
    </div>
}

export default Space;