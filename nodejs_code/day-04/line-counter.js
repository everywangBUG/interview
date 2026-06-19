// 大文件行数统计器
import fs from "node:fs";
import process from "node:process";
import { pipeline } from "node:stream/promises";
import { Transform } from "node:stream";

console.log(process.argv[2]);
const filePath = process.argv[2];

if (!filePath) {
  console.error("用法：node line-counter.js <文件路径名>");
  process.exit(1);
}

// 定义行数变量
let lineCount = 0;
// 定义字节数变量
let byteCount = 0;
// 定义每一行的剩余部分
let remainder = 0;

const counter = new Transform({
  transform(chunk, _encoding, callback) {
    console.log(chunk, "chunk");
    console.log(_encoding, "_encoding");
    // 字节数加上每一块的chunk.length
    byteCount += chunk.length;

    // 将上一次剩余部分的与当前块拼接，避免在块边界处被截断
    // 定义text remainder 加 chunk.toString("utf-8 ")将二进制的数据转换成UTF-8编码的字符串方法
    const text = remainder + chunk.toString("utf-8");
    // 通过分割\h换行符定义行数
    const lines = text.split("\n");

    // 如果最后一个元素不是完整的行，留到下一次处理
    // 把最后一个元素pop出来
    remainder = lines.pop();
    // 行+lines行数
    lineCount += lines.length;

    // 调用回调行数
    callback();
  },
  flush(callback) {
    // 如果文末还有内容(无换行符号结尾)，也算一行 remainder.length > 0
    if (remainder.length > 0) {
      lineCount++;
    }
    callback();
  },
});

// 定义开始时间
const start = Date.now();

try {
  // 管线pipeline fs读取流
  await pipeline(
    fs.createReadStream(filePath, { highWaterMark: 64 * 1024 }),
    // 传入counter
    counter,
    //  不需要写入的丢弃输出
    new Transform({
      transform(_c, _e, _cb) {
        cb();
      },
    }),
    // 计算所花的时间
    // 计算文件大小
  );
  const expend = ((Date.now() - start) / 1000).toFixed(2);
  const size = (byteCount / 1024 / 1024).toFixed(2);

  console.log(`文件 —— ${filePath}`);
  console.log(`文件大小 —— ${size}`);
  console.log(`文件行数 —— ${lineCount}`);
  console.log(`耗时 —— ${expend}`);
} catch (err) {
  if (err.code === "ENOENT") {
    console.log(`错误：文件不存在 —— ${filePath}`);
  } else {
    console.log(`错误：${err.message}`);
  }
  process.exit(1);
}
