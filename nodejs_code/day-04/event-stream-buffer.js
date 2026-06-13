// EventEmitter 事件驱动编程
import { EventEmitter } from "node:events";
import fs from "node:fs";
import { createGzip } from "node:zlib";
import { pipeline } from "node:stream/promises";
import { Transform } from "node:stream";

const emitter = new EventEmitter();

// 注册事件监听器
emitter.on("greet", (name) => {
  console.log(`Hello, ${name}`);
});

emitter.once("init", () => {
  console.log("初始化完成");
});

// 触发事件
emitter.emit("greet", "Node.js"); // Hello, Node.js
emitter.emit("init");
emitter.emit("init");

// 自定义事件类

class TaskRunner extends EventEmitter {
  constructor(tasks) {
    super();
    this.completed = 0;
    this.tasks = tasks;
  }

  async run() {
    this.emit("start", { total: this.tasks.length });

    for (const task of this.tasks) {
      try {
        // 注册开始任务监听事件
        this.emit("taskStart", { name: task.name });
        await task.execute();
        this.completed++;
        // 注册taskComplete事件
        this.emit.on("taskComplete", {
          name: task.name,
          progress: this.completed / this.tasks.length,
        });
      } catch (err) {
        // 注册任务错误事件
        this.emit("taskError", { name: task.name, err });
      }
    }

    // 注册任务完成事件
    this.emit("finish", {
      total: this.tasks.length,
      completed: this.completed,
    });
  }
}

const runner = new TaskRunner([
  { name: "下载数据", execute: () => new Promise((r) => setTimeout(r, 1000)) },
  { name: "处理数据", execute: () => new Promise((r) => setTimeout(r, 500)) },
  { name: "保存结果", execute: () => new Promise((r) => setTimeout(r, 300)) },
]);

runner.on("start", ({ total }) => console.log(`开始执行${total}个任务`));
runner.on("taskComplete", ({ name, progress }) => {
  console.log(`${name} - ${(progress * 100).toFixed(0)}%`);
});
runner.on("finish", ({ total, completed }) => {
  console.log(`完成${completed}/${total}个任务`);
});

await runner.run();

// 注册事件监听器
// emitter.on(event, fn);
// 注册一次性事件监听器
// emitter.once(event, fn);
// 移除事件监听器
// emitter.off(event, fn);
// 移除所有的事件监听器
// emitter.removeAllListeners();
// 获取监听器的数量
// emitter.listenerCount(event);
// 获取所有的事件名
// emitter.eventNames();

// Buffer-二进制数据处理
const buf1 = Buffer.alloc(10); // 10字节，填充0
const buf2 = Buffer.from("Hello"); // 从字符串创建
const buf3 = Buffer.from([0x48, 0x69]); // 从字节数组创建
const buf4 = Buffer.from("你好", "utf-8"); // 指定编码

// Buffer和字符串的互转
const buf = Buffer.from("Nodejs is awesome");
console.log(buf.toString("utf-8")); // Nodejs is awesome
console.log(buf.toString("base64")); // Tm9kZWpzIGlzIGF3ZXNvbWU=
console.log(buf.toString("hex")); // 4e6f64656a7320697320617765736f6d65

// Buffer的操作
console.log(buf.length); // 字节长度
console.log(buf.slice(0, 7).toString()); // Nodejs

// 每一个中文字符三个字节
const chinese = Buffer.from("你好李斯");
console.log(chinese.length); // 12

// Buffer拼接
const combined = Buffer.concat([
  Buffer.from("Hello"),
  Buffer.from(" "),
  Buffer.from("world!"),
]);
console.log(combined.toString()); // Hello world!

// Stream-流式处理
// ```markdown
//   | 类型 | 说明 | 示例 |
//   |------|------|------|
//   | Readable | 可读流 | `fs.createReadStream`、`http.IncomingMessage` |
//   | Writable | 可写流 | `fs.createWriteStream`、`http.ServerResponse` |
//   | Duplex | 双工流（可读可写） | `net.Socket`、`WebSocket` |
//   | Transform | 转换流 | `zlib.createGzip`、`crypto.createCipher` |
// ```

// 可读流
const readStream = fs.createReadStream("./large-file.log", {
  encoding: "utf-8",
  highWaterMark: 64 * 1024, // 每次读取64kb
});

readStream.on("data", (chunk) => {
  console.log(`收到${chunk.length}个字节`);
});

readStream.on("end", () => {
  console.log("文件读取完成");
});

readStream.on("error", (err) => {
  console.log("文件读取错误");
});

// 可写流
const writeStream = fs.createWriteStream("./output.log");
writeStream.write("第一行日志\n");
writeStream.write("第二行日志\n");
writeStream.write("第三行日志\n");
writeStream.write("第四行日志\n");

writeStream.on("finish", () => {
  console.log("写入完成");
});

// pope-管道连接
// 简单的文件复制
fs.createReadStream("./input.log").pipe(fs.createWriteStream("./output.log"));

// 读取 => 压缩 => 写入
fs.createReadStream("./large-file.log")
  .pipe(createGzip())
  .pipe(fs.createWriteStream("./large-file.log.gz"));
console.log("压缩完成");

// 推荐使用pipeline自动处理错误和自动清理
await pipeline(
  fs.createReadStream("./input.log"),
  createGzip(),
  fs.createWriteStream("./output.log"),
);
console.log("压缩完成");

// Transform Stream - 转换流
// 自动转换流，将文本转换成大写
const upperCase = new Transform({
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase());
    callback();
  },
});

// 自定义转换流：行号添加器
let lineNumber = 0;
const addLineNumbers = new Transform({
  transform(chunk, encoding, callback) {
    const lines = chunk.toString().split("\n");
    const numbered = lines.map((line) =>
      line ? `${++lineNumber} : ${line}` : "",
    );
    this.push(numbered.join("\n"));
    callback();
  },
});

// 组合使用
await pipeline(
  fs.createReadStream("./input.log"),
  addLineNumbers,
  upperCase,
  fs.createWriteStream("./output.log"),
);
