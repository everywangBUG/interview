<div>
  <span>hello world</span>
</div>;

// 纯命令式的纯编译的过程
const div = document.createElement("div");
const span = document.createElement("span");
span.innerText = "hello world";
div.appendChild(span);
document.body.appendChild(div);
