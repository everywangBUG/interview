// 纯运行时的Render函数
const obj = {
  tag: "div",
  children: [{ tag: "span", children: "hello world" }],
};

function Render(obj, root) {
  const el = document.createElement(obj.tag);

  if (typeof obj.children === "string") {
    const text = document.createTextNode(obj.children);
    el.appendChild(text);
  } else if (obj.children) {
    obj.children.forEach((child) => Render(child, el));
  }

  root.appendChild(el);
}

// 纯命令式的纯编译的过程
<div>
  <span>hello world</span>
</div>;

const div = document.createElement("div");
const span = document.createElement("span");
span.innerText = "hello world";
div.appendChild(span);
document.body.appendChild(div);

// Vue.js 3保持了运行时+编译时架构
