import _ from "lodash";
import "./style.css";
import Icon from "./icon.png";
// import { Print } from "./print.js";

function component() {
  const element = document.createElement("div");

  element.innerHTML = _.join(["Hello", "webpack"], " ");
  element.classList.add("hello");
  // element.onclick = Print.bind(null, "Hello World!");

  const img = new Image();
  img.src = Icon;

  element.appendChild(img);

  return element;
}

document.body.appendChild(component());
