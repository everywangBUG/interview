/**
 * @description 两数之和: 给定一个arr和target，找出数组中两数之和等于target的两个数
 * @param {nums} number
 * @param target
 * 时间复杂度：O(n^2)
 * @return arr
 */
export function findTwoNumbers(nums: number[], target: number): number[] {
    const res: number[] = []
    if (nums.length == 0) return res
    for (let i = 0; i < nums.length - 1; i++) {
        let n = nums[i]
        let flag = false

        for (let j = i; j < nums.length; j++) {
            let m = nums[j]
            if (n + m == target) {
                res.push(n)
                res.push(m)
                flag = true
                break
            }
        }
        if (flag) break
    }
    return res
}

//测试用例
// const nums = [1, 3, 5, 7, 10]
// const res = findTwoNumbers(nums, 15)
// console.log(res)

/**
 * @description 双指针解法
 * @param nums 
 * @param target 
 * 时间复杂度：O(n)
 */
export function findTwoNumbers1(nums: number[], target: number): number[] {
    const res: number[] = []
    let l = nums.length
    if (l === 0) return res
    let i = 0
    let j = l - 1
    while (i < j) {
        let n1 = nums[i]
        let n2 = nums[j]
        let sum = n1 + n2

        if (sum < target) {
            i++
        } else if (sum > target) {
            j--
        } else {
            res.push(n1)
            res.push(n2)
            break
        }
    }
    return res
}

//测试用例
const nums = [1, 3, 5, 7, 10, 16, 19, 30, 49, 50, 51, 54, 57, 59, 69, 79, 80, 99, 100, 110, 130, 150, 165, 174, 191, 197]
const res = findTwoNumbers1(nums, 15)
console.log(res)
console.time('findTwoNumbers')
for (let i = 0; i < 100 * 10000; i++) {
    findTwoNumbers(nums, 15)
}
console.timeEnd('findTwoNumbers')//71.578ms

console.time('findTwoNumbers1')
for (let i = 0; i < 100 * 10000; i++) {
    findTwoNumbers1(nums, 15)
}
console.timeEnd('findTwoNumbers1')//63.187ms

/**
 * 
 * @description 给定整数数组和target，找出和为target的两个整数数组下标
 * @param nums 
 * @param target 
 * @returns arrayIndex
 */
export function findTwoNumbersIdx(nums: number[], target: number) {
    let map = new Map()
    for (let i = 0; i < nums.length; i++) {
        if (map.has(target - nums[i])) {
            return [map.get(target - nums[i]), i]
        }
        map.set(nums[i], i)
    }
    return []
}

//功能测试
const arr = [1, 4, 6, 8, 10]
console.log(findTwoNumbersIdx(arr, 12))