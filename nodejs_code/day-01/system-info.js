const process = require("node:process");
const os = require("node:os");

// Node.js版本
console.log("Nodejs版本", process.version);

// 操作系统的类型和版本
console.log("操作系统的类型", os.type());
console.log("操作系统的版本", os.version());

// CPU架构
console.log("CPU架构", os.arch());

// 当前用户工作主目录
console.log("当前用户工作主目录", __filename);

// 内存使用情况
const memoryUsage = process.memoryUsage();
const memoryMap = {
  rss: "常驻内存",
  heapTotal: "堆总量",
  heapUsed: "已用堆内存",
  external: "外部内存",
};
console.log("内存使用情况", {
  [memoryMap["rss"]]: `${(memoryUsage.rss / 1024 / 1024).toFixed(2)}MB`,
  [memoryMap["heapTotal"]]:
    `${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)}MB`,
  [memoryMap["heapUsed"]]:
    `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)}MB`,
  [memoryMap["external"]]:
    `${(memoryUsage.external / 1024 / 1024).toFixed(2)}MB`,
});


// 进程运行时间
console.log("进程运行时间", process.uptime());
