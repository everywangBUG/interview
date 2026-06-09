// import fs from "node:fs/promises";
const fs = require("node:fs/promises");
const path = require("node:path");

async function generateTree(dir = process.cwd(), prefix = "") {
  let res = "";
  let directories = 0;
  let files = 0;
  if (!prefix) {
    res += `# ${path.basename(dir)}\n`;
  }
  // 递归遍历path目录下的文件和文件夹
  const entries = await fs.readdir(dir, { withFileTypes: true });
  // const sortByCharEntries = entries.sort((a, b) => a.name.localeCompare(b));
  for (let i = 0; i < entries.length; i++) {
    const isLast = i === entries.length - 1;
    // console.log(isLast, "isLast888");
    const line = isLast  ? "└──" : "├──"
    const entry = entries[i];
    res += `# ${prefix}${line}${entry.name} \n`;
    files += 1;

    if (entry.isDirectory()) {
      console.log(entry.name === "node_modules");
      if (entry.name !== "node_modules" || entry.name !== ".git") {
        directories += 1;
        const fullPath = path.join(dir, entry.name);
        // console.log(isLast, "isLast77");
        const newPrefix = prefix + (isLast ? "   " : "|  ");
        // console.log(newPrefix, "newPrefix");
        const subTree = await generateTree(fullPath, newPrefix);
        res += subTree;
      }
    }
  }

  if (!prefix) {
    res += "#\n"
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
