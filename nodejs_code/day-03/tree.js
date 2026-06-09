// import fs from "node:fs/promises";
const fs = require("node:fs/promises");
const path = require("node:path");

const IGNORE_DIR = new Set(["node_modules", ".git"]);

async function generateTree(dir = process.cwd(), prefix = "") {
  let res = "";
  let directories = 0;
  let files = 0;
  if (!prefix) {
    res += `# ${path.basename(dir)}\n`;
  }
  // 递归遍历path目录下的文件和文件夹
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch (err) {
    console.error(`无法读取目录：${dir}`);
    return;
  }

  entries.filter((e) => !IGNORE_DIR.has(e.name));
  entries.sort((a, b) => {
    if (a.isDirectory() !== b.isDirectory()) return a.isDirectory() ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  for (let i = 0; i < entries.length; i++) {
    const isLast = i === entries.length - 1;
    const line = isLast ? "└──" : "├──";
    const entry = entries[i];
    res += `# ${prefix}${line}${entry.name} \n`;
    files += 1;

    if (entry.isDirectory()) {
      if (entry.name !== "node_modules" || entry.name !== ".git") {
        directories += 1;
        const fullPath = path.join(dir, entry.name);
        const newPrefix = prefix + (isLast ? "   " : "|  ");
        const subTree = await generateTree(fullPath, newPrefix);
        res += subTree;
      }
    }
  }

  if (!prefix) {
    res += "#\n";
    res += `# ${directories} directories, ${files} files`;
  }

  return res;
}

async function main() {
  try {
    const tree = await generateTree("../day-03");
    console.log(tree);
  } catch (err) {
    console.error(err);
  }
}

main();
