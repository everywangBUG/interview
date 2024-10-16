/*
 * 旋转数组 K 步：使用pop和unshift
 * @param arr
 * @param K 
 * @returns arr
 * 时间复杂度：O(n^2)
 * 空间复杂度：O(1)
*/
export function whirlArr(arr: number[], k: number): number[] {
    const length = arr.length
    if (!k || arr.length === 0) return arr
    let step = Math.abs(k % length)
    while (step) {
        let temp = arr.pop()
        if (temp != null) {
            arr.unshift(temp)//数组是一个有序的结构unshift操作慢
        }
        step--
    }
    return arr
}
//功能测试
let arr1 = [1, 2, 3, 4, 5, 6, 7]
console.log(whirlArr(arr1, 3))

/*
 * 旋转数组 K 步：使用slice和concat
 * @param arr
 * @param k
 * @returns arr
 * 时间复杂度：O(1)
 * 空间复杂度：O(n)
*/
export function whirlArr1(arr: number[], k: number): number[] {
    const length = arr.length
    if (!k || arr.length === 0) return arr
    let step = Math.abs(k % length)
    let r1 = arr.slice(-step)
    let r2 = arr.slice(0, step)
    return r1.concat(r2)
}
//功能测试
let arr2 = [2, 4, 6, 8, 10, 12]
console.log(whirlArr1(arr2, 3))

//单元测试可以使用jest(官网)，保证程序健壮性

//性能测试
let arr = [...Array(100000).keys()]
console.time("whirlArr")
whirlArr(arr, 9 * 10000)
console.timeEnd("whirlArr")//1.401s

let arr3 = [...Array(100000).keys()]
console.time("whirlArr1")
whirlArr1(arr3, 9 * 10000)
console.timeEnd("whirlArr1")//1.903ms
