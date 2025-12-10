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

const App = <div id='app' style={{width: '100px', height: '100px', backgroundColor: 'red'}}>手写react框架</div>

export default App;
