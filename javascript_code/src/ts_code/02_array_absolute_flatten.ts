/**
 * @description 数组完全铺平，使用forEach
 * @author everywang
 */

export function arrAllFlatten1(arr: any[]): any[] {
  let res: any[] = [];

  arr.forEach(item => {
    if (Array.isArray(item)) {
      const flattenItem = arrAllFlatten1(item);
      flattenItem.forEach(x => {
        res.push(x);
      })
    } else {
      res.push(item);
    }
  });

  return res;
}

/**
 * @description 数组完全铺平，使用concat
 * @author everywang
 */

export function arrAllFlatten2(arr: any[]): any[] {
  let res: any[] = [];

  arr.forEach(item => {
    if (Array.isArray(item)) {
      const flattenItem = arrAllFlatten2(item);
      res = res.concat(flattenItem);
    } else {
      res.push(item);
    }
  });

  return res;
}

// 功能测试
const arr = [1, 2, 3, [4, 5, [6, 7]]];
console.log(arrAllFlatten1(arr));

const arr1 = [1, 2, 3, [4, 5, [6, 7, [8]]]];
console.log(arrAllFlatten2(arr));

