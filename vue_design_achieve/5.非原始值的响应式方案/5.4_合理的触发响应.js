const obj = { foo: 1 };

const p = new Proxy(obj, {
  set(target, key, newVal, receiver) {
    // 先获取旧值
    const oldVal = target[key];

    const type = Object.prototype.hasOwnProperty.call(target, key) ? "SET" : "ADD";
    const res = Reflect.set(target, key, newVal, receiver);
    // 比较新的值与旧的值，如果不全等，并且都不是NaN的时候才触发响应
    if (oldVal !== newVal && (oldVal === oldVal || newVal === newVal)) {
      trigger(target, key, type);
    }
    return res;
  }
})

// reactive函数
function reactive() {
  return new Proxy(obj, {
    
  });
}