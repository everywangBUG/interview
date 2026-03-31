## 非原始值的响应式方案

### 6.1_ref

* 使用一个非原始的值包裹原始值
  ```javascript
    const wrapper = {
      value: "vue"
    };

    const name = reactive(wrapper);
    name.value // vue
    name.value = "vue3" // 触发响应vaue3
  ```

    * 用户为了创建一个响应式的原始值，必须创建一个包裹对象
    * 包裹对象由用户创建，不规范，可以使用`wrapper.value`，`wrapper.val`

* 封装一个`ref`函数
  ```javascript
    function ref(val) {
      const wrapper = {
        value: val
      }
      return reactive(wrapper);
    }
  ```

* 区分`ref`和非`ref`值
  ```javascript
    function ref(val) {
      const wrapper = {
        value: val
      }

      // 使用Object.defineProperty在wrapper对象上定义一个不可枚举的属性__v_isRef，并且值为true
      Object.defineProperty(wrapper, "__v_isRef", {
        value: true
      })
      
      return reactive(wrapper);
    }
  ```

### 6.2_响应式丢失的问题
* 展开运算符会导致响应式丢失
  ```javascript
    export default {
      setup() {
        const obj = reactive({ foo: 1, bar: 2 });

        return {
          ...obj
        }
      }
    }

    // 响应式丢失
    <template>{{obj}} {{bar}}</template>
  ```

* 解决方法：封装toRef批量转换
  ```javascript
    const newObj = {
      foo: {
        get value() {
          return obj.foo;
        }
      },
      bar: {
        get Value() {
          return obj.bar;
        }
      }
    }
    function toRef(obj, key) {
      const wrapper = {
        get value() {
          return obj[key];
        }
      }

      return wrapper;
    }
    
    const newObj1 = {
      foo: toRef(obj, "foo");
      bar: toRef(obj, "bar");
    }

    function toRefs = {
      const ret = [];
      for (const key in obj) {
        // 调用toRef进行转换
        ret[key] = toRef(obj, key);
      }

      return ret;
    }

    // 只读的ref属性
    function toRef(obj, key) {
      const wrapper = {
        get Value() {
          return obj[key];
        },

        // 允许设置值
        set Value(val) {
          obj[key] = val;
        }
      }

      Object.defineProperty(wrapper, "__v_isRef", {
        value: true
      })

      return wrapper;
    }
  ```
  
### 6.3_自动脱离ref
* 脱离通过属性value访问ref值
  ```javascript
    function ProxyRefs(target) {
      return new Proxy(target, {
        get(target, key, receiver) {
          const value = Reflect.get(target, key, receiver);
          // 自动脱离ref，如果是ref，返回value值
          return value.__v_isRef ? value.value : value;
        },
        set(target, key, newValue, receiver) {
          // 通过target读取真实值
          const value = target[key];
            // 如果值是ref，设置对应的value属性值
          if (value.__v_isRef) {
            value.value = newValue;
            return true;
          }
          return Reflect.set(target, key, newValue, receiver);
        }
      })
    }

    // 调用proxyRefs函数创建代理
    const newObj = proxyRefs({...toRefs(obj)});

    // 使用reactive也可以自动脱离ref
    const count = ref(0);
    const obj = reactive({ count });
    obj.count // 0
  ```