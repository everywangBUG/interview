// const path = require("node:path");
// const fs = require("node:fs/promises");
import path from "node:path";
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import os from "node:os";

// 拼接路径
const joinPath = path.join("/users", "john", "tom", "lisa");
// "users/john/tom/lisa" (Unix)
// "\\users\\john\\tom\\lisa" (Windows)
console.log(joinPath, "joinPath");

// 解析为绝对路径
const resolvePath = path.resolve("src", "fs.js");
console.log(resolvePath, "resolvePath");

// 获取路径的各部分
const filePath = "/user/documents/profile.pdf";
// 获取所在的目录的的绝对路径
const dirnamePath = path.dirname(filePath);
console.log(dirnamePath, "dirnamePath");
// 获取所在的目录的文件全名
const basenamePath = path.basename(filePath);
console.log(basenamePath, "basenamePath");
// 第二个参数获取所在的目录的文件的去除第二个参数的文件名
const basenamePathExclude = path.basename(filePath, "pdf");
console.log(basenamePathExclude, "basenamePathExclude");
// 获取文件名的后缀
const extname = path.extname(filePath);
console.log(extname, "extname");

// 解析绝对路径(包含根目录，绝对路径，文件全名、文件后缀、文件名称)
const absolutePath = path.parse("/user/documents/profile.pdf");
console.log(absolutePath, "absolutePath");

// 相对路径
const relativePath = path.relative("/data/src", "/data/dist/boundle.js");
console.log(relativePath, "relativePath"); // ../dist/boundle.js

// 标准化路径
const normalizedPath = path.normalize("/user/mac/gene//../download");
console.log(normalizedPath, "normalizedPath");


// ========== 读取和修改文件 ==========
// 读取文本文件
const configContent = await fs.readFile('./config.json', "utf-8");
const configParseContent = JSON.parse(configContent);
console.log(configParseContent, "configParseContent");

// 读取二进制文件(不传encoding，返回Buffer)
const buffer = await fs.readFile("./image.png");
console.log(buffer.length, "buffer.length");

// 写入文件
await fs.writeFile("./output.txt", "hello world", "utf-8");

// 追加内容
await fs.appendFile("./log.txt", `${new Date().toISOString()}新日志`);

// 文件信息
const stats = await fs.stat("./package.json");
console.log(stats.isFile()); // true
console.log(stats.isDirectory()); // false
console.log(stats.size); // 文件大小
console.log(stats.mtime); // 最后修改时间

// 文件删除、重命名
// await fs.rename("./old.txt", "./new.txt");
// await fs.unlink("./delete.txt");
await fs.rm("./delete.txt", { force: true });

if (existsSync("./config.json")) {
    console.log("配置文件存在");
}

// ========== 目录操作 ==========
// 创建目录
// await fs.mkdir('./dist');
// 递归创建
// await fs.mkdir('./dist/assets/images', { recursive: true });
// 读取目录内容
const files = await fs.readdir("./src");
console.log(files);

// 文件类型信息
const entries = await fs.readdir("./src", { withFileTypes: true });
for (const entry of entries) {
    const type = entry.isDirectory() ? "📁" : "📄";
    console.log(`${type} ${entry.name}`);
}

// 删除目录
await fs.rm("./dist", { recursive: true, force: true });

// 复制文件
await fs.copyFile("./src/test.js", "./src/copy_test.js");

// 监听文件变化
// const watcher = fs.watch("./src", { recursive: true });
// for await (const event of watcher) {
//     console.log(`${event.eventType}: ${event.filename}`);
// }

// ========== os模块 =========
// 系统信息
console.log(os.platform()); // 平台
console.log(os.type());
console.log(os.release()); // 系统版本
console.log(os.hostname()); // 主机名