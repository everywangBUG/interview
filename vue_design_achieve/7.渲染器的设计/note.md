## 7.渲染器设计

### 7.1_渲染器和响应式系统的结合
* 使用`VueReactivity`中`effect`和`ref`处理响应式数据
    ```javascript
        const { effect, ref } = VueReactivity
        function renderer(domString, container) {
            container.innerHTML = domString;
        }
        const count = ref(1);

        effect(() => {
            renderer(`<h1>${count.value}</h1>`,
            document.getElementById("app"));
        })

        count.value++;
    ```

### 7.2_渲染器的基本概念

### 7.3_自定义渲染器


