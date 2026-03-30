// 拦截删除属性操作
const obj = { foo: 1 };
const p = new Proxy(obj, {
    deleteProperty(target, key) {
        return Reflect.deleteProperty(target, key);
    }
})

console.log(p.foo);
delete p.foo;
console.log(p.foo); // 未定义