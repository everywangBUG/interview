const path = require("node:path");
const fs = require("fs");

function depsAnalyzer(directory = __dirname) {
  const items = fs.readdirSync(directory);

  if (!items.includes("package.json")) {
    throw new Error("当前目录没有package.json，请重新选择目录");
  }

  const res = {};
  const dependencies = [];

  // 读取指定目录中的或者当前目录中的package.json
  items.forEach((it) => {
    if (it === "package.json") {
      // 列出所有的dependencies和devDependencies
      const content = fs.readFileSync(`${directory}/package.json`, "utf8");
      const parsedContent = JSON.parse(content);
      Object.keys(parsedContent).forEach((val) => {
        // console.log(parsedContent["dependencies"]);
        console.log(val);
        dependencies.push(parsedContent["dependencies"]);
        res["dependencies"] = dependencies;
        // res["dependencies"] = parsedContent["dependencies"].sort((con) =>
        //   con.localeCompare(),
        // );
        // const totalLength =
        //   Object.keys(parsedContent["dependencies"]).length +
        //   Object.keys(parsedContent["devDependencies"]).length;
        // res["依赖数量"] = totalLength;
      });
    }
  });

  return res;
}

depsAnalyzer("D:\/web_development\/mini-react");
