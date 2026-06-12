import path from "node:path";
import fs, { readdir } from "node:fs/promises";
import { title } from "node:process";

const docsDir = process.argv[2];

if (!docsDir) {
    console.error("用法：node md-index.js <文档目录>");
}

// 文件的获取绝对路径
const resolvePath = path.resolve(docsDir);

// 递归收集所有的.md文件
async function collectMarkdowns(docsDir) {
    const res = [];

    const entries = await readdir(docsDir, { withFileTypes: true });
    for (let entry of entries) {
        // 获取绝对路径
        const fullPath = path.join(docsDir, entry.name);
        if (entry.isDirectory()) {
            // 递归遍历子文件夹
            const subDir = await collectMarkdowns(fullPath);
            res.push(...subDir);
        } else {
            // 以.md结尾的文件且文件名不等于INDEX.md，放到result中
            if (entry.name.endsWith('.md') && entry.name !== "INDEX.md") {
                res.push(fullPath);
            }
        }
    }
    
    return res;
}

// 生成索引内容
async function generateIndex(files, baseDir) {
    const lines = ["# 文档索引,", "", `> 自动生成于${new Date().toDateString}`, ""];

    const tree = {};
    for (let file of files) {
        const relativePath = path.relative(baseDir, file);
        const dir = path.dirname(relativePath);
        if (!tree[dir]) tree[dir] = [];
        tree[dir].push(relativePath);
    }

    const dirs = Object.keys(tree);

    for (let dir of dirs) {
        if (dir !== ".") {
            lines.push(`## ${dir}`);
            lines.push("");
        }

        for (let relPath of tree[dir].sort()) {
            const fullPath = path.join(baseDir, relPath);
            // 读取md文件内容
            const content = await fs.readFile(fullPath, "utf-8");
            // 匹配 # 一级标题
            const match = content.match(/^#\s+(.+)/m);
            //.md的标题提取出来
            let title =  match ? match[1].trim() : path.basename(filePath, ".md");
            const link = relPath.replace(/\\/g, "/");
            lines.push(`- [${title}(./${link})]`);
        }

        lines.push("");
    }

    return lines.join('\n');
}

const files = await collectMarkdowns(resolvePath);

if (files.length === 0) {
    console.error("未找到任何 .md文件");
    process.exit(0);
}

console.log(`找到 ${files.length}个markdown文件，正在生成索引...`);

const indexContent = await generateIndex(files, resolvePath);

// path.join输出目录
const outputPath = path.join(resolvePath, "INDEX.md");
// 写入indexContent文件内容
fs.writeFile(outputPath, indexContent, "utf-8");
console.log("索引已经生成");