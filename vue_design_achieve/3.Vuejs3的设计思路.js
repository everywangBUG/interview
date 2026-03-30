// 3.1 声明式的描述ui

// 3.2 初识渲染器
const vNode = {
  tag: "div",
  props: {
    onClick: () => alert("hello"),
  },
  children: "click me",
};

function renderer(vNode, container) {
  // 使用vNode.tag作为标签名创建DOM元素
  const el = document.createElement(vNode.tag);

  // 便利vNode.props，将属性、事件添加到DOM元素
  for (const key in vNode.props) {
    // 如果key以on开头，说明是事件
    if (/^on/.test(key)) {
      el.addEventListener(
        key.substr(2).toLowerCase(), // 事件名称 onClick ===> onclick
        vNode.props[key], // 事件处理函数
      );
    }
  }

  if (typeof vNode.children === "string") {
    const text = document.createTextNode(vNode.children);
    el.appendChild(text);
  } else if (Array.isArray(vNode.children)) {
    obj.children.forEach((child) => renderer(child, el));
  }

  // 挂载到container节点上
  container.appendChild(el);
}

// 3.3 组件的本质
function renderer(vNode, container) {
  if (typeof vNode.tag === "string") {
    mountedElement(vNode, container);
  } else if (typeof vNode.tag === "function") {
    mountComponent(vNode, container);
  }
}

function mountedElement(vNode, container) {
  // 使用vNode.tag作为标签名创建DOM元素
  const el = document.createElement(vNode.tag);

  // 便利vNode.props，将属性、事件添加到DOM元素
  for (const key in vNode.props) {
    // 如果key以on开头，说明是事件
    if (/^on/.test(key)) {
      el.addEventListener(
        key.substr(2).toLowerCase(), // 事件名称 onClick ===> onclick
        vNode.props[key], // 事件处理函数
      );
    }
  }

  if (typeof vNode.children === "string") {
    const text = document.createTextNode(vNode.children);
    el.appendChild(text);
  } else if (Array.isArray(vNode.children)) {
    obj.children.forEach((child) => renderer(child, el));
  }

  // 挂载到container节点上
  container.appendChild(el);
}

function mountComponent(vNode, container) {
  const subtree = vNode.tag();
  renderer(subtree, container);
}

// 3.4 模版的工作原理
