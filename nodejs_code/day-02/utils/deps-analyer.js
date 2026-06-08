const path = require("node:path");
const fs = require("fs");

async function depsAnalyzer(directory = process.cwd()) {
  // 读取指定目录中的或者当前目录中的package.json
  const packageJsonPath = path.join(directory, 'package.json');

  try {
    fs.access(packageContent);
  } catch (err) {
    console.error("当前目录没有package.json，请重新选择目录", err);
  }

  // 读取package.json文件内容
  const packageContent = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

  const dependencies = packageContent["dependencies"];
  const devDependencies = packageContent["devDependencies"];

  const sortedByCharDependencies = Object.keys(dependencies).sort((a, b) => a.localeCompare(b));
  const sortedByCharDevDependencies = Object.keys(devDependencies).sort((a, b) => a.localeCompare(b));

  console.log(sortedByCharDependencies, "排序后的dependencies");
  console.log(sortedByCharDevDependencies, "排序后的devDependencies");

  // 检查是否有package-lock.json或者pnpm-lock.yaml文件
  const packageLockPath = path.join(directory, "package-lock.json");
  const pnpmLockPath = path.join(directory, "pnpm-lock.yaml");

  try {
    fs.access(packageLockPath);
  } catch (err) {
    console.error("该文件中没有package-lock.json");
  }
  
  try {
    fs.access(pnpmLockPath);
  } catch (err) {
    console.error("该文件中没有pnpm-lock.yaml");
  }

  let count = 0;
  Object.keys(dependencies).forEach(_ => {
    count += 1;
  })
  Object.keys(devDependencies).forEach(_ => {
    count += 1;
  })
  console.log(`总共有${count}个依赖`);
}

// depsAnalyzer("D:\/web_development\/mini-react");
depsAnalyzer("/Users/gene/Desktop/hy-work/health-hejia");

