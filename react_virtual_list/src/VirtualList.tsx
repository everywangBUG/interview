import { type CSSProperties, type ReactNode, useEffect, useRef } from "react";
import useVirtual from "./useVirtual";

export interface VirtualListProps<T> {
    // 数据源
    data: T[];
    // 容器高度
    height: number;
    // 条目高度
    itemHeight: number | ((item: T, index: number) => number);
    // 自定义渲染函数
    renderItem: (item: T, index: number, style: CSSProperties) => ReactNode;
    // key的唯一值（默认index)
    getKey?: (item: T, index: number) => string | number;
    // 滚动回调
    onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
    // 类名
    className?: string;
    // 缓冲区大小（上下各渲染多少条），防止快速滚动时白屏
    overscan?: number;
}

function VirtualList<T> ({
    data,
    height,
    itemHeight,
    renderItem,
    getKey,
    onScroll,
    className,
    overscan = 5
}: VirtualListProps<T>) {

    // 用于动态高度测量的 Ref 映射
    const itemRefs = useRef<Map<number, HTMLDivElement>>(new Map());

    const {
        items,
        totalSize,
        containRef,
        handleScroll,
        updateItemSize
    } = useVirtual({ data, height, itemHeight, overscan });

    const onScrollWrapper = (e: React.UIEvent<HTMLDivElement>) => {
        handleScroll(e);
        onScroll?.(e);
    }

    useEffect(() => {
        if (typeof itemHeight === "function") {
            items.forEach((it) => {
                const el = itemRefs.current.get(it.index);
                if (el) {
                    const actualHeight = el.offsetHeight;
                    if (actualHeight !== it.height) {
                        updateItemSize(it.index, actualHeight);
                    }
                }
            })
        }
    }, [items, itemHeight, updateItemSize])

    return (
        <div
            ref={containRef}
            className={className}
            style={{
                height,
                overflowY: "auto",
                position: "relative",
                contain: "strict", // 性能优化，告诉浏览器内部不影响外部的布局
                willChange: "scroll-position"
            }}
            onScroll={onScrollWrapper}
        >
            {/* 占位器，撑开滚动条 */}
            <div style={{ height: totalSize, width: "100%" }}>
                {/* 实际渲染高度 */}
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        // 将整个列表上移，抵消前面不可见部分的高度
                        transform: `translateY(${items.length > 0 ? items[0].offsetTop : 0}px)`
                    }}
                >
                    {
                        items.map((item) => {
                            const key = getKey ? getKey(item.data, item.index) : item.index;

                            // 包装一层用于测量高度 (如果是动态高度)
                            return (
                                <div
                                    key={key}
                                    ref={(el) => {
                                        if (el) itemRefs.current.set(item.index, el);
                                        else itemRefs.current.delete(item.index);
                                    }}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        // 不设置固定高度，让内容撑开以便测量实际高度
                                        minHeight: typeof itemHeight === 'number' ? itemHeight : undefined,
                                        // 使用父容器 translate 后，相对位置通过 translateY 计算
                                        transform: `translateY(${item.offsetTop - (items[0]?.offsetTop || 0)}px)`
                                    }}
                                >
                                    {renderItem(item.data, item.index, {
                                        width: '100%',
                                        // 不设置固定高度，让内容撑开
                                    })}
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default VirtualList;
