const arr: object[] = [
  { a: 1, b: 2 },
  { b: 2, a: 1 },
  { a: 1, b: 2, c: { a: 1, b: 2 } },
  { b: 2, a: 1, c: { b: 2, a: 1 } }
]
const newArr: object[] = [...new Set(arr)]//无法去重
console.log(newArr, '无法去重')

/**
 * 
 * @description: 对象数组去重，对象均为Plain Object，只要对象的属性值相同，则表示相同对象
 * @param: 
 * @return:
 */
export function removeSameArray(arr: object[]) {
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

console.log(removeSameArray(arr), '666')
//判断参数是否为对象(js)
const isObject = (val: Object) => typeof val === 'object' && val !== null

/**
 * 判断两个对象是否相同
 * @param val1
 * @param val2 
 */
export function isEqual(val1: object, val2: object) {
  if (val1 === val2) return true
  
  if (!isObject(val1) || !isObject(val2)) return false

  const keys1 = Object.keys(val1)
  const keys2 = Object.keys(val2)
  if (keys1.length !== keys2.length) return false

  for (const key of keys1) {
    // 如果键值不存在，或者值不相等，则返回false
    if (!keys2.includes(key) || !Object.is(val1[key], val2[key])) {
      return false
    }
  }

  return true
}

