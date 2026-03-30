// 上节缺点：如果effect函数名变了，无法收集副作用

// 解决办法：使用一个全局变量储存被注册的副作用函数
let activeEffect;
// 定义effect函数用于注册副作用函数，将副作用函数赋值给全局变量随后执行
function effect(fn) {
    activeEffect = fn;
    fn();
}

// effect的使用
const bucket = new Set();

const data = { text: "hello world" };
const obj = new Proxy(data, {
    // 拦截读取操作
    get(target, key) {
        // 副作用函数effect添加到储存副作用函数的桶里面
        if (activeEffect) {
            bucket.add(activeEffect);
        }
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

// effect的使用
effect(
    () => {
        console.log('effect run'); // 打印2次
        document.body.innerText = obj.text;
    }
)

setTimeout(() => {
    // 没有存在的值也可以在副作用函数中执行
    obj.noExist = "helle Vue3";
}, 2000)

// 问题：没有在副作用函数与被操作的目标字段之间建立明确的关系，被监听的对象上赋值新的不存在的属性可以触发effect执行
// 如何解决？树形结构，每个对象对应一个副作用函数，修改不同对象的值触发对应的副作用函数

const bucket1 = new WeakMap(); // 存储副作用函数的桶
const obj1 = new Proxy(data, {
    // 拦截操作
    get(target, key) {
        // 没有activeEffect，直接返回return 值
        if (!activeEffect) {
            return target[key];
        }

        // 根据target从桶中获取depsMap，是一个Map类型，key => effects
        let depsMap = bucket1.get(target);

        // 如果不存在depsMap，新建一个Map和target相关联
        if (!depsMap) {
            bucket1.set(target, (depsMap = new Map()));
        }

        // 再根据key从depsMap中取得deps，是 一个set类型，里面存储了当前key相关联的副作用函数effects
        let deps = depsMap.get(key);

        // 如果deps不存在，新建一个Set和key相关联
        if (!deps) {
            depsMap.set(key, (deps => new Set()));
        }

        // 最后将当前激活的副作用函数添加到桶里面
        deps.add(activeEffect);

        // 返回属性值
        return target[key];
    },
    set(target, key, newVal) {
        // 设置属性值
        target[key] = newVal;
        // 根据target从桶中获得depsMap，是key => effects
        const depsMap = bucket1.get(target);
        if (!depsMap) return;
        // 根据key值取得所有副作用函数
        const effects = depsMap.get(key);
        effects && effects.forEach(effect => effect());
    }
})

// 封装track和trigger函数
const obj2 = new Proxy(data, {
    get(target, key) {
        track(target, key);
        return target[key];
    },
    set(target, key, newVal) {
        target[key] = newVal;
        trigger(target, key);
    }
})

function track(target, key) {
    // 没有activeEffect，直接返回return 值
    if (!activeEffect) {
        return target[key];
    }

    // 根据target从桶中获取depsMap，是一个Map类型，key => effects
    let depsMap = bucket1.get(target);

    // 如果不存在depsMap，新建一个Map和target相关联
    if (!depsMap) {
        bucket1.set(target, (depsMap = new Map()));
    }

    // 再根据key从depsMap中取得deps，是 一个set类型，里面存储了当前key相关联的副作用函数effects
    let deps = depsMap.get(key);

    // 如果deps不存在，新建一个Set和key相关联
    if (!deps) {
        depsMap.set(key, (deps => new Set()));
    }

    // 最后将当前激活的副作用函数添加到桶里面
    deps.add(activeEffect);
}

function trigger (target, key) {
    // 根据target从桶中获得depsMap，是key => effects
    const depsMap = bucket1.get(target);
    if (!depsMap) return;
    // 根据key值取得所有副作用函数
    const effects = depsMap.get(key);
    effects && effects.forEach(effect => effect()); 
}