// const App = {
//     type: 'div',
//     props: {
//         id: 'app',
//         style: 'width: 100px; height: 100px; background-color: red',
//         children: [
//         {
//             type: 'TEXT_ELEMENT',
//             props: {
//             nodeValue: '手写react框架',
//             children: []
//             }
//         }
//         ]
//     }
// }

import React from './react';

// vite自动调用React中的createElement函数，这里引入React自定义的createElement函数
const App = <div id='app' style="width:100px;height:100px;background-color:red">手写react框架</div>

export default App;
