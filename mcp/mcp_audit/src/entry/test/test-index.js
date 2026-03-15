import { auditPackage } from "../index.js";

// auditPackage(
//     '/Users/gene/Desktop/web/react-mangosteen',
//     '/Users/gene/Desktop/react-mangosteen.md'
// ).then(() => {
//     console.log('本地工程审计完毕');
// })

auditPackage(
    'git@github.com:axios/axios.git',
    '/Users/gene/Desktop/axios.md'
).then(() => {
    console.log('远程仓库审计完成');
})