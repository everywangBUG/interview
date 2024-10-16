### 封装对象的三种方式

#### 第一种方式：直接量{}

##### 如何访问对象中的成员
1. 对象名.方法
2. 对象名.属性

###### 问题
* 使用对象的另一个属性名时，报错`xxx is not defined`

###### 原因
* 创建对象时，大括号不形成作用域，也不配合函数形成作用域链，js引擎没有经过程序的允许不会擅自在对象中查找属性

###### 解决办法一
* 写死对象名，一旦对象名修改忘记修改写死的对象名，则`xxx is not defined`，**紧耦合，摒弃**

###### 解决办法二
* 使用this

###### 总结
* 今后，对象中的使用方法中，只要想使用当前对象自己的属性或其他方法，使用this

#### 第二种方式：使用new: new Object{}
1. var 对象名 = new Object()，创建空对象
2. 对象名.新属性 = 属性值，强行给对象中添加新属性和方法
3. 对象名.新方法 = function () { this.属性名 }

#### js底层的核心原理，**js所有对象的底层都是关联数组**
1. 存储结构：都是键值对的组合
2. 访问数组成员时的标准写法：对象名/数组名["成员名"] => 简写为:对象名/数组名.成员名
3. 强行给不存在的位置赋值，不会报错，自动添加该属性
4. 强行访问不存在的位置的值，不会报错，返回undefined，`if(对象名.成员名 !== undefined)`，判断一个对象中是否包含某个成员
5. 都可以用for in循环遍历

#### 第三种方式：使用构造函数
* 描述同一类型的所有对象的统一结构的函数
* 可以创建多个相同的结构的对象

##### 使用构造函数两部曲

* 构造函数里面如果return了内容，仅返回return的内容，其他代码失效

1.

  ```javaScript
  function 类型名(形参1, 形参2, ...) {
  this.属性名 = 形参1
  this.xxx = xxx
  this.方法名 = function() { this.属性名 }
  }
  ```
2. var 对象名 = new 类型名(形参1, 形参2)

#### new四部曲
1. 创建一个新的空对象等待
2. 让子对象继承构造函数
3. 调用构造函数，将this指向新对象，通过强行赋值的方式为新对象添加规定的属性
4. 返回新对象的地址

### 继承
#### 问题
* 只要将方法定义在构造函数中，每次new时都会执行function，反复创建相同函数的多个副本，浪费内存

#### 提升性能的做法
1. 不要把方法定义在构造函数中
2. 浪费内存
3. 所有公共的方法都应该集中定义在原型上一份
4. 这样所有的子对象都会共存一份

#### 如何像原型对象中添加共有属性
1. 只能强行赋值
2. 构造函数.prototype.属性名=属性值
3. 构造函数.prototype.方法名=function(){... ...}

##### 结论
1. 通过子对象.访问任何成员时
2. 现在子对象中查找自有的属性
3. 如果子对象没有，js引擎会自动在`__propo__`中的父对象中查找
4. 如果子对象中找到了属性或者方法，和访问子对象的方法一样的调用

#### js中继承都是通过原型对象实现的

#### 为什么父对象叫原型对象(prototype)
* 原型对象可以被clone出来，替所有子对象保存共有属性和方法的父对象叫prototype

##### 内置类型的种类(11种背)
* String Number Boolean
* Function Object
* Math(对象)不能new
* Error
* Array Date RegExp
* global(全局作用域对象),已被window代替

##### 什么是类型
* 每种类型一定有两部分组成(可以new出来和有propotype)
  1. 构造函数：负责创建该类型的子对象
  2. 原型对象：负责为该类型的子对象集中保存共有的属性和方法

#### 什么是原型链
* 由多级父对象逐级继承形成的链式结构成称为原型链
  1. 原型链保存了一个对象可用的所有属性和方法
  2. 控制着属性的和方法的使用顺序(就近原则：先子集后父级)

### 多态
#### 什么是多态
* 同一个函数在不同情况下表现出来的不同的状态

#### 重载overfload
* 同一个函数，输入不同的参数，执行不同的逻辑

#### 重写override
1. 在子对象中定义一个和父对象中的成员同名的自有成员
2. 从父对象继承过来的个别成员不好用时，可以在子对象中定义同名成员，覆盖父对象中的同名成员


### 谈谈你对面向对象的理解
1. 封装：创建对象两种方式
   * 只创建一个对象，使用直接量
   * 如果反复创建多个对象，使用构造函数
2. 继承：所有子对象共有的属性值和方法，都要放在构造函数的原型对象中
3. 多态
   * 重写：只要从父对象中继承过来的方法不好使，可以在子对象中重写同名的成员

### this的八种情况

#### 一、obj.fun()
* this指向.前的obj

#### 二、构造函数中new Fun()
* this指向new创建的新对象

#### 三、原型对象中的this
* 构造函数.prototype.fun = function() { }
1. 哪个对象调用则this指向的哪个对象，不需要看this在什么地方调用
2. 原型对象中的的共有方法将使用"子对象.方法名()"调用
3. 原型对象中的this指向将来调用这个公共函数的.前的那个对象
4. **谁调用指谁**

#### 四、fun()、匿名函数自调、回调函数中的this->window
* 严格模式(usestrict)下，**this->undefined**，这类函数调用时，前边没有·和new 

#### 五、DOM中事件处理的函数中this
* this指向当前正在触发事件的.前的DOM元素对象(不能改成箭头函数，否则指向window)

#### 六、Vue中this默认都指向当前的vue对象

#### 七、箭头函数中的this
* 箭头函数中的this指向当前函数之外的最近的作用域中的this
* 几乎所有的匿名函数可以用箭头函数简化
* 箭头函数是对大多数匿名函数的简写
* **箭头函数可以让内外的this保持一致** 

##### this使用结论
1. 如果函数中不包含this，或者刚好希望函数内的this与外部的this保持一致，可以改为箭头函数
2. 如果不希望函数内的this与函数外的this保持一致时，不能改为箭头函数(对象的方法，事件的处理函数)
3. ES6中提供了一种不带function的简写
  ```JavaScript
  var 对象名 = {
  属性名: 属性值,
  //方法名: { ...this.属性名... }
  方法名() { ...this.属性名... }
  }
  ```
好处：
1. 既省略了function
2. 但是又不等同是箭头函数，不会影响到内部的this

* 箭头函数没有/不是作用域
1. 箭头函数只让this，指向外部作用域的this
2. 而箭头函数内的局部变量，只能在箭头函数中使用，出了箭头函数不能使用
3. 箭头函数依然有作用域

##### 结论：箭头函数本质是.bind
  ```JavaScript
    var lilei = {
      sname: "lilei",
      friends: [ "zhangsan", "lisi", "wangwu"],
      intr: function () {
        // this.friends.forEach(
        //   function(形参一) {
        //     console.log(`${this.sname}知道${形参一}`)
        //   }.bind(this)
        // )等同于
        this.friends.forEach(
          (friend) => {
            console.log(`${this.sname}知道${friend}`)
          }
        )
      }
    }
    lilei.intr()
  ```

* call无法替换箭头函数中的this

#### 八、用call或apply临时替换
* 可以用call或apply，临时 替换一次函数中的this
* 可以用bind，永久的替换函数中的this

##### 替换this的三种情况
* call做了三件事
  1. 立即调用一次.前的函数
  2. 自动将.前的函数中的this替换为指定的新对象
  3. 可以向调用的函数中传入实参值

  ```JavaScript
    function salaryCalc(base, salary1, salary2) {
      console.log(`${this.name}的工资是:${base + salary1 + salary2}`)
    }

    var Lilei = { name: "Lilei" }
    var Hmm = { name: "Han MeiMei"}

    //使用bind
    var calc2 = salaryCalc.bind(Lilei)
    calc2(1000, 5000, 2000)

    //使用call
    salaryCalc.call(Lilei, 1000, 2000, 3000)
    salaryCalc.call(Hmm, 3000, 2000, 3000)

    var arr = [900, 2000, 3000]
    salaryCalc.apply(Lilei, arr)

    //bind创建了一个和salaryCalc()一样的函数，并永久将Lilei的替换this，也可以绑定部分的实参值
    //`${Lilei.name}的工资是:${base + salary1 + salary2}`
    var calc3 = salaryCalc.bind(Lilei, 1000)
    calc3(8000, 9000)
  ```

* call不能打散数组，arr只能传给第一个形参base，后两个形参接到的都是undefined
* apply可以先拆散数组，再分别传给函数的形参变量

* bind做两件事
* var 新函数 = 原函数.bind(替换this的对象)
   1. 创建一个和原函数一样的新函数副本
   2. 永久替换新函数中的this为指定对象

### js中创建对象的十种方式
1. new Object()，步骤太多
2. 字面量：var 对象名={}，反复创建多个对象，代码冗余
3. 工厂函数
  ```javaScript
  function createPerson(name, age) {
    var o = new Object()
    o.name = name
    o.age = age
    o.sleep = function() {
      alert(this.name)
    }
    return o
  }
  var p1 = createPerson("zhansan", 11)
  ```
  无法根据对象的原型对象准确判断对象的类型
4. 构造函数方式，如果构造函数中包含方法，则浪费内存
5. 原型对象方式：先创建完全相同的对象，再给子对象添加个性化属性，无法修改原型对象上的属性，而是“偷偷”在子对象上添加自由属性
6. 混合模式：先创建完全相同的对象，再给子对象添加自由属性
  ```javaScript
    function Person(name, age) {
      this.name = name,
      this.age = age
    }
    Person.prototype.say = function () {
      console.log(this.name, this.age)
    }
    var p1 = new Person("zhanggsan", 18)
    var p2 = new Person("lisi", 19)
    console.log(p1)
    console.log(p2)
  ```
  不符合面向对象封装的思想
7. 先创建相同的对象，再给子对象添加个性化属性
  ```javaScript
    function Person(name, age) {
      this.name = name,
      this.age = age
      if (Person.prototype.say === "undefined") {
        Person.prototype.say = function () {
          console.log(this.name, this.age)
        }
      }
    }
    var p1 = new Person("zhanggsan", 18)
    var p2 = new Person("lisi", 19)
    console.log(p1)
    console.log(p2)
  ```
  语义不符，if只在创建第一个对象时有作用
8. 寄生构造函数
  ```JavaScript
    function Person(name, age) {
      this.name = name,
      this.age = age
      if (Person.prototype.say === "undefined") {
        Person.prototype.say = function () {
          console.log(this.name, this.age)
        }
      }
    }
    function Student(name, age, className) {
      var p = new Person(name, age)//借鸡生蛋
      p.className = className
      return p
    }
    var p1 = new Student("zhanggsan", 18, "初三二班")
    var p2 = new Student("lisi", 19, "高二三班")
    console.log(p1)
    console.log(p2)
  ```
9. ES6 Class
  ```javaScript
  class Student{
    constructor(name, age) {
      this.name = name
      this.age = age
    }
    intr() {
      console.log(`${this.name}, I'm${this.age}`)
    }
  }
  var zhangsan = new Student("zhangsan", 13)
  console.log(zhangsan)
  ```
  本质：新瓶装旧酒，底层依然是原型对象
10. 稳妥的构造函数：闭包，不用this，不用new
  ```javaScript
  function Student2(name, age) {
    var p = {}
    p.getName = function() { return name }
    p.setName = function(value) { name = value }
    p.getAge = function() { return age }
    return p
  }
  var p1 = Student2("zhangsan", 11)
  var p2 = Student2("lisi", 13)
  p1.setName("wangwu")
  console.log(p1.getName(), p1.getAge())
  console.log(p1)
  console.log(p2)
  ```
  容易造成内存泄露

### 继承一共有七种方式
#### 原型链式继承
  ```javaScript
    //定义一个父类型
    function Animal(name) {
      this.name = name
      this.run = function() {
        console.log(`I'm${this.name}`)
      }
    }
    //原型对象方法
    Animal.prototype.eat = function(food) {
      console.log(this.name + "在吃：" + food)
    }
    function Cat() {
      Cat.prototype = new Animal()
      Cat.prototype.name = "cat"
    }
    var cat = new Cat()
    console.log(cat)
  ```

#### 构造函数继承
  ```javaScript
    function Animal(name) {
      this.name = name
      this.run = function() {
        console.log(`I'm${this.name}`)
      }
    }
    //原型对象方法
    Animal.prototype.eat = function(food) {
      console.log(this.name + "在吃：" + food)
    }
    function Cat(name, age) {
      Animal.call(this.name)
      this.age = age
    }
    var cat = new Cat()
    console.log(cat)
  ```

#### 实例继承
  ```javaScript
  function Animal(name) {
      this.name = name
      this.run = function() {
        console.log(`I'm${this.name}`)
      }
    }
    //原型对象方法
    Animal.prototype.eat = function(food) {
      console.log(this.name + "在吃：" + food)
    }
    function Cat(name, age) {
      //先创建子类类型实例
      var o = new Animal(name)
      o.age = age
      return o
    }
    var cat = new Cat()
    console.log(cat)
  ```

#### 拷贝继承
  ```javaScript
  function Animal(name) {
      this.name = name
      this.run = function() {
        console.log(`I'm${this.name}`)
      }
    }
    //原型对象方法
    Animal.prototype.eat = function(food) {
      console.log(this.name + "在吃：" + food)
    }
    function Cat(name, age) {
      //先创建子类类型实例，把animal里面的属性复制到Cat中
      var animal = new Animal(name)
      for (var p in animal) {
        Cat.prototype[p] = animal[p]
      }
      this.age = age
    }
    var cat = new Cat()
    console.log(cat)
  ```

#### 组合继承
  ```javaScript
  function Animal(name) {
      this.name = name
      this.run = function() {
        console.log(`I'm${this.name}`)
      }
    }
    //原型对象方法
    Animal.prototype.eat = function(food) {
      console.log(this.name + "在吃：" + food)
    }
    function Cat(name, age) {
      Animal.call(this.name)
      this.age = age
    }
    Cat.prototype = new Animal()
    Cat.prototype.constructor = Cat
    var cat = new Cat()
    console.log(cat)
  ```

#### 寄生组合式继承
  ```javaScript

  ```
#### ES6 class extends继承