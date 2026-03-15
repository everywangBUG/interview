/**
 * 将审计数据渲染为中文 Markdown 报告
 * @param {object} auditData - npm audit 返回的 JSON 数据
 * @returns {string} Markdown 字符串
 */
export function renderMarkdownReport(auditData) {
    const metadata = auditData.metadata || {};
    const vulns = auditData.vulnerabilities || auditData.advisories || {};
  
    // 提取统计信息
    let total = 0, low = 0, moderate = 0, high = 0, critical = 0;
    if (metadata.vulnerabilities) {
      ({ total, low, moderate, high, critical } = metadata.vulnerabilities);
    } else {
      total = Object.keys(vulns).length;
      // 粗略统计（若需精确，应遍历所有漏洞）
      for (const id in vulns) {
        const sev = vulns[id].severity;
        if (sev === 'critical') critical++;
        else if (sev === 'high') high++;
        else if (sev === 'moderate') moderate++;
        else if (sev === 'low') low++;
      }
    }
  
    let md = `# 依赖安全审计报告\n\n`;
    md += `> 生成时间：${new Date().toLocaleString('zh-CN')}\n\n`;
  
    if (total === 0) {
      md += `✅ **未发现安全漏洞。**\n`;
      return md;
    }
  
    // ===== 漏洞概览 =====
    md += `## 漏洞概览\n\n`;
    md += `| 严重等级 | 数量 |\n`;
    md += `|----------|------|\n`;
    md += `| 严重     | ${critical} |\n`;
    md += `| 高危     | ${high} |\n`;
    md += `| 中危     | ${moderate} |\n`;
    md += `| 低危     | ${low} |\n`;
    md += `\n总计漏洞数：**${total}**\n\n`;
  
    // ===== 字段说明 =====
    md += `## 字段说明\n\n`;
    md += `- **严重等级（Severity）**：漏洞的危害程度（严重 > 高危 > 中危 > 低危）\n`;
    md += `- **涉及包（Package）**：直接或间接引入漏洞的 npm 包\n`;
    md += `- **受影响版本（Affected Versions）**：存在漏洞的版本范围\n`;
    md += `- **修复版本（Patched Versions）**：已修复漏洞的最低版本\n`;
    md += `- **Via 路径**：漏洞传递链，从根依赖到漏洞源的完整路径\n`;
    md += `- **是否直接依赖（Is Direct）**：该漏洞是否来自项目直接声明的依赖\n`;
    md += `- **影响范围（Range）**：在依赖树中受影响的版本区间\n`;
    md += `- **节点（Nodes）**：依赖图中受影响的具体节点 ID（用于定位）\n\n`;
  
    // ===== 详细漏洞列表 =====
    md += `## 详细漏洞信息\n\n`;
  
    if (Object.keys(vulns).length === 0) {
      md += `_暂无漏洞详情。_\n`;
      return md;
    }
  
    for (const id in vulns) {
      const adv = vulns[id];
      const title = adv.title || adv.name || `漏洞 #${id}`;

      const severityMap = { critical: '严重', high: '高危', moderate: '中危', low: '低危' };
      const severity = severityMap[adv.severity] || adv.severity || '未知';
      const moduleName = adv.module_name || adv.name || '未知';
      const vulnerableVersions = adv.vulnerable_versions || '*';
      const patchedVersions = adv.patched_versions || '无';
      const overview = adv.overview || adv.description || '无描述';
  
      md += `### [${title}](https://github.com/advisories/${id})\n\n`;
      md += `- **严重等级**：${severity}\n`;
      md += `- **涉及包**：\`${moduleName}\`\n`;
      md += `- **受影响版本**：\`${vulnerableVersions}\`\n`;
      md += `- **修复版本**：\`${patchedVersions}\`\n`;
      md += `- **概述**：${overview}\n\n`;
  
      if (adv.recommendation) {
          md += `> **官方建议**：${adv.recommendation}\n\n`;
        }
        
        // ===== 解析 via 数组（核心增强）=====
        if (Array.isArray(adv.via) && adv.via.length > 0) {
        console.log(adv, 'adv');
        md += `#### 漏洞传递路径（Via Chain）\n\n`;
        md += `> 此漏洞通过以下依赖链引入：\n\n`;
  
        adv.via.forEach((viaItem, idx) => {
          if (typeof viaItem === 'string') {
            // 有些情况下 via 是 advisory ID 字符串（如 "GHSA-xxx"）
            md += `${idx + 1}. [${viaItem}](https://github.com/advisories/${viaItem})\n`;
          } else if (typeof viaItem === 'object') {
            // 完整的 via 对象（包含 range, nodes, effects 等）
            const pkgName = viaItem.name || 'unknown';
            const source = viaItem.source;
            const range = viaItem.range || '*';
            const isDirect = viaItem.isDirect ? '是' : '否';
            const effects = Array.isArray(viaItem.effects) ? viaItem.effects.join(', ') : '无';
            const nodes = Array.isArray(viaItem.nodes) ? viaItem.nodes.join(', ') : 'N/A';
  
            md += `${idx + 1}. **包**: \`${pkgName}\`\n`;
            md += `   - **漏洞id**: \`${source}\`\n`;
            md += `   - **影响范围**: \`${range}\`\n`;
            md += `   - **是否直接依赖**: ${isDirect}\n`;
            md += `   - **影响字段**: ${effects}\n`;
            md += `   - **依赖图节点**: ${nodes}\n\n`;
          }
        });
      }
  
      // ===== 受影响的顶层依赖路径 =====
      if (adv.findings?.length > 0) {
        md += `#### 项目中的受影响路径\n\n`;
        const uniquePaths = [...new Set(
          adv.findings
            .map(f => f.paths?.join(' → ') || '')
            .filter(p => p)
        )].slice(0, 5);
  
        if (uniquePaths.length > 0) {
          uniquePaths.forEach(p => {
            md += `- \`${p}\`\n`;
          });
          if (adv.findings.length > 5) {
            md += `- ... 另有 ${adv.findings.length - 5} 条路径\n`;
          }
        } else {
          md += `_未解析出具体路径_\n`;
        }
        md += `\n`;
      }
  
      md += `---\n\n`;
    }
  
    md += `*本报告基于 \`npm audit\` 生成，漏洞数据来源于 GitHub Advisory Database。*\n`;
    return md;
}