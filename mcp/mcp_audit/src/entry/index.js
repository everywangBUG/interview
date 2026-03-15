import { writeFileSync } from 'fs';
import { createWorkDir } from '../workDir/index.js';
import { resolveProject } from '../resolveProject/index.js';
import { generateLock } from '../generateLock/index.js';
import { runSecurityAudit } from '../audit/index.js';
import { renderMarkdownReport } from '../renderMarkdownReport/index.js';
import { cleanupWorkDir } from '../cleanupWorkDir/index.js';

/**
 * 审计项目依赖并生成 Markdown 报告
 * @param {string} projectRoot - 本地路径或 Git URL
 * @param {string} savePath - 报告保存路径
 */
export async function auditPackage(projectRoot, savePath) {
  let workDir = null;
  try {
    // 1. 创建工作目录
    workDir = createWorkDir();

    // 2. 解析工程
    resolveProject(projectRoot, workDir);

    // 3. 生成 lock 文件
    generateLock(workDir);

    // 4. 安全审计
    const auditData = runSecurityAudit(workDir);

    // 5. 渲染报告
    const markdown = renderMarkdownReport(auditData);
    writeFileSync(savePath, markdown, 'utf-8');
    console.log(`审计报告已保存至: ${savePath}`);

  } catch (error) {
    console.error('审计流程失败:', error.message);
    throw error;
  } finally {
    // 6. 清理工作目录
    if (workDir) cleanupWorkDir(workDir);
  }
}