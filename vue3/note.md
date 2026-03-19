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

1. Vue更新流程

- 数据源：`ref` `reactive`
- 依赖收集：`getter`追踪谁读取了数据
- 触发更新：`setter`通知依赖
- 调度器：**合并、去重**
- 微任务处理：在下一个tick异步更新组件
- 执行patch：对比新旧DOM =>最小化DOM改动
- 最后只更新订阅变更字段的属性

1. React的更新流程

- 数据源：`state`
- 显示调用：`setState`
- 调度器：（事件/异步边界自动处理） [flushSync] <= 强制立即执行Render + Commit
- Render阶段：自上向下构造新树
- Commit阶段：Diff并写入DOM

1. 更新对比

- Vue默认细粒度更新某一项
- React默认是自顶向下收集异步更新，开启memo后可以细粒度的更新某一项

1. Vue常见陷阱

- 结构赋值丢失响应性，使用点语法修改或者toRefs函数
- 直接修改props打破单向数据流，使用emit发送事件通知父组件
- 数组下标改变不会触发响应式

1. React常见陷阱

- 直接改变state，直接使用`state.a = '111'`这样赋值没有改变引用，不会触发更新，使用immutable
- 不稳定引用导致子渲染
- 闭包陷阱

## Vue3生命周期

- 挂载 `onBeforeMount` => `onMounted`
- 更新 `onBeforeUpdate` => `onUpdated`
- 卸载 `onBeforeUnmount` => `onUnmount`

## Vue的副作用清理逻辑

- 定时器、订阅数据、请求 => 页面卡顿、数据错乱等

1. 什么时候被清理

- 副作用函数准备下一次重新执行之前
- 组件被卸载

1. 怎么写清理

- 使用`watch`或者`watchEffect`
  - `watch`返回`stop()`，可以手动停止
  - 在组合式函数里面使用`onScopeDispose`，组件销毁的时候自动清理
- 定时器/订阅：谁创建谁清理
- 异步请求：取消旧的请求或者忽略旧结果，防止旧数据覆盖新数据
  - 可以使用`abortContraler`或者 `token`验证法
- `watch`和`watchEffect`的区别



## Vue父子组件通信

1. 父组件如何像子组件通信

- 使用`props`传递数据，子组件通过props获取只读数据，单向的传递
- 类型校验和默认值

1. 子组件如何通知父组件

- 使用`emit(funcctionName, args)`定义一个自定义的函数
- 父组件使用@语法监听子组件发出的自定义事件

1. 如何实现双向绑定

- 使用`v-model`，双向绑定
- 是v-bind和emit的语法糖，简化通信写法

## Vue跨层级通信

- props传递痛点
  - 逐层传递繁琐
  - 代码重复维护难
  - 组件耦合度高

1. Provide

- 父组件中使用`provide(key, value)`

1. Inject

- 任意组件中使用`inject(key, defaultValue)`

1. 实际应用

- 主题切换
- 全局配置
- 国际化
- 用户状态

## 插槽

- 占位符，等待内容填充
- 父组件决定插槽内容
- 子组件定义插入位置

1. 基础插槽
2. 具名插槽

- 子组件

```vue
<script setup>
  const name_slot = `
    <template>
      <div>
        <header>
          <slot name="header"></slot>
        </header>
        <main>
          <slot name="main"></slot>
        </main>
        <footer>
          <slot name="footer"></slot>
        </footer>
      </div>
    </template>
  `
<script>
```

- 父组件

```vue
  <div>
    <template #header>
      <h3>这是头部</h3>
    </template>
    <p>这是内容<p>
    <template #footer>
      <p>这是底部信息<p>
    </template>
  </div>
```

1. 作用域插槽

- 插槽内容里面访问不到子组件数据？
- 该用哪个组件的数据？
- 作用域定义
  - 内容归属于父组件
  - 插槽是模版占位
- 父组件

```vue
  <template>
    <ChildrenComponent>
      <p>父组件消息：{{ parentMsg }}</p>
      <!-- 普通插槽 -->
      <template>
        <p>插槽内容：{{ parentMsg }}</p>
      </template>

      <!-- 作用域插槽 -->
      <template #default="slotProps">
        <div>
          <p>作用域插槽：{{ parentMsg }}</p>
          <p>子组件数据：{{ slotProps.childData }}</p>
          <p>子组件方法：{{ slotProps.childMethod() }}</p>
        </div>
      </template>
    </ChildrenComponent>
  </template>
  <script setup>
    import { ref } from 'vue'
    import ChildrenComponent from './Components';

    const parentMsg = ref('来自父组件的消息');
    return { parentMsg };
  </script>
```

- 子组件

```vue
  <template>
    <p>子组件数据：{{ childrenData }}<p>
    <!-- 通过slot中绑定属性和方法把数组暴露给父组件 -->
    <slot :childData="childData" :childMethod="childMethid"></solt>
  </template>
  <script setup>
    const childData = ref('子组件数据');
    return { childData };
  </script>
```

1. 设计模式

- 明确数据归属
  - 插槽内容用的谁的数据，使用了子组件的数据要使用作用域插槽
  - 子组件数据如何传递给父组件，通过slot属性绑定
- 避免作用域污染
- 保持组件独立

## Vue路由

1. 什么是路由

- 路由是页面url和组件之间映射关系

1. 使用Vue优势

- 无需刷新整个页面，页面流畅
- url和内容是同步的，方便用户分享和收藏
- 能在实现丰富的动画效果

1. 跳转方式

- 声明式导航
  - `<router-link to="/ablut">关于</router-link>`
- 编程式导航
  - router.push("/about")
- router-link用法
  - 使用`use`注册路由到Vue应用中
  - router-view位置确认
  - 基础配置检查

### Vue-Router三种传参方式

- 路由传参痛点
  - 页面传递数据太多
  - 传参方式容易混淆

1. 动态路由：URL路径参数
  - 路径：/user/:id
  - 获取：$router.params.id
2. 查询字符串：URL问号参数
  - 路径：/search?q=vue&page=1
  - 获取：$route.query.q

- 动态路由：资源标志
- 查询字符串：筛选条件

1. 复杂的组件使用Props传参：组件属性解耦

### Vue-router路由守卫

1. 全局守卫
  - 全局前置守卫`beforeEach((to, from, next) => { if (to.meta.requiresAyth) { nex('/login') } })`
  - 导航出发时执行：权限控制、登录验证
  - 可中断导航：重定向等
2. 路由独享守卫

```vue
  {
    path: '/admin',
    component: Admin,
    beforeEnter: (to, from, next) => {
      if (isAdmin()) {
        next()
      } else {
        next('/login');
      }
    }
  }
```

1. 组件内部守卫

- beforeRouteEnter 进入前
- beforeRouteUpdate 更新前
- beforeRouteLeave 离开前

### Vue-Router元信息

- 配置方式
```javascript
  const routes = [
    {
      path: '/admin',
      component: Admin,
      meta: { requiresAuth: true }
    }
  ]
```
- 访问方式
  - 通过`route.meta`对象访问
  - 全局守卫中访问`to.meta`
  - 组件内部通过`$route`访问

- 场景
  - 动态设置页面标题
  - 避免存储敏感信息
  - 缓存配置

## Pinia

### 创建和使用Pinia
- 如何创建store
```javascript
  import { defineStore } from 'pinia'

  export const useCounterStore = defineStore('counter', {
    state: () => ({
      count: 0
    }),
    actions: {
      increment() {
        this.count++;
      }
    }
  })
```


- 如何使用store

```javascript
  import { useCounterStore } from './stores/counter';

  const store = useCounterStore();
  store.increment();
  console.log(store.count);
```

### Pinia的三个核心概念
1. state：数据仓库
2. actions：处理业务逻辑，支持异步操作
3. getters：计算属性，缓存优化，类似于`computed`

### Pinia最小可变痛点

- 精准变更数据
  - 不要全量替换对象
  - 使用Object.assign或者对象拓展运算符 

- 避免级联更新
- 提升应用性能

## Vue自定义指令

1. 指令定义：`app.directive()`

2. 局部注册：`directives`选项

3. 基本语法：勾子函数对象

## Vue模版编译流程

1. 什么是模版
  - Vue在运行的时候无法理解.vue中的模版语法，需要将其编译成javascript代码
  - 为什么需要编译

2. 三个编译阶段
  - 解析：模版 -> AST抽象语法树
  - 优化：静态标记，标记哪些节点是静态的不变，后续在视图更新时跳过
  - 渲染：优化好的AST后渲染函数
  - 减少Diff开销

## Vue Diff算法

1. 虚拟DOM痛点
  - 需要高效对比
  - 直接对比的话时间复杂度O(n3)太太慢
  - 需要优化算法

2. 核心原理
  - 同层级节点比较
  - 不跨层级比较节点
  - 双端优化算法
  - 时间复杂度O(n)

3. patch过程
  - 创建：新节点不存在
  - 删除：旧节点存在
  - 更新：新旧节点不同
  - 移动：通过key值优化

4. key值的作用
  - 唯一的标志节点
  - 避免无效操作
  - 提升复用效率
  - 减少DOM操作

## nextTick

1. nextTick的作用
  - 等待DOM更新后执行
  - 解决异步更新的问题
  - 确保数据同步完成

2. 性能优化
  - 批量操作优化
  - 避开重复渲染
  - 提升页面性能

3. 适用场景
  - DOM操作
  - 状态同步
  - 性能优化
