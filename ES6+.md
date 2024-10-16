## ES6
### ES6箭头函数
#### 箭头函数中的arguments
* 箭头函数中不能使用arguments
* 箭头函数中使用剩余参数代替arguments

#### 箭头函数使用场景
1. 构造函数不能使用
2. 对象的方法不能使用
3. 原型对象的方法不能使用
4. DOM中事件处理函数不能使用
5. 箭头函数中无法使用call、apply、bind，因为箭头函数本质是bind绑定this
6. 箭头函数不支持arguements

#### ES6+展开运算符
```javascript
    const arr = [1, 3, 4, 5, 6]
    const maxNum1 = Math.max.apply(Math, arr)
    const mamxNum2 = Math.max(...arr)
```

#### 三个点的使用
1. 复制一个数组
```javascript
    var arr1 = [1, 3, 5]
    var arr2 = [...arr1]
```
2. 合并多个数组
```javascript
    var arr1 = [1, 2, 5]
    var arr2 = [1, 3, 6]
    var arr3 = [...arr1, 2, ...arr2]
```
3. clone一个对象
```javascript
    var zhangsan = { name: "zhangsan", age: 14}
    var zhangsan2 = {...zhangsan}
```
4. 合并多个属性(与数组类似)
5. 数组解构和对象结构 

### class和继承
#### class中的属性和方法
* class中的方法放在原型对象上
* class中的属性放在子对象上，无法一次创建多次使用
* 如果想一次创建，多次使用，加static，静态属性则放在构造函数上

#### class中的extends和super
* class中的extends只能继承父类型的原型对象
* constructor中的super关键字可以继承父类型中的属性

#### new四部曲
* 创建一个的空对象
* 将this赋值给新对象
* 将函数的显式原型赋值给函数的隐式原型
* 执行函数体
* 返回默认的对象

### Promise
#### 解决回调函数的回调地狱
#### 三种状态
1. pending(挂起)
2. fulfill(完成)
3. rejected(出错)

#### Promise中的.then问题
* 使用await和async

##### 注意事项
1. 只有基于Promise的函数，才执行async和await
2. await必须用在被async标记的函数内
3. 外层函数必须使用async标记。目的是告诉主程序，这段代码是异步执行的，不影响主程序的运行
4. await必须写在一项任务之前，作用等同于.then
5. 使用了await，可以用变量接住resolve()的返回值，后续可以使用
6. await可以多次使用

##### 手写简单的Promise函数
```javascript
    //状态机
    //定义三个状态PENDING、FULFILL、REJECTED
    var PENDING = 0 //等待
    var FULFILL = 1 //成功
    var REJECTED = 3 //失败

    //定义Promise构造函数，将来用new创建Promise对象
    function Promise() {
        //state变量存储当前的Promise对象的执行状态
        var state =  PENDING
    }
        //value变量存储执行成功后的返回值，或执行失败后的错误提示信息
        var value = null

        //定义handlers变量是一个数组，存储将来用.then函数传入的一个或多个后续的任务函数
        var handles = []

    //状态变迁——定义两个底层专门修改状态的函数
    function Promise() {
        //执行成功后，把状态改为成功状态，并把执行结果的返回值放入value中
        function fulfill(result) {
            state = FULFILLED
            value = result
        }
        //执行失败后，把状态改为失败状态，并把错误提示信息，保存在变量value中()
        function reject(err) {
            state = REJECTED
            value = error
        }
    }
        
    //fulfill和reject方法，通常对外开放一个更高级的resolve方法
            
    //实现getThen()函数
    /* 
     * .then()函数中传入的内容有两种情况：可能传入的是下一个Promise对象，也可以直接传入匿名函数
     * 如果调用resolve()时传入的是下一个Promise对象
     * 就返回这个Promise对象的.then()函数
     * 如果调用resolve时传入的是下一个函数，直接返回这个函数
     * 如果调用resolve时什么也没有传，返回null
    */

   //实现doResolve()函数——核心
   /* 
    * 调用传入的.then()函数，并传入执行成功和执行失败两个状态的回调函数
    */

   //定义handler函数

   //为当前的Promise对象添加.done()方法
```