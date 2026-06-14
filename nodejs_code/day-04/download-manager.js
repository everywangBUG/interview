import { EventEmitter } from "node:events";

// 事件驱动的下载管理器
// 定义一个类继承EventEmitter
class DownloadManager extends EventEmitter {
  constructor() {
    super();
    // 定义一个空队列
    this.queue = [];
    // 定义一个正在运行数量的状态
    this.running = 0;
    // 定义一个最大的运行限制
    this.maxConcurrent = 3;
  }

  // 下载函数静态方法
  download(file) {
    this.queue.push(file);
    this._next();
  }

  _next() {
    // 如果正在运行的任务小于最小的任务数量且队列的数量长度大于0
    while (this.running < this.maxConcurrent && this.queue.length > 0) {
      const file = this.queue.shift();
      // 正在运行的任务数+1
      this.running++;
      // 管理上传文件
      this._simulate(file);
    }
  }

  // 上传文件
  async _simulate(file) {
    // 模拟文件大小1mb- 5mb
    const totalSize = Math.floor(Math.random() * 4 * 1024 * 1024) + 1024 * 1024;
    const chunkSize = Math.floor(totalSize / 20);
    let downloaded = 0;

    try {
      while (downloaded < totalSize) {
        await new Promise((r) => setTimeout(r, 100 + Math.random() * 150));

        // 模拟5%的概率出错
        if (Math.random() < 0.05) {
          throw new Error("网络连接超时");
        }

        // 已下载的文件赋值
        downloaded = Math.min(downloaded + chunkSize, totalSize);
        // 下载进度
        const percent = ((downloaded / totalSize) * 100).toFixed(1);
        // emit progress
        this.emit("progress", {
          file,
          percent: parseFloat(percent),
          downloaded,
          totalSize,
        });
      }
      this.emit("complete", { file, size: totalSize });
    } catch (error) {
      this.emit("error", { file, error });
    } finally {
      this.running--;
      this._next();
    }
  }
}

const manager = new DownloadManager();
const progress = {};

function renderBar(percent, width = 20) {
  const filed = Math.round((percent / 100) * width);
  return "[" + "█".repeat(filed) + "░".repeat(width - filed) + "]";
}

function formatBytes(bytes) {
  return (bytes / 1024 / 1024).toFixed(2) + "MB";
}

manager.on("progress", ({ file, percent }) => {
  / * 进度条 */;
  progress[file] = percent;
  process.stdout.write(
    `\r ${file.padEnd(2)} ${renderBar(percent)} ${percent.toFixed(1)}%`,
  );
});
manager.on("complete", ({ file, size }) => {
  console.log(`\n ${file} 下载完成 - ${formatBytes(size)}`);
});
manager.on("error", ({ file, error }) => {
  / * 错误处理 */;
  console.log(`\n ${file} 下载失败 - ${error.message}`);
});

const files = ["file1.zip", "file2.zip", "file3.zip", "file4.zip", "file5.zip"];

console.log(`开始下载 ${files.length} 个文件（最大并发: 3）\n`);
for (const f of files) {
  manager.download(f);
}
