/**
 * @description 使用reduce铺平数组
 * @param {Array} arr 数组
 * @param {Number} depth 深度
 */
function flatArray(arr, depth = 1) {
  return arr.reduce((pre, cur) => Array.isArray(cur) && depth > 0 ? pre.concat(flatArray(cur, depth -1)) : pre.concat(cur), [])
}

console.log(flatArray([1, 2, 3, [4, 5, [6, 7, [8, 9]]]]))
console.log(flatArray([1, 2, 3, [4, 5, [6, 7, [8, 9]]]], 2))
console.log(flatArray([1, 2, 3, [4, 5, [6, 7, [8, 9, [10, 11, [12, 14]]]]]], Infinity))
console.log(flatArray([1, 2, 3, [4, 5, [6, 7, [8, 9, [10, 11, [12, 14]]]]]], 1))

/**
 * @description 使用foreach铺平数组
 * @param {Array} arr 数组
 * @param {Number} depth 深度
 */
function flatArray1(arr, depth = 1) {
  let res = []
  arr.forEach(item => {
    if (Array.isArray(item) && depth > 0) {
      res = res.concat(flatArray1(item, depth - 1))
    } else {
      res.push(item)
    }
  })
  return res
}
console.log(flatArray1([1, 2, 3, [4, 5, [6, 7, [8, 9]]]], Infinity), 'placeholder')
