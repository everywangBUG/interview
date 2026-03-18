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