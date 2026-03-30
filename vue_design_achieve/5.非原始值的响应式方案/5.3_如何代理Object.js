// 使用has实现对in操作符的拦截
const obj = { foo: 1 };
const p = new Proxy(obj, {
  has(target, key) {
    track(target, key);
    return Reflect.has(target, key);
  },
});

// EnumerateObjectProperties(obj)，返回一个迭代器对象
function* EnumerateObjectProperties(obj) {
  const visited = new Set();
  for (const key of Reflect.ownKeys(obj)) {
    if (typeof key === "symbol") continue;
    const desc = Reflect.getOwnPropertyDescriptor(obj, key);
    if (desc) {
      visited.add(key);
      if (desc.enumerable) yield key;
    }
  }
  const proto = Reflect.getPrototypeOf(obj);
  if (proto === null) return;
  for (const protoKey of EnumerateObjectProperties(proto)) {
    if (!visited.has(protoKey)) yield protoKey;
  }
}

// 使用ownKeys拦截函数拦截Reflect.ownKeys操作
const obj1 = { foo: 1 };
const ITERATE_KEY = Symbol();
const p1 = new Proxy(obj, {
  ownKeys(target) {
    track(target, ITERATE_KEY);
    return Reflect.ownKeys(target);
  },
});