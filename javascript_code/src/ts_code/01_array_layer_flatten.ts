/**
 * @description 数组扁平化第一层，使用forEach
 * @author everywang
 */

export function flatten1(arr: any[]): any[] {
  let res: any[] = [];

  arr.forEach(item => {
    if (Array.isArray(item)) {
      item.forEach(x => res.push(x));
    } else {
      res.push(item);
    }
  })
  return res;
}

export function flatten2(arr: any[]): any[] {
  let res: any[] = [];

  arr.forEach(item => {
    res = res.concat(item);
  })
  return res;
}

// 功能测试1
const arr = [1, 2, [3, 4]];
console.log(flatten1(arr));

//功能测试2
const arr1 = [1, 2, [2, 3, [4, 5]]];
console.log(flatten2(arr1));