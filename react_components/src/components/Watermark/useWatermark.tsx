import { useEffect, useState } from 'react';
import { WatermarkProps } from "./Watermark";
import { merge } from 'lodash-es';

// watermark去掉className, style，children
export type WatermarkOptions = Omit<WatermarkProps, 'className' | 'style' | 'children'>;

const defaultOptions = {
  rotate: -20,
  zIndex: 1,
  width: 100,
  gap: [100, 100],
  fontStyle: {
    fontSize: '16x',
    color: 'rgba(0, 0, 0, 0.15)',
    fontFamily: 'sans-serif',
    fontWeight: 'normal'
  },
  getContainer: () => document.body
}

const getMergedOptions = (o: Partial<WatermarkOptions>) => {
  const options = o || {};

  const mergedOptions = {
    ...options,
    rotate: options.rotate || defaultOptions.rotate,
    zIndex: options.zIndex || defaultOptions.zIndex,
    fontStyle: { ...defaultOptions.fontStyle, ...options.fontStyle },
    width: options.width || defaultOptions.width,
    height: options.height,
    getContainer: options.getContainer,
    gap: [
      options.gap?.[0] || defaultOptions.gap[0], 
      options.gap?.[1] || defaultOptions.gap[1]
    ]
  } as Required<WatermarkOptions>

  const mergedOffsetX = mergedOptions.offset?.[0] || 0;
  const mergedOffsetY = mergedOptions.offset?.[1] || mergedOptions.offset?.[0];
  mergedOptions.offset = [mergedOffsetX, mergedOffsetY];

  return mergedOptions;
}

export default function useWatermark (params: WatermarkOptions) {
  // 定义options状态
  const [options, setOptions] = useState(params || {});

  // 绘制的options
  const mergedOptions = getMergedOptions(options);

  // 画出水印标签
  function drawWatermark () {

  }

  // 根据options的变化触发重绘
  useEffect(() => {
    drawWatermark();
  }, [options])

  return {
    generateWatermark: (newOptions: Partial<WatermarkOptions>) => {
      // ??为什么要合并
      setOptions(merge({}, options, newOptions));
    },
    destroy: () => {}
  }
}