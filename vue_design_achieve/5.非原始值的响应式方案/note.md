### 5.1_Proxy和Reflect

- 一个对象分为基本语义和非基本操作
  1. `obj.foo`基本读取操作，`obj.foo++`读取和设置obj对象属性foo的值
  2. `obj.fn()`，对象的复合操作无法拦截

- Reflect
  1. Reflect能够访问一个对象属性的默认行为，第三个参数能指定Receiver，即this

  ```javascript
  const obj = { foo: 1 };
  Reflect.get(obj, "foo", { foo: 2 }); // 2
  ```

- Relect拦截删除属性

  ```javascript
  const obj = { foo: 1 };
  const p = new Proxy(obj, {
    deleteProperty(target, key) {
      // 检查被操作的属性是否是对象自己的属性
      const hasKey = Object.hasOwnProperty.call(target, key);

      // 使用Reflect.deleteProperty完成属性的删除
      const res = Reflect.deleteProperty(target, key);

      if (res && hasKey) {
        // 只有当被删除的属性是自己的属性且删除成功的时候，才触发更新
        trigger(target, key, "DELETE");
      }
      // return Reflect.deleteProperty(target, key);
      return res;
    },
  });
  console.log(p.foo); // 1
  delete p.foo;
  console.log(p.foo); // 未定义
  ```

- 使用`has`拦截`in`操作符

  ```javascript
    const obj = { foo: 1 };
    const p = new Proxy(obj, {
      has(target, key, receiver) {
        track(target, key);
        return Reflect.has(target, key, receiver);
      }
    }
    effect(() => {
      "foo" in obj;
    })
  ```

- 使用`for...in`操作使用`EnumerateObjectProperties`抽象方法实现

  ```javascript
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
  ```

- 使用`ownKeys`拦截`for...in`操作
  ```javascript
  const obj = { foo: 1 };
  const ITERATE_KEY = Symbol();
  const p = new Proxy(obj, {
    ownKeys(target) {
      track(target, ITERATE_KEY);
      return Reflect.ownKeys(target);
    },
  });
  ```

### 5.2_JavaScript和Proxy工作原理

- javascript一切皆对象
- 对象的内部方法（表5.1）

| 内部方法              | 函数签名                                     | 描述 |
| --------------------- | -----------------------------------------   | --- |
| [[GetPrototypeOf]]    | () -> object \| null  | 查明该对象提供继承属性的对象，null代表没有继承 |
| [[SetPrototypeOf]]    | (Object \| null) -> Boolean   | 设置某个对象的属性 |
| [[IsExtensible]]      | () -> Boolean                      | 查明是否允许向该对象添加其他属性 |
| [[PreventExtensions]] | () -> Boolean                                | 控制能否向该对象添加新属性。如果操作成功则返回 true，如果操作失败则返回 false                                                                                                                            |
| [[GetOwnProperty]]    | (propertyKey) -> Undefined                   | Property Descriptor                                                                                                                                                                                      | 返回该对象自身属性的描述符，其键为 propertyKey，如果不存在这样的属性，则返回 undefined |
| [[DefineOwnProperty]] | (propertyKey, PropertyDescriptor) -> Boolean | 创建或更改自己的属性，其键为propertyKey，以具有由PropertyDescriptor 描述的状态。如果该属性已成功创建或更新，则返回true；如果无法创建或更新该属性，则返回 false                                           |
| [[HasProperty]]       | (propertyKey) -> Boolean                     | 返回一个布尔值，指示该对象是否已经拥有键为 propertyKey 的自己的或继承的属性                                                                                                                              |
| [[Get]]               | (propertyKey, Receiver) -> any               | 从该对象返回键为 propertyKey 的属性的值。如果必须运行ECMAScript代码来检索属性值，则在运行代码时使用 Receiver 作为 this 值                                                                                |
| [[Set]]               | (propertyKey, Receiver) -> Boolean           | 将键值为 propertyKey 的属性的值设置为 value。如果必须运行ECMAScript 代码来设置属性值，则在运行代码时使用 Receiver 作为this 值。如果成功设置了属性值，则返回 true；如果无法设置，则返回false              |
| [[Delete]]            | (propertyKey) -> Boolean                     | 从该对象中删除属于自身的键为propertyKey 的属性。如果该属性未被删除并且仍然存在，则返回false；如果该属性已被删除或不存在，则返回 true                                                                     |
| [[OwnPropertyKeys]]   | () -> List of propertyKey                    | 返回一个List，其元素都是对象自身的属性键                                                                                                                                                                 |
| [[Call]]              | (any, a List of any) -> any                  | 将运行的代码与 this 对象关联。由函数调用触发。该内部方法的参数是一个 this 值和参数列表                                                                                                                   |
| [[Constructor]]       | (a List of any, Object) -> Object            | 创建一个对象。通过 new 运算符或 super 调用触发。该内部方法的第一个数是一个 List，该 List 的元素是构造函数调用或 super 调用的参数，第二个参数是最初应用new 运算符的对象。实现该内部方法的对象称为构造函数 |

- 如果一个对象要作为函数调用，必须包含[[Call]]方法
- 常规对象
  1. 对于表 5-1 列出的内部方法，必须使用 ECMA 规范 10.1.x 节给出的定义实现；
  2. 对于内部方法 [[Call]]，必须使用 ECMA 规范 10.2.1 节给出的定义实现；
  3. 对于内部方法 [[Construct]]，必须使用 ECMA 规范 10.2.2 节给出的定义实现。
- 异质对象
  - 所有不符合上面三点的都是异质对象
  -

### 5.3\_如何代理Object

- 使用has实现对in操作符的拦截

  ```javascript
  const obj = { foo: 1 };
  const p = new Proxy(obj, {
    has(target, key) {
      track(target, key);
      return Reflect.has(target, key);
    },
  });
  ```

- 使用ownKeys拦截函数拦截Reflect.ownKeys操作
  ```javascript
  const obj1 = { foo: 1 };
  const ITERATE_KEY = Symbol();
  const p1 = new Proxy(obj, {
    ownKeys(target) {
      track(target, ITERATE_KEY);
      return Reflect.ownKeys(target);
    },
  });
  ```

### 5.4\_合理的触发响应

- 设置相同的值和重复设置NaN的值不触响应

```javascript
const obj = { foo: 1 };

const p = new Proxy(obj, {
  set(target, key, newVal, receiver) {
    // 先获取旧值
    const oldVal = target[key];

    const type = Object.prototype.hasOwnProperty.call(target, key)
      ? "SET"
      : "ADD";
    const res = Reflect.set(target, key, newVal, receiver);
    // 比较新的值与旧的值，如果不全等，并且都不是NaN的时候才触发响应
    if (oldVal !== newVal && (oldVal === oldVal || newVal === newVal)) {
      trigger(target, key, type);
    }
    return res;
  },
});
```
