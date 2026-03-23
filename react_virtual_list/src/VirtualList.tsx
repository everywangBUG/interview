import { type CSSProperties, type ReactNode, useRef } from "react";
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

    console.log(items, 'items');

    const onScrollWrapper = (e: React.UIEvent<HTMLDivElement>) => {
        handleScroll(e);
        onScroll?.(e);
    }

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
                        transform: `translateY(${items?.length > 0 ? items[0].offsetTop : 0}px)`
                    }}
                >
                    {
                        items.map((item) => {
                            const key = getKey ? getKey(item.data, item.index) : item.index

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
                                    top: 0, // 因为父容器已经 translateY 了，这里相对位置就是 0
                                    left: 0,
                                    width: '100%',
                                    height: item.height,
                                    // 如果不用父容器 translate，这里应该是 top: item.offsetTop
                                    // 使用父容器 translate 可以减少每个子元素的 style 计算量
                                    transform: `translateY(${item.offsetTop - (items[0]?.offsetTop || 0)}px)`
                                }}
                                >
                                {renderItem(item.data, item.index, {
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: item.height,
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
