import { execSync } from 'child_process';

/**
 * 执行 npm audit --json 并返回原始 JSON 数据
 * @param {string} workDir - 工作目录
 * @returns {object} auditData
 */
export function runSecurityAudit(workDir) {
    console.log('正在执行安全审计 (npm audit)...');
    let stdout;
    try {
      stdout = execSync('npm audit --json', {
        cwd: workDir,
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'ignore']
      });
    } catch (err) {
      // npm audit 有漏洞时 exit code=1，但仍输出有效 JSON
      if (err.stdout) {
        stdout = err.stdout;
      } else {
        console.error('npm audit 完全失败:', err.stderr?.toString() || err.message);
        throw new Error('npm audit 未返回有效数据');
      }
    }
  
    try {
      return JSON.parse(stdout);
    } catch (e) {
      console.error('无法解析 npm audit 输出为 JSON');
      throw new Error('审计结果格式无效');
    }
}
  