// mcpServer.js
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

import { auditPackage } from './entry/index.js';

// 创建 MCP 服务器
const server = new McpServer({
  name: 'dependency-audit-mcp',
  title: 'Dependency Security Audit MCP Server',
  version: '1.0.0'
});

// 注册 auditPackage 工具
server.registerTool(
  'auditPackage',
  {
    description: '审计本地项目或 Git 仓库的 npm 依赖安全漏洞，并生成中文 Markdown 报告',
    inputSchema: z.object({
      projectRoot: z.string().describe('本地项目路径 或 GitHub/GitLab 仓库 URL（如 https://github.com/axios/axios.git）'),
      outputPath: z.string().optional().default('./audit-report.md').describe('报告输出路径')
    })
  },
  async (input) => {
    const { projectRoot, outputPath } = input;

    try {
      // 调用你已有的 auditPackage 函数
      await auditPackage(projectRoot, outputPath);

      return {
        content: [
          {
            type: 'text',
            text: `安全审计完成！\n报告已保存至：\`${outputPath}\``
          }
        ]
      };
    } catch (error) {
      console.error('MCP 工具执行失败:', error);
      return {
        content: [
          {
            type: 'text',
            text: `审计失败：${error.message || '未知错误'}`
          }
        ],
        isError: true
      };
    }
  }
);

// 启动服务（通过 stdin/stdout 通信）
const transport = new StdioServerTransport();
server.connect(transport);

console.error('Dependency Audit MCP Server 已启动，等待 Cursor 调用...');