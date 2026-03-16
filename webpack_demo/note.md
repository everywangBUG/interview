# webpack

## 起步

### 基础设置

- 去掉`package.json`中的main入口，防止意外的代码发布
- 添加`"private": true`

### 创建一个bundle

- `npx webpack`将`index.js`作为入口，生成到dist文件下面的main.js，`index.html`引入，在live server中可查看页面生成hello webpack

### 模块

- 支持ES2015标准化的`import`和`export`
- 支持其他模块的语法，需要设置[](https://www.webpackjs.com/api/module-methods/)

### 使用配置文件
