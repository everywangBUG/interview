# 安全依赖审计项目

## 何时进行安全审计
* 技术选型：
    * 针对目标技术
    * 远程审计
* 项目开发
    * 针对当前工程
    * 本地审计/远程审计

## 如何进行安全审计
`npm audit`

## 为什么不直接使用npm audit
`npm audit`的问题
    * 阅读不友好
        * 依赖关系不清晰
    * 功能不完整
        * 无法对远程仓库进行安全审计
        * 无法对工程本身进行审计（只能审计依赖）
    * 难以集成
        * AI集成应用：取决于是否支持运行命令
        * CI/CD集成：无法定义部署决策逻辑

## 需求
自定义安全审计功能，支持
* 对本地工程或者远程仓库都能进行安全审计
* 能对工程本身进行安全审计
* 审计结果中包含清晰的依赖路径
* 审计结果是一个统一的标准markdown格式文档
* 支持`MCP Serve`协议

## MVP版本实现流程
1. 实现安全审计功能版本
```javascript
    /**
     * 根据项目根目录，审计项目中所有的包
     * @param {string} projectRoot项目根目录，可以是本地目录的绝对路径，也可以是远程仓库的url
     * @param {string} savePath 
     */

    export async function auditPackage(projectRoot, savePath) {
        
    }
```
2 套壳子为`MCP Serveer`

## 安全审计功能的实现流程
1. **创建工作目录**： 创建一个临时的工作目录，用于保存执行期间用到的临时文件
2. **解析工程**：解析本地工程目录或者远程仓库链接，得到对应的`package.json`文件
3. **生成lock文件**：将`package.json`写入临时工作目录，根据它生成`package.lock.json`文件
4. **安全审计**：进入临时工作目录，使用`npm audit`进行安全审计
5. **渲染**：将上面一步的审计结果进行渲染，渲染成标准的markdown内容
6. **删除工作目录**：将之前创建的临时工作目录删除

## 实现细节
1. 创建工作目录
 * 使用mkdtempSync创建一个唯一的目录文件夹

2. 解析工程
 * 通过`http`或者`git@`
 * 远程仓库则`git clone`项目，本地项目直接复制`package.json`文件夹
 * 从远程仓库中获取关键信息：owner、repo、tag、default_brach
 * 获取远程仓库中的`package.json`
 * 其他情况：非前端工程、monorepo工程

3. 生成lock文件
 * 将`package.json`写入临时工作目录中，根据它生成`package-lock.json`
 * 如何根据`package.json`生成`package-lock.json`：`npm install --package-lock-only`

4. 安全审计
 * 如何得到审计结果：`npm audit --json`
 * 审计结果中通常包含哪些信息
    * severity: [](https://docs.npmjs.com/about-audit-reports#severity)
    * source：漏洞编号
    * CVE：漏洞的通用编号，该编号跨越语言，可以从[](https://www.cve.org)查看详情
    * CWE：漏洞的类型编号，可以通过该编号查看漏洞是如何产生的，会造成什么影响，可以通过[](https://cwe.mitre.org/)查看
    * CVESS：漏洞严重性评分
    * 规格化的DFS图的信息
5. 渲染
 * 渲染成标准的markdown格式

## 面试
* 请你谈一谈你做的AI Security-Check项目

### 背景
1. 这是一个安全审计工具
2. 以前开发中，或者技术选型的时候，我们项目组都是使用`npm audit`进行安全审计
3. 手动审计有很多问题，如难以和现在公司的AI工具链结合，格式不友好、不稳定，阅读效果差，只能的本地工程的依赖项进行审计，对远程工程或者工程本身无法进行。
4. 项目组在做安全审计的时候浪费大量的时间和精力整理

### 方案
1. 首先我指定了一套自动化管线解决这个问题，大概是
    * 第一步创建一个临时工作目录
    * 通过判断是否是本地工程或者远程仓库进行解析工程得到`package.json`文件
    * 将`package.json`文件通过`npm install --package-lock-only`命令得到`package-lock`文件
    * 进入临时工作目录，使用`npm audit`进行安全审计
    * 得到的审计结果进行规格化的处理，通过DFS深度优先搜索得到依赖链条
    * 使用cjs的模版语法渲染得到标准的markdown格式文件
    * 删除工作目录，流程使用程序自动化完成

### 实施
1. 流程比较简单，但是有一些细节需要处理
    * 比如版本问题，由于这个工具是作为MCP server在本地运行，而本地的npm版本有差异，我引入了docker固定环境版本
    * 另外官方的审计API得到的结果是一个依赖图，而我们需要的是一个依赖链条，图转链还要涉及到环的问题
    * 有些工程使用monorepo功能搭建，需要是适配不同的workspace api读取工程下的所有子依赖

### 效果
1. 落地在了vscode和Cursor中，也可以直接调用，发布到npm和私有源集成到了公司的AI工具链中，后面的安全审计直接使用该工具节省时间。