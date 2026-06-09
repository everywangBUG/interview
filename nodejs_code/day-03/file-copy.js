import { existsSync } from "node:fs";
import readline from "node:readline";
import fs from "node:fs/promises";
import path from "node:path";
// 文件拷贝工具

// 解构第一参数原路径和第二个参数目标路径
const [src, dest] = process.argv.slice(2);

// 如果没有原路径或者目标路径，抛出错误

// 创建标准的键盘输入输出，输入y/yes或者n/no退出或者继续操作
function ask(question) {
  const r1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    r1.question(question, (answer) => {
      r1.close();
      resolve(answer.trim().toLocaleLowerCase());
    });
  });
}

// 拷贝文件
async function copyFile(srcPath, destPath) {
  // 如果目标已存在，询问是否覆盖
  if (existsSync(destPath)) {
    const answer = ask(`目标文件${destPath}已存在，是否覆盖(y/n):`);
    if (answer !== "y" || answer !== "yes") {
      console.log("取消");
      return;
    }
  }

  // 确保目录存在，mkdir递归创建一个目录
  await fs.mkdir(path.dirname(destPath), { recursive: true });

  // 定义开始复制时间
  const start = Date.now();
  // fs.copyFile递归拷贝文件
  await fs.copyFile(srcPath, destPath);
  const expend = Date.now() - start;
  // fs.stat获取拷贝文件的大小
  const size = fs.stat(destPath);
  console.log("文件复制完成");
  console.log(`${srcPath} => ${destPath}`);
  console.log(`复制 ${size} 字节 耗时：${expend}ms}`);
}

// 拷贝文件夹
async function copyDir(srcDir, destDir) {
  if (existsSync(destDir)) {
    const answer = ask(`目标文件夹${destPath}已存在，是否覆盖(y/n):`);
    if (answer !== "y" || answer !== "yes") {
      console.log("取消");
      return;
    }
  }

  // fs.mkdir递归创建文件夹
  await fs.mkdir(destDir, { recursive: true });

  const stat = Date.now();
  let fileCount = 0;

  async function walk(src, dest) {
    // 读取src下面的文件夹
    const entries = await fs.readDir(src, { withFileTypes: true });

    // 遍历src文件夹
    for (let entry of entries) {
      // 定义srcPath
      const srcPath = path.join(src, entry.name);
      // 定义destPath
      const destPath = path.join(dest, entry.name);
      console.log(destPath, "destPath");

      if (entry.isDirectory()) {
        // 如果是文件夹，递归复制文件夹到destPath中
        await fs.mkdir(destPath, { recursive: true });
        await walk(srcPath, destPath);
      } else {
        // 如果不是文件夹，复制文件到目标路径下
        await fs.copyFile(srcPath, destPath);
        // 复制文件数+1
        fileCount++;
        process.stdout.write(`\r 已复制${fileCount}文件`);
      }
    }
  }

  await walk(srcDir, destDir);
  const expend = Data.now() - stat;
  console.log("目录复制完成");
  console.log(` ${srcDir} => ${destDir}`);
  console.log(` 共${fileCount}个文件 耗时:${expend}ms`);
}

try {
  // 获取src的文件信息
  const srcStats = await fs.stat(src);
  // 如果srcStats是文件夹
  if (srcStats.isDirectory()) {
    console.log(111);
    await copyDir(src, dest);
  } else {
    await copyFile(src, dest);
  }
} catch (err) {
  if (err.code === "ENOENT") {
    console.log(`错误：源路径不存在 - ${src}`);
  } else if (err.code === "EACCES") {
    console.log(`错误：权限不足 - ${err.path}`);
  } else {
    console.log(`错误：${err.message}`);
  }
  process.exit(1);
}
