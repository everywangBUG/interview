## React
### React只做两件事
* 渲染UI
* 响应事件

#### 历史
* 2010-react最初迹象
  * FB引入xhp到php代码中，同年开源
  * XHP允许复合组件，后期引入react中
* 2012年Fu收购Instagram，FB解耦并开源React
* 2013年5月29日至31日，React开始开源

#### 历史版本(重点版本)

##### 虚拟DOM
* React将代码转换为一个JavaScript对象，这个对象再转换为真实的Dom。这JavaScript对象就是所谓的虚拟Dom
* 一个Json数据描述，一个真实Dom的数据模型

#### diff和fiber算法
* 链表是fiberO(n)，diff是树O(n^3)
  
#### React16.0
* 版本虚拟dom跟新采用循环和递归
* 任务一旦开始，无法结束，知道任务就结束，主线程一直被占用
* 导致大量实例存在时，执行效率变低
* 用户交互的动画效果，出现页面卡顿
* 之后版fiber更新后本虚拟DOM不参与diff，

### fiber特性
* 利用浏览器空闲时间执行，不会长时间占用主线程
* 将对比更新dom的操作碎片化
* 碎片化的任务，可以根据需要被暂停

##### 浏览器怎么利用空闲时间执行？
* requestIdleCallback时浏览器提供的API，其利用浏览器空闲时间执行任务
当前任务可以被终止，有限执行更高级别的任务
```javascript
    requestIdleCallback(function(deadline:{
        //deadline.timeRemaining() 获取浏览器的空闲时间
    }))
```

#### fiber属性名
* effects：存储包含自身和所有后代的Fiber数组
* effectTag：标记当前节点需要进行的操作，包含插入、更新、移除等
* child：当前Fiber对象的子集Fiber对象
* sibling：当前Fiber对象的下一级兄弟节点
* alternate：Fiber对象备份，用于对比

### 虚拟DOM和Fiber问题
* react虚拟dom了解吗？
* 了解react fiber吗？
* Fiber的优势是什么？
* FIber怎么做到比之前的渲染要快的？
* 了解react虚拟dom渲染机制吗？

### 生命周期 
#### 16.0之前
* 初始化->挂载->props->初始化state->render->完成
* 获取数据完毕->更新state->diff->render->完成

##### Initialization
* setup props and state

##### Mounting
* componentWillMount -> render -> componentDidMount

##### Updation
* props: componentWillreceiveProps -> shouldComponentUpdate (true)-> componentWillUpdate -> render -> componentDidUpdate
* states: shouldComponentUpdate -> componentWillUpdate -> render -> componentDidUpdate

##### Unmounting
* componentWillUnmount

#### 16.0之后
* 新的生命周期为了迎合fiber的链式数据结构，在render之前能改变属性的方法被移除，只保留了shouldComponentUpdate方法

##### Mounting
* counstructor -> getDerivedStateFromProps -> shouldComponentUpdate(true) -> render -> React更新DOM和refs

##### Updation
* New props/setState()/forceUpdate() -> getDerivedStateProps -> sholldComponentUpdate -> render -> getSnapshotBeforeUpdate -> React更新DOM和refs

##### Unmounting
* componentWillUnmount

### 生命周期问题
* React生命周期
* React生命周期及各个函数的应用
* React16.0前后生命周期的变化
* React对于生命周期函数的变化怎面理解?
* React性能优化(虚拟dom渲染优化)

### diff算法
#### 没有fiber的算法(16.0之前)
* 针对树结构(tree diff)：对UI层的DOM节点跨层级的操作进行忽略
* 针对于组件结构(component diff)：拥有相同类的两个子组件的树形结构，拥有不同类的两个组件会生成不同的属性结构
* 针对元素结构(element diff)：对于同一层级的节点，使用具有唯一性的id区分(key属性)

#### 有fiber之后(16.0之后)
* 通过state计算出新的fiber节点
* 对比节点的tag和key确定属性的操作(修改、删除、新增、移动)
* effectTag标记fiber对象
* 收集所有的标记的fiber对象，形成effectList
* commit阶段一次性处理所有变化的节点

### React源码解析
























