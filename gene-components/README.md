# 构建esm和cjs产物

## 引入已完成的组件

## 使用tsc编译产物
* 新建tsconfig.build.json文件
* 编译esm产物：`npx tsc -p tsconfig.build.json --module ESNext --outDir dist/esm`
* 编译cjs产物：`npx tsc -p tsconfig.build.json --module commonjs --outDir dist/cjs`

## 编译样式
* 编译Calendar样式到esm和cjs中 
  * `npx sass ./src/Calendar/Calendar.scss ./dist/esm/Calendar/Calendar.css`
  * `npx sass ./src/Calendar/Calendar.scss ./dist/cjs/Calendar/Calendar.css`

* 编译Calendar Header样式到esm和cjs中 
  * `npx sass ./src/Calendar/Header.scss ./dist/esm/Calendar/Header.css`
  * `npx sass ./src/Calendar/Header.scss ./dist/cjs/Calendar/Header.css`

* 编译Calendar MonthCalendar样式到esm和cjs中 
  * `npx sass ./src/Calendar/MonthCalendar.scss ./dist/esm/Calendar/MonthCalendar.css`
  * `npx sass ./src/Calendar/MonthCalendar.scss ./dist/cjs/Calendar/MonthCalendar.css`

* 编译Message样式到esm和cjs中
  * `npx sass ./src/Message/Message.scss ./dist/esm/Message/Message.css`
  * `npx sass ./src/Message/Message.scss ./dist/cjs/Message/Message.css`

* 编译WaterMark样式到esm和cjs中
  * `npx sass ./src/WaterMark/WaterMark.scss ./dist/esm/WaterMark/WaterMark.css`
  * `npx sass ./src/WaterMark/WaterMark.scss ./dist/cjs/WaterMark/WaterMark.css`

## package.json中加入脚本片段
```javascript
  "main": "dist/cjs/index.js", // commonjs入口
  "module": "dist/esm/index.js", // es module入口
  "types": "dist/esm/index.d.ts", // dts的路径
  "files": [ // 哪些文件发布到npm仓库，没有列出的被过滤
    "dist",
    "package.json",
    "README.md"
  ]
```

* package.json中的` "type": "module"`移除，灵活处理cjs和ex module模块
* package.json中的` "private": true``移除，这个字段表示永远不在npm上发布

## 登录npm发布产物
* `npm publish`

## 需要引入打包的样式

## 把react、react-dom移入到peerDependencies脚本中
* dependencies是子集依赖，peerDependencies是平级，移到里面如果和其他的react包发生冲突的时候提示开发者解决冲突，不会保留副本