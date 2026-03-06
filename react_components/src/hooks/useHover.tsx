import { cloneElement, ReactElement, useState } from "react"

// 传入ReactElement也可以是ReactElement函数
type Element =
    | ((hover: boolean) => ReactElement<HoverableProps>)
    | ReactElement<HoverableProps>;

interface HoverableProps {
    onMouseEnter?: (event: MouseEvent) => void;
    onMouseLeave?: (event: MouseEvent) => void;
    [key: string]: any
}

const useHover = (element: Element): [ReactElement<HoverableProps>, boolean] => {
    // 定义hover的状态
    const [hover, setHover] = useState(false);

    // mouseenter事件
    const onMouseEnter = (originalMouseEnter?: (event: MouseEvent) => void) => (event: MouseEvent) => {
        originalMouseEnter?.(event);
        setHover(true);
    }

    // mouseleave事件
    const onMouseLeave = (originMouseLeave?: (event: MouseEvent) => void)  => (event: MouseEvent) => {
        originMouseLeave?.(event);
        setHover(false);
    }

    let targetElement: ReactElement<HoverableProps>;
    // 判断传入的是元素还是函数
    if (typeof element === 'function') {
        targetElement = element(hover);
    } else {
        targetElement = element;
    }

    // 使用cloneElement克隆元素
    const el = cloneElement(targetElement, {
        onMouseEnter: onMouseEnter(targetElement.props.onMouseEnter),
        onMouseLeave: onMouseLeave(targetElement.props.onMouseLeave)
    });

    // 返回元素和hover的状态
    return [el, hover];
}

export default useHover;
