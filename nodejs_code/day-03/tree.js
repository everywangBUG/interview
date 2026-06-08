// import fs from "node:fs/promises";
const fs = require("node:fs/promises");
const path = require("node:path");

async function generateTree(dir = process.cwd()) {
  let res = "# 输出:";
  // 递归遍历path目录下的文件和文件夹
  const entries = await fs.readdir(dir, { withFileTypes: true });
  // console.log(entries, "entries");
  for (let entry of entries) {
    // console.log(entry);
    if (entry.isFile()) {
      res += `# ├── ${entry.name}`;
      res += "\n";
    } else if (entry.isDirectory()) {
      const fullPath = path.join(dir, entry.name);
      await generateTree(fullPath);
      res += "# ├──";
    }
  }

  return res;
}

async function main() {
  try {
    const tree = await generateTree("./src");
    console.log(tree);
  } catch (err) {
    console.error(err);
  }
}

main();
