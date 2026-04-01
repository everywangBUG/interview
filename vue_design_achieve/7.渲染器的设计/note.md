## 7.渲染器设计

### 7.1\_渲染器和响应式系统的结合

- 使用`VueReactivity`中`effect`和`ref`处理响应式数据

  ```javascript
  const { effect, ref } = VueReactivity;
  function renderer(domString, container) {
    container.innerHTML = domString;
  }
  const count = ref(1);

  effect(() => {
    renderer(`<h1>${count.value}</h1>`, document.getElementById("app"));
  });

  count.value++;
  ```

### 7.2\_渲染器的基本概念

### 7.3\_自定义渲染器

- 渲染器函数

  ```javascript
    const vnode = {
      type: "h1",
      children: "hello"
    }

    // 创建一个渲染器
    const renderer = createRenderer();

    // 调用render渲染vnode
    renderer.render(vnode, document.querySelector("#app"));

    const createRenderer() {
      function patch(n1, n2, container) {

      }

      function render(vnode, container) {
        if (vnode) {
          patch(container._node, vnode, container)
        } else {
          if (container._node) {
            container.innerHTML = "";
          }
        }
        container._vnode = vnode;
      }

      return {
        render
      }
    }
  ```
