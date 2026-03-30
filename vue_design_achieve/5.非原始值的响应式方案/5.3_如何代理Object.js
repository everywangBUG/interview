// 使用has实现对in操作符的拦截
const obj = { foo: 1 };
const p = new Proxy(obj, {
    has (target, key) {
        track(target, key);
        return Reflect.has(target, key);
    }
})

// EnumerateObjectProperties(obj)，返回一个迭代器对象
function* EnumerateObjectProperties(obj) {

}

// 使用ownKeys拦截函数拦截Reflect.ownKeys操作
