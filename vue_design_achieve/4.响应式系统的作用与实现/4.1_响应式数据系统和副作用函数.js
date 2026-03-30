// 1. 副作用函数
// 除了effect之外其地方都可以修改innerText
function effect() {
    document.body.innerText = "hello world";
}

// 修改全局变量，产生副作用
var a = 1;
function effect() {
    a = 2;
}

// 2.响应式数据
const obj = { text: "hello world" };
function effect() {
    document.body.innerText = obj.text;
}
// 目标是修改innertext属性，effct函数重新执行
obj.text = "update text";