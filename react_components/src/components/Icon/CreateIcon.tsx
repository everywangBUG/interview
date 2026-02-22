import React from 'react';
import Icon, { IconProps } from './Icon';

interface CreateIconOptions {
    content: React.ReactNode;
    iconProps?: IconProps;
    viewBox?: string;
}

export const createIcon = (options: CreateIconOptions) => {
    const { content, iconProps = {} , viewBox = '0 0 1024 1024' } = options;

    return (props: IconProps) => {
        return <Icon ref={props.ref} viewBox={viewBox} {...iconProps} {...props}>
            {content}
        </Icon>
    }
}