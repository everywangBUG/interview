// 1. 当副作用函数effect执行的时候，触发字段obj.text的读取操作
// 2. 修改obj.text时，触发字段obj.text的设置操作

// 目标，拦截一个对象的读取和设置操作，解决方式：把effect放到一个”桶“里面

// 存储副作用函数的bucket = new Set()
const bucket = new Set();

const data = { text: "hello world" };
const obj = new Proxy(data, {
    // 拦截读取操作
    get(target, key) {
        // 副作用函数effect添加到储存副作用函数的桶里面
        bucket.add(effect);
        // 返回属性值
        return target[key];
    },
    // 拦截设置操作
    set(target, key, newVal) {
        // 设置属性值
        target[key] = newVal;
        // 把副作用函数从桶里面取出来执行
        bucket.forEach(fn => fn());
        // 返回true代表操作设置成功
        return true;
    }
});

// 测试
function effect() {
    document.body.innerText = obj.text;
}

effect();

setTimeout(() => {
    obj.text = "set new Value"
}, 2000);