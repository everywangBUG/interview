/**
 * @description 平铺数组
 * @param {Array} arr 数组
 * @param {Number} depth 平铺层级
 */
function flatArray(arr, depth = 1) {
  // return arr.reduce((pre, cur) => pre.concat(Array.isArray(cur) ? flatArray(cur) : cur), []);
  return arr.reduce((pre, cur) => pre.concat(Array.isArray(cur) && depth > 1 ? flatArray(cur, depth - 1) : cur), [])
}

const arr = [1, 2, [3, 4, [5, 6, [7, 8]]]];
console.log(flatArray(arr, 3));

/**
 * @description 平铺数组的第二种写法
 * @param {*} arr 
 * @param {*} depth 
 */
function flatArray1(arr, depth = 1) {
  const res = [];
  // 闭包
  (function flat(arr, depth) {
    arr.forEach(item => {
        if (Array.isArray(item) && depth > 0) {
          flat(item, depth - 1)
        } else {
          res.push(item)
        }
      })  
   })(arr, depth);

  //  function flat(currentArr, currentDepth) {
  //   arr.forEach(item => {
  //       if (Array.isArray(item) && currentDepth  > 0) {
  //         flat(item, currentDepth - 1)
  //       } else {
  //         res.push(item)
  //       }
  //     })  
  //  }

  // flat(arr, depth)

  return res;
}

const arr1 = [1, 2, [3, 4, [5, 6, [7, 8]]]];
console.log(flatArray1(arr1, 0), '0');
console.log(flatArray1(arr1, 1), '1');
console.log(flatArray1(arr1, Infinity), 'Infinity');