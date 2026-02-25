import { useEffect, useRef, useState } from 'react';
import { WatermarkProps } from "./Watermark";
import { merge } from 'lodash-es';

// watermark类型去掉className, style，children
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
    // options的宽度和有图片宽度使用defaultOptions的宽度
    width: toNumber(options.width!, (options.image ? defaultOptions.width : undefined)!),
    // options的height和undefined isNumber
    height: toNumber(options.height!, undefined!),
    getContainer: options.getContainer,
    // 和默认的gap isNumber
    gap: [
      toNumber(options.gap?.[0]!, defaultOptions.gap[0]), 
      toNumber(options.gap?.[1]!, defaultOptions.gap[1])
    ]
  } as Required<WatermarkOptions>

  // 和默认的offset isNumber
  const mergedOffsetX = mergedOptions.offset?.[0] || 0;
  const mergedOffsetY = mergedOptions.offset?.[1] || mergedOptions.offset?.[0];
  mergedOptions.offset = [mergedOffsetX, mergedOffsetY];

  return mergedOptions;
}

export function isNumber (value: any): value is number {
  return Object.prototype.toString.call(value) === '[object Number]' && value === value;
}

// toNumber函数，把第一个参数转换为number，如果不是数字的话返回第二个参数默认的值
export function toNumber (value: string | number, defaultValue: number) {
  if (!value) {
    return defaultValue;
  }

  if (isNumber(value)) {
    return value;
  }

  const numberVal = parseFloat(value);

  return isNumber(numberVal) ? numberVal : defaultValue;
}

// gerCanvasData 获取canvas的数据 返回width height base64Url
async function getCanvasData (options: Required<WatermarkOptions>)
  : Promise<{width: number; height: number; base64Url: string}> {
    const { rotate, image, content, fontStyle, gap } = options;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const ratio = window.devicePixelRatio;

    // 根据ctx的宽高设置偏移的角度
    const configCanvas = (size: { width: number, height: number}) => {
      // 获取canvas的宽度
      const canvasWidth = gap[0] + size.width;
      const canvasHeight = gap[1] + size.height;

      // 根据设备ratio设置canvas的宽度和高度
      canvas.setAttribute('width', `${canvasWidth * ratio}px`);
      canvas.setAttribute('height', `${canvasHeight * ratio}px`);
      canvas.style.width = `${canvasWidth}px`;
      canvas.style.height = `${canvasHeight}px`;

      // translate移动到中心点宽高的一半的位置再schale、rotate
      ctx.translate((canvasWidth * ratio) / 2, (canvasHeight * ratio) / 2); 
      // 设置scale设备的devicePixeRatio倍，后面绘制尺寸的时候不需要乘以设备像素比
      ctx.scale(ratio, ratio);

      // 设置偏移角度
      const rotateAngle = (rotate * Math.PI) / 180;
      ctx?.rotate(rotateAngle);
    }

    function mesureTextSize (
      ctx: CanvasRenderingContext2D,
      content: string[],
      rotate: number) {
        let width = 0; // 多行文本未旋转时的最大宽度
        let height = 0; // 多行文本未旋转时的最大高度
        const lineSize: Array<{width: number, height: number}> = []; // 每行文本的尺寸信息

        // 遍历每一行文本进行测量
        content.forEach((item) => {
          // 使用canvas API测量当前文本的尺寸
          const {
            width: textWidth, // 当前文本的高度
            fontBoundingBoxAscent, // 字体从基线到顶部的距离(上升高度)
            fontBoundingBoxDescent // 字体从基线到底部的距离(下降高度)
          } = ctx.measureText(item);

          // 计算当前文本的总高度
          const textHeight = fontBoundingBoxAscent + fontBoundingBoxDescent;

          // 更新多行文本的最大宽度（取所有行中最宽的）
          if (textWidth > width) {
            width = textWidth
          }

          // 累加多行文本的总高度
          height += textHeight;

          // 保存当前文本的尺寸信息
          lineSize.push({height: textHeight, width: textWidth});

        })
        // 将旋转的角度转换为弧度
        const angle = (rotate * Math.PI) / 180;

        return {
          // 未旋转时的原始宽度
          originWidth: width,
          // 未旋转时的原始高度
          originHeight: height,
          
          // 计算旋转后的实际宽度
          // Math.sin(angle) * height: 高度在水平方向上面的投影
          // Math.cos(angle) * width: 宽度在垂直方向上面的投影
          // 取绝对值相加：确保高度为正数
          // math.ceil向上取整
          width: Math.ceil(Math.abs(Math.sin(angle) * height) + Math.abs(Math.cos(angle) * width)),
          height: Math.ceil(Math.abs(Math.sin(angle) * width) + Math.abs(Math.cos(angle) * height)),
          lineSize // 每行文本的详细尺寸信息
        }
    }

    const drawText = () => {
      const { fontFamily, fontSize, fontWeight, color } = fontStyle;
      const realFontSize = toNumber(fontSize!, 0) || fontStyle.fontSize;

      ctx.font = `${fontWeight} ${realFontSize}px ${fontFamily}`;
      // 测量字体
      const mersureFontSize = mesureTextSize(ctx, [...content], rotate);

      // 获取canvas的宽高，没有传计算宽高并设置
      const width = options.width || mersureFontSize.width;
      const height = options.width || mersureFontSize.height;

      configCanvas({ width, height })

      // 设置填充的线条颜色
      ctx.fillStyle = color;
      ctx.font = `${fontWeight} ${realFontSize}px ${fontFamily}`;
      ctx.textBaseline = 'top';
      
      [...content].forEach((item, index) => {
        const { height: lineHeight, width: lineWidth } = mersureFontSize.lineSize[index];

        // 行高一半的起始位置
        const xStartPoint = -lineWidth / 2;
        const yStartPoint = -(options.height || mersureFontSize.originHeight) / 2 + lineHeight * index;

        ctx.fillText(
          item,
          xStartPoint,
          yStartPoint,
          options.width || mersureFontSize.originWidth
        )
      })

      return Promise.resolve({base64Url: canvas.toDataURL(), height, width})
    }

    const drawImage = () => {
      // 返回一个new Promise
      return new Promise<{width: number, height: number, base64Url: string}>((resolve) => {
        // 构造新的Image函数
        const img = new Image();
        // 设置跨域属性crossOrign = 'anonymons';
        img.crossOrigin = 'anonymons';
        // 设置图片不发送Referrer请求头，第三方网站不知道图片来源，保护敏感信息
        img.referrerPolicy = 'no-referrer';
        // 设置图片的src
        img.src = image;

        // img的onLoad事件
        img.onload = () => {
          let { width, height } = options;
          if (!width || !height) {
            // 没有设置宽高的时候，根据图片的宽或者高的比例计算出另一个值
            if (width) {
              height = (img.height / img.width) * +width;
            } else {
              width = (img.width / img.height) * +height;
            }
          }
          configCanvas({width, height});

          // ctx画出图片
          ctx!.drawImage(img, -width / 2, -height / 2, width, height);

          // base64Url：toDataURL()将整个图像编码为内存中的字符串，如果有性能影响可以使用toBlob()结合URL.createObjectURL()使用
          return resolve({ base64Url: canvas.toDataURL(), width, height })
        }
        
        img.onerror = () => {
          return drawText();
        }
      })
    }

    return image ? drawImage() : drawText();
}

export function useWatermark (params: WatermarkOptions) {
  // 定义options状态
  const [options, setOptions] = useState(params || {});

  // 绘制的options
  const mergedOptions = getMergedOptions(options);

  // ref保存watermarkDiv
  const watermarkDiv = useRef<HTMLDivElement>();

  // 获取合并后的容器
  const container = mergedOptions.getContainer();

  // 画出水印标签
  function drawWatermark () {
    if (!watermarkDiv.current) {
      return;
    }

    const { gap, zIndex } = mergedOptions;

    getCanvasData(mergedOptions).then((width, height, base64Url) => {
      const wmStyle = `
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        pointer-events: none;
        z-index: ${zIndex};
        background-position: 0 0;
        background-size: ${gap[0] + width}px ${gap[1] + height}px;
        background-repeat: repeat;
        background-image: url(${base64Url});
      `

      if (!watermarkDiv.current) {
        const div = document.createElement('div');
        watermarkDiv.current = div;
        container.append(div);
        container.style.position = 'relative';
      }

      watermarkDiv.current?.setAttribute('style', wmStyle.trim());
    })
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