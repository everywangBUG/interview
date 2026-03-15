
import { mkdtempSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

/**
 * 创建临时工作目录
 * @returns {string} 临时目录路径
 */
export function createWorkDir() {
    // 使用mkdtempSync会在prefix后随机添加字符，保证目录唯一性
    const tempDir = mkdtempSync(join(tmpdir(), 'pkg-audit-'));
    console.log(`创建工作目录: ${tempDir}`);
    return tempDir;
}