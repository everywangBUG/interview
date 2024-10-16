// 要求: 产出一个数组, 将输入数组转化为二层树状结构, 把parendId为0的输入项添加到输出数组第一层，每个节点的children存放的是parentId与该节点的id相同。

// 注意: 二层结构, children中的项不再有children
function transformToTree(input) {
  const tree = [];

  // Build map to store items by id
  const itemsById = {};
  input.forEach((item) => {
    itemsById[item.id] = { ...item, children: [] };
  });

  // Build tree
  input.forEach((item) => {
    if (item.parentId === 0) {
      tree.push(itemsById[item.id]);
    } else if (itemsById[item.parentId]) {
      itemsById[item.parentId].children.push(itemsById[item.id]);
    }
  });

  return tree;
}

// Example usage:
const input = [
  { id: 1, parentId: 0, name: 'Parent 1' },
  { id: 2, parentId: 0, name: 'Parent 2' },
  { id: 3, parentId: 1, name: 'Child 1-1' },
  { id: 4, parentId: 1, name: 'Child 1-2' },
  { id: 5, parentId: 2, name: 'Child 2-1' },
  { id: 6, parentId: 2, name: 'Child 2-2' }
];

const output = transformToTree(input);
console.log(output);
const itemList = [
  {
    id: 4,
    paramName: '供应链属性',
    parentId: 0
  },
  {
    id: 2,
    paramName: '供应链属性',
    parentId: 4
  },
  {
    id: 5,
    paramName: '供应链属性',
    parentId: 0
  },
  {
    id: 6,
    paramName: '供应链属性',
    parentId: 5
  }
];

console.log(transformToTree(itemList))

/**
 * 说明：
 *   写个转换函数，把一个JSON对象的key从下划线形式（Pascal）转换到小驼峰形式（Camel）
 * 示例：
 *   converter({"a_bc_def": 1}); // 返回 {"aBcDef": 1}
 */

/**
  * @param {object} obj
  * @return {object}
  */
function converter(obj) {
  /* 功能实现 */
  if (obj instanceof Array) {
    return obj.map((val) => {
      return converter(val);
    });
  } else if (obj instanceof Object) {
    return Object.keys(obj).reduce((result, key) => {
      const camelCaseKey = key.replace(/_([a-z/A-Z])/g, (match, p1) => p1.toUpperCase());
      const value = obj[key];
      result[camelCaseKey] = converter(value);
      return result;
    }, {});
  }
  return obj;
}

//功能测试
let o = { "a_bc_def": 1 }
let o1 = { "first_name": "Jhon" }
console.log(converter(o))
console.log(converter(o1))


// 不使用数组的 arr.flat() API，自己实现一个数组拍平函数，需要支持任意层级

/**
 * @param {array} arr
  * @return {array}
  */

function flatArray(arr) {
  let res = [];

  function flatten(array) {
    array.forEach(item => {
      if (Array.isArray(item)) {
        flatten(item);
      } else {
        res.push(item);
      }
    });
  }
  flatten(arr);
  return res;
}

//功能测试1
const arr1 = [1, [2, [3, 4]], 5];
console.log(flatArray(arr1))

//功能测试2
const arr2 = [[1, 2], 3, [1, 3, 5, [7]], 10]
console.log(flatArray(arr2))


// 实现一个方法，检查一个 npm 包的依赖项中有没有存在循环依赖。

// 不用考虑版本，只考虑包名即可
// 入参 pkgs 为项目中所有的依赖（包括子依赖）
// 返回 boolean
// pkg 数据结构即为 package.json 内容的数组, 如有三个包 a、b、c 则入参为：
/**
  * @param {JSON} pkgs
  * @return {boolean}
  */

function hasCircularDependency(pkgs) {
  //映射包中数据和依赖到Map中
  const dependencies = new Map();
  pkgs.forEach((pkg) => {
    dependencies.set(pkg.name, new Set(Object.keys(pkg.dependencies || {})));
  });

  //检查是否有循环依赖
  function checkCircularDependency(pkg, visited) {
    if (visited.has(pkg)) {
      return true;
    }
    visited.add(pkg)
    const dependenciesSet = dependencies.get(pkg)
    for (const dependency of dependenciesSet) {
      if (checkCircularDependency(dependency, visited)) {
        return true
      }
    }
    visited.delete(pak)
    return false
  }

  //检查每个包中的是否有循环依赖
  for (const [pkg, denpendenciesSet] of dependencies) {
    if (checkCircularDependency(pkg, new Set())) {
      return true
    }
  }

  return false
}

//测试用例1
const pkg = [
  { "name": "a", "dependencies": { "b": "^1.0.0.1" } },
  { "name": "b", "dependencies": { "c": "^1.1.0.1" } },
  { "name": "c", "dependencies": { "a": "^1.1.1.1" } },
]
console.log(hasCircularDependency(pkg))

//测试用例2
const pkg1 = [
  { "name": "a", "dependencies": { "b": "^1.0.0.1" } },
  { "name": "b", "dependencies": { "c": "^1.1.0.1" } },
  { "name": "c", "dependencies": { "a": "^1.1.1.1" } },
]
console.log(hasCircularDependency(pkg1))