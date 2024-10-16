/**
 * @description Plain object数组对象去重
 * @param {*} arr 
 * @returns newArr
 */
//js版本
function removeSameArrayJS(arr) {
  let newArr = [...arr]
  for (let i = 0; i < newArr.length; i++) {
    for (let j = i + 1; j < newArr.length; j++) {
      if (isEqualJS(newArr[i], newArr[j])) {
        newArr.splice(j, 1)
        j--
      }
    }
  }
  return newArr
}

//判断参数是否为对象(js)
const isObjectJS = (val) => typeof val === 'object' && val !== null
function isEqualJS(val1, val2) {
  if (isObjectJS(val1) && isObjectJS(val2)) {
    //拿到第一个对象和第二个对象的所有属性名
    const keys1 = Object.keys(val1)
    const keys2 = Object.keys(val2)
    //属性的数量长度不同返回false
    if (keys1.length !== keys2.length) {
      return false
    }
    //属性的数量相同，循环任何一个属性名的数组
    for (const k of keys1) {
      //如果属性keys2中的属性不在keys1中，返回false
      if (!keys2.includes(k)) {
        return false
      }
      //如果这个属性在两个对象中都有，递归比较，不一样返回false
      if (!isEqualJS(val1[k], val2[k])) {
        return false
      }
    }
    return true
  } else {
    return val1 === val2
  }
}

//功能测试
const arr = [
  { a: 1, b: 2 },
  { b: 2, a: 1 },
  { a: 1, b: 2, c: { a: 1, b: 2 } },
  { b: 2, a: 1, c: { b: 2, a: 1 } }
]
console.log(removeSameArrayJS(arr))