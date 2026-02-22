import React from 'react';
import cs from 'classnames';
import './Icon.scss';

type BaseIconProps = {
    className?: string;
    style?: React.CSSProperties;
    size?: string | string[];
    spin?: boolean;
    ref?: React.Ref<SVGSVGElement>
}

export type IconProps = BaseIconProps & Omit<React.SVGAttributes<SVGElement>, keyof BaseIconProps>;

const getSize = (size: IconProps['size']) => {
    if (Array.isArray(size) && size.length === 2) {
        return size as string[];
    }

    const width = (size as string) || '1rem';
    const height = (size as string) || '1rem';

    return [width, height];
}

const Icon = (props: IconProps) => {
    const {
        className,
        style,
        size,
        spin,
        ref,
        ...rest
    } = props;

    const [width, height] = getSize(size);

    const cn = cs(
        'icon',
        {
            'icon-spin': spin
        },
        className
    )

    return <svg className={cn} ref={ref} style={style} {...rest} width={width} height={height}>
            </svg>
}

export default Icon;