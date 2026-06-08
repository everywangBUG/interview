/**
 * 
 * @param {number} baseValue 
 * @returns {Function} return double or square value
 */
function calculator(baseValue) {
    return function (operationFn) {
        return operationFn(baseValue);
    }
}

function double(x) {
    return x * 2;
}

function square(x) {
    return x * x;
}

const calc = calculator(10);

console.log(calc(double));
console.log(calc(square));


/**
 * 
 * @param {Function} fn 
 * @returns 绑定的函数
 * @description 只执行一次的函数
 */
function once(fn) {
    let called = false;

    return function(...args) {
        if (!called) {
            called = true;
            return fn.apply(this, args)
        }
    }
}

function pay(amount) {
    console.log(`支付了${amount}元`);
}

const payOnce = once(pay);

payOnce(100); // 执行一次
payOnce(200); // 不执行
payOnce(300); // 不执行


// 深拷贝
function isObject(object) {
    return typeof object === "object" && object !== null;
}
function deepClone(source, map = new WeakMap()) {
    if (!isObject(source)) {
        return source;
    }

    if (map.has(source)) {
        return map.get(source);
    }

    let target = Array.isArray(source) ? [] : {};

    map.set(source, target);

    for (let key in source) {
        if (Object.hasOwnProperty.call(source, key)) {
            if (isObject(source[key])) {
                target[key] = deepClone(source[key], map);
            } else {
                target[key] = source[key];
            }
        }
    }

    return target;
}

const obj = { a: 1, b: { c: 2 } };
obj.d = 3;
obj.self = obj; // 循环引用

const clone = deepClone(obj);

clone.b.c = 999;

console.log(clone !== obj);        // true
console.log(clone.b !== obj.b);    // true
console.log(obj.b.c);              // 2
console.log(obj);
console.log(clone);