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

    const lazyLoadHandler = (entires: IntersectionObserverEntry[]) => {
        const [entry] = entires;
        const { isIntersecting } = entry;
        if (isIntersecting) {
            setVisible(true);

            onContentVisible?.();

            const node = containerRef.current;
            if (node && node instanceof HTMLElement) {
                // 停止对元素的观察
                elementObserver.current?.unobserve(node);
            }
        }
    }

    useEffect(() => {
        const options = {
            rootMargin: typeof offset === 'number' ? `${offset}px` : offset || '0px',
            threshold: 0 
        }

        elementObserver.current = new IntersectionObserver(lazyLoadHandler, options);

        const node = containerRef.current;
        
        if (node instanceof HTMLElement) {
            elementObserver.current?.observe(node);
        }

        return () => {
            if (node instanceof HTMLElement) {
                // 终止对元素可见性的观察
                elementObserver.current?.disconnect();
            }
        }
    }, []);

    return <div ref={containerRef} className={className} style={{width, height, ...style}}>
        {visible ? children : placeholder}
    </div>
}

export default LazyLoad;