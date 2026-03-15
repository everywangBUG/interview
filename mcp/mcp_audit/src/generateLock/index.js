import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

/**
 * 在工作目录中生成 package-lock.json
 * @param {string} workDir - 工作目录
 */
export function generateLock(workDir) {
    const pkgPath = join(workDir, 'package.json');
    if (!existsSync(pkgPath)) {
      throw new Error('工作目录中缺少 package.json');
    }
  
    // 检查是否已有 lock 文件
    const lockPath = join(workDir, 'package-lock.json');
    if (existsSync(lockPath)) {
      console.log('已存在 package-lock.json，跳过生成');
      return;
    }
  
    console.log('正在生成 package-lock.json...');
    try {
      execSync('npm install --package-lock-only --silent --legacy-peer-deps --registry=https://registry.npmmirror.com', {
        cwd: workDir,
        stdio: ['pipe', 'pipe', 'inherit'],
        timeout: 6000
      });
    } catch (err) {
      console.error('生成 lock 文件失败:', err.stderr?.toString() || err.message);
      throw   new Error('无法生成 package-lock.json');
    }
  }
  