const arr: object[] = [
  { a: 1, b: 2 },
  { b: 2, a: 1 },
  { a: 1, b: 2, c: { a: 1, b: 2 } },
  { b: 2, a: 1, c: { b: 2, a: 1 } }
]
const newArr: object[] = [...new Set(arr)]//无法去重
console.log(newArr)

/**
 * 
 * @description: 对象数组去重，对象均为Plain Object，只要对象的属性值相同，则表示相同对象
 * @param: 
 * @return:
 */

function removeSameArray(arr: object[]) {
  let newArr: object[] = [...arr]
  for (let i = 0; i < newArr.length; i++) {
    for (let j = i + 1; j < newArr.length; j++) {
      if (isEqual(newArr[i], newArr[j])) {
        newArr.splice(j, 1)
        j--
      }
    }
  }
  return newArr
}
//判断参数是否为对象(js)
const isObject = (val) => typeof val === 'object' && val !== null
function isEqual(val1: object, val2: object) {

}

