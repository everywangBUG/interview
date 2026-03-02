import { CSSProperties, FC, ReactNode, useEffect, useRef, useState } from "react";

interface LazyLoadProps {
    className?: string;
    style?: CSSProperties;
    offset?: number | string;
    placeholder?: ReactNode;
    width?: number | string;
    height?: number | string;
    onContentVisible?: () => void;
    children: ReactNode;
}

const LazyLoad: FC<LazyLoadProps> = (props) => {
    const [visible, setVisible] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const elementObserver = useRef<IntersectionObserver>(null);
    
    const {
        className,
        style,
        // 距离可视区域多远触发加载
        offset,
        // 占位内容
        placeholder,
        width,
        height,
        // 进入可视区域的回调
        onContentVisible,
        children
    } = props;

    const lazyLoadHandler = (entires: IntersectionObserverEntry) => {
        console.log(entires, 'entires');

    }

    useEffect(() => {
        const options = {
            rootMargin: (typeof offset === 'number' ? `${offset}px` : `${Number(offset)}px`) || '0px',
            threshould: 0 
        }

        elementObserver.current = new IntersectionObserver(lazyLoadHandler, options);

        const node = containerRef.current;
        
        if (node instanceof HTMLElement) {
            elementObserver.current?.observe(node);
        }

        return () => {
            if (node instanceof HTMLElement) {
                elementObserver.current?.disconnect();
            }
        }
    }, []);

    return <div ref={containerRef} className={className} style={style}>
        {visible ? children : placeholder}
    </div>
}

export default LazyLoad;