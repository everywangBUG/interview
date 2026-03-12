import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod'; // 数据类型校验
import fs from 'fs';
import path from 'path';

// 创建 MCP 服务器
const server = new McpServer({
    name: 'my-mcp-server',
    title: 'My MCP Server',
    version: '0.1.0'
});

// ========================
// 工具 1: calculateMath
// ========================
const CalculateMathInputSchema = z.object({
    operation: z.enum(['add', 'subtract', 'multiply', 'divide'], {
        description: '数学操作类型'
    }),
    numbers: z.array(z.number()).min(1, '至少需要一个数字'),
    precision: z.number().int().min(0).default(10),
    enableRounding: z.boolean().default(true)
});

server.registerTool(
    'calculateMath',
    {
        description: '对一组数字执行加、减、乘、除运算',
        inputSchema: CalculateMathInputSchema
    },
    async (input) => {
        const { operation, numbers, precision, enableRounding } = input;

        // 执行计算
        let result;
        switch (operation) {
            case 'add':
                result = numbers.reduce((a, b) => a + b, 0);
                break;
            case 'subtract':
                result = numbers.reduce((a, b) => a - b);
                break;
            case 'multiply':
                result = numbers.reduce((a, b) => a * b, 1);
                break;
            case 'divide':
                result = numbers.reduce((a, b) => {
                    if (b === 0) throw new Error('Division by zero');
                    return a / b;
                });
                break;
            default:
                throw new Error(`Unsupported operation: ${operation}`);
        }

        // 应用精度
        const factor = Math.pow(10, precision);
        if (enableRounding) {
            result = Math.round(result * factor) / factor;
        } else {
            result = Math.floor(result * factor) / factor;
        }

        // 返回标准 content 格式
        return {
            content: [
                {
                    type: 'text',
                    text: String(result)
                }
            ]
        };
    }
);

// ========================
// 工具 2: createFile
// ========================
const CreateFileInputSchema = z.object({
    filePath: z.string().min(1, '文件路径不能为空'),
    content: z.string().optional().default('')
});

server.registerTool(
    'createFile',
    {
        description: '在指定路径创建一个新文件',
        inputSchema: CreateFileInputSchema
    },
    async (input) => {
        const { filePath, content } = input;

        // 确保目录存在
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // 写入文件
        fs.writeFileSync(filePath, content, 'utf8');

        return {
            content: [
                {
                    type: 'text',
                    text: `✅ 文件已创建: ${filePath}`
                }
            ]
        };
    }
);

// 启动服务
const transport = new StdioServerTransport();
server.connect(transport);
