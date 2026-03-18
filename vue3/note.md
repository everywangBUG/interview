# Vue3特性

## Vue响应式陷阱

1. 解构失效，Vue3中可以使用toRefs函数传入解决结构赋值丢失响应的问题
2. 新增属性Vue2中会丢失，Vue3中不会
3. ref对象的整体替换，会触发Vue的重新渲染，其他地方引用了旧的state.value，会断联
4. Vue2中使用数组索引复制会导致响应式丢失，Vue3中不会，推荐使用`splice(start, deleteCount, item)`
5. ref和reactive混用

```javascript
const count = ref(1);
const state = reactive({ count });

state.count++; // 可以更新，不推荐
```

## Vue响应式原理

1. 为什么要副作用函数

- Proxy的局限，能够监听到数据变了，但是不知道通知谁去更新
- 需要建立**数据->依赖它的副作用函数的映射关系**

1. 副作用函数核心思路

- **收集依赖（track）**: 当effect读取某个属性的时候，把它登记到属性的依赖集合里
- **派发更新（trigger）**：当属性变化的时候，从依赖集合里面找到所有相关的effect，依次重新执行

1. 依赖收集（track）的过程

- 什么时候发生？在某个副作用执行期间，如果读取了响应式数据，就把副作用记录到对应数据的依赖集合里面
- 目的：建立**响应式数据 -> 副作用函数**的映射关系，副作用指的使那些产生副作用的函数，比如修改全局变量、读取dom元素修改属性
- 关键点：只有在**activeEffect**的情况下，才会把依赖收集起来

1. 派发更新（trigger）的过程

- 什么时候发生？当某个响应式数据被修改的时候，找到它的依赖集合，把里面的副作用函数全部执行一遍
- 目的：让用过“这个数据的地方”重新运行，从而使视图更新或者执行其他的逻辑
- 关键点：精准的触发，只更新受影响的副作用

## Vue响应式执行的流程

1. effect(render)

- 设置`activeEffect = render`
- 执行render的时候读取`state.count => track`把`render`存到`count`的依赖集合

2 修改`state.count`

- 触发`Proxy`的`set => trigger`从`count`的依赖集合取出`render`执行

## 依赖追踪的实现

1. 初始化两个关键的变量

- `activeEffect`: 当前正在运行的副作用函数
- `bucket`: 依赖收集，使用一个`WeakMap`弱集合收集依赖

1. `effect`的作用

- 临时把fn标记为当前活跃副作用
- 执行fn，触发track
- 收集完后清空`activeEffect`
  ```javascript
  function effect() {
    activeEffect = fn;
    fn(); // 执行的时候触发 get，收集依赖
    activeEffect = null;
  }
  ```

1. `get`捕获器

- 如果有`activeEffect`，说明当前副作用依赖这个属性，按**target => key => Set**结构，把副作用登记到`bucket`中

```javascript
const state = new Proxy(
  { count: 0 },
  {
    get(t, k) {
      if (activeEffect) {
        let deepMap = bucket.get(t);
        if (!deepMap) bucket.set(t, (deepMap = new Map()));
        let deps = depsMap.get(k);
        if (!deps) depsMap.set(k, (deps = new Set()));
        deeps.add(activeEffect);
      }
      return t[k];
    },
  },
);
```

1. `set`捕获器

- 数据变化的时候，找到依赖它的副作用集合
- 依次执行这些副作用函数，更新视图逻辑

```javascript
    set(t, k, v) {
        t[k] = v;
        const depsMap = bucket.get(t);
        if (!depsMap) return;
        const effects = depsMap.get(k);
        effect && effect.forEach(fn => fn());
        return true;
    }
```

## Vue响应式更新和React状态更新的比较

- 问题：一个组件下面有很多子组件，如果其中第三个个子组件更新，vue会精准的更新第三个，兄弟组件不影响，react父组件一更新，所有的子组件都会更新

1. 更新的范围

- 

