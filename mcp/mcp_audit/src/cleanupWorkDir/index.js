import {
  existsSync,
  rmSync
} from 'fs';
import { tmpdir } from 'os';

/**
 * 清理临时工作目录
 * @param {string} workDir - 工作目录路径
 */
export function cleanupWorkDir(workDir) {
    if (workDir && workDir.includes(tmpdir()) && existsSync(workDir)) {
      try {
        rmSync(workDir, { recursive: true, force: true });
        console.log(`已清理工作目录: ${workDir}`);
      } catch (e) {
        console.warn(`无法删除临时目录: ${e.message}`);
      }
    }
}