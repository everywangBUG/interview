import { useCallback, useEffect, useRef, useState } from "react";
import type { VirtualListProps } from "./VirtualList";

function useVirtual<T> ({
    data,
    height,
    itemHeight,
    overscan = 5
}: VirtualListProps<T>) {
    const containRef = useRef<HTMLDivElement>(null);
    const [scrollOffset, setScrollOffset] = useState(0);
    
    // 缓存每个元素的高度，动态渲染
    // 初始化固定高度或者预估高度
    const defaultHeight = typeof itemHeight === "function" ? 50 : itemHeight;
    const sizeCache = useRef<number[]>(new Array(data.length).fill(defaultHeight));

    // 初始化或重置缓存
    useEffect(() => {
        // 固定高度，直接填充
        if (typeof itemHeight === "number") {
            sizeCache.current = new Array(data.length).fill(itemHeight);
        } else {
            // 动态高度，如果长度变化，保留旧数据或者填充默认值
            if (sizeCache.current.length !== data.length) {
                const newSizeCache = [...sizeCache.current];
                
                // 截取或扩展数组到 data.length
                newSizeCache.length = data.length;

                // 填充默认值
                for (let i = 0; i < data.length; i++) {
                    if (newSizeCache[i] === undefined) {
                        newSizeCache[i] = 50; // 默认的预估高度
                    }
                }
                sizeCache.current = newSizeCache;
            }
        }
    }, [data.length, itemHeight]);  

    // 计算总的高度
    const totalSize = sizeCache.current.reduce((acc, cur) => acc + cur, 0);

    // 计算可视范围
    const getRange = useCallback(() => {
        let start = 0;
        let end = data.length - 1;
        let currentTop = 0;

        // 1. 找到开始索引（找到第一个底部超过滚动位置的元素）
        for (let i = 0; i < data.length; i++) {
            const h = sizeCache.current[i];
            if (currentTop + h >= scrollOffset) {
                start = i;
                break;
            }
            currentTop += h;
        }

        // 2. 找到结束索引（第一个顶部超过滚动位置+容器高度的元素）
        let currentBottom = currentTop;
        for (let i = start; i < data.length; i++) {
            const h = sizeCache.current[i];
            if (currentBottom > scrollOffset + height) {
                end = i - 1;
                break;
            }
            currentBottom += h;
        }

        // 应用 Overscan (缓冲区)
        const finalStart = Math.max(0, start - overscan);
        const finalEnd = Math.min(data.length - 1, end + overscan);

        // 计算每个元素的绝对位置 (Top Offset)
        let offsetTop = 0;
        for(let i = 0; i < finalStart; i++) {
            offsetTop += sizeCache.current[i];
        }

        const items = [];
        for (let i = finalStart; i <= finalEnd; i++) {
            items.push({
                index: i,
                offsetTop,
                height: sizeCache.current[i],
                data: data[i]
            });
            offsetTop += sizeCache.current[i];
        }

        return items;
    }, [data, scrollOffset, height, overscan])

    const items = getRange();

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        setScrollOffset(e.currentTarget.scrollTop);
    }

    // 滚动到指定的为止
    const scrollTo = (offset: number) => {
        if (containRef.current) {
            containRef.current.scrollTop = offset;
            setScrollOffset(offset);
        }
    }

    // 动态更新方法（当内容渲染后，实际的可见高度）
    const updateItemSize = (index: number, newSize: number) => {
        if (sizeCache.current[index] !== newSize) {
            sizeCache.current[index] = newSize;
            setScrollOffset(prev => prev);
        }
    }

    return {
        items,
        totalSize,
        containRef,
        handleScroll,
        scrollTo,
        updateItemSize
    }
}

export default useVirtual;