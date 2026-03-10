# 使用rollup打包组件库

## 创建项目
```
    mkdit gene-components-rollup
    cd gene-components-rollup
    npm init -y
```

## 安装rollup的包
```
    npm install --save react@19 react-dom@19

    npm install --save dayjs ahooks classnames react-transition-group lodash-es

    npm install --save-dev @types/lodash-es @types/react-dom @types/react-transition-group
```

## 安装rollup打包
`npm i --save-dev rollup`

## 配置rollup文件rollup.config.mjs
```javascript
    import postcss from 'rollup-plugin-postcss';
    import typescript from '@rollup/plugin-typescript';
    import resolve from '@rollup/plugin-node-resolve';
    import commonjs from '@rollup/plugin-commonjs';
    import replace from '@rollup/plugin-replace';

    /** @type {import("rollup").RollupOptions} */
    export default {
        input: 'src/index.ts',
        external: [ 'react', 'react-dom' ],
        output: [
            {
                file: 'dist/esm.js',
                format: 'esm'
            },
            {
                file: 'dist/cjs.js',
                format: "cjs"
            },
            {
                file: 'dist/umd.js',
                name: 'Gene',
                format: "umd",
                globals: {
                    'react': 'React',
                    'react-dom': 'ReactDOM'
                }
            }
        ],
        plugins: [
            resolve(),
            commonjs(),
            typescript({
                tsconfig: 'tsconfig.json'
            }),
            postcss({
                extract: true,
                extract: 'index.css'
            }),
            replace({
                'process.env.NODE_ENV': '"production"'
            })
        ]
    };
```

## 安装sass及相关的包
`npm install --save-dev sass @rollup/plugin-commonjs @rollup/plugin-node-resolve @rollup/plugin-replace @rollup/plugin-typescript rollup-plugin-postcss`

## 打包
`npx rollup -c rollup.config.mjs`

## 登录npm，发布npm publish