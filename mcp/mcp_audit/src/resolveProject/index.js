import { execSync } from 'child_process';
import {
  writeFileSync,
  readFileSync,
  existsSync,
} from 'fs';
import { join } from 'path';

/**
 * 解析项目源（本地路径或 Git URL），并将 package.json 复制/克隆到 workDir
 * @param {string} projectRoot - 本地绝对路径 或 Git 仓库 URL
 * @param {string} workDir - 工作目录
 */
export function resolveProject(projectRoot, workDir) {
    const isRemote = projectRoot.startsWith('http') || projectRoot.includes('git@');
  
    if (isRemote) {
      console.log(`克隆远程仓库: ${projectRoot}`);
      // 支持 .git 或普通 GitHub URL
      const repoUrl = projectRoot.endsWith('.git')
        ? projectRoot
        : `${projectRoot}.git`.replace(/\.git\.git$/, '.git'); // 防止重复
  
      try {
        execSync(`git clone --depth=1 --quiet ${repoUrl} ${workDir}`, {
          stdio: 'pipe',
          timeout: 60000 // 60s 超时
        });
      } catch (err) {
        console.error('Git 克隆失败:', err.stderr?.toString() || err.message);
        throw new Error(`无法克隆仓库: ${projectRoot}`);
      }
    } else {
      // 本地项目：直接复制 package.json
      if (!existsSync(projectRoot)) {
        throw new Error(`本地路径不存在: ${projectRoot}`);
      }
      const pkgPath = join(projectRoot, 'package.json');
      if (!existsSync(pkgPath)) {
        throw new Error(`未找到 package.json: ${pkgPath}`);
      }
      const pkgContent = readFileSync(pkgPath, 'utf-8');
      writeFileSync(join(workDir, 'package.json'), pkgContent);
      console.log(`复制 package.json 到工作目录`);
    }
}
  