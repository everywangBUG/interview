import _ from "lodash";
import "./style.css";
import Icon from "./icon.png";
// import { Print } from "./print.js";
import Data1 from './data.xml';
import Data2 from './data.csv';

function component() {
  const element = document.createElement("div");

  element.innerHTML = _.join(["Hello", "webpack"], " ");
  element.classList.add("hello");
  // element.onclick = Print.bind(null, "Hello World!");

  const img = new Image();
  img.src = Icon;
  element.appendChild(img);

  console.log(Data1);
  console.log(Data2);

  return element;
}

document.body.appendChild(component());
