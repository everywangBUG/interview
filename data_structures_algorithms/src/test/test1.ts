debugger
function search(nums: number[], target: number): number {
    //左开右开区间写法
    // let len: number = nums.length
    // let left: number = 0
    // let right: number = len - 1
    // while(left <= right) {
    //     let mid: number = Math.ceil((left + right) / 2)
    //     if(nums[mid] < target) {
    //         left = mid + 1
    //     } else if(nums[mid] > target) {
    //         right = mid - 1
    //     } else {
    //         return mid
    //     }
    // }
    // return -1

    //左闭右开区间写法
    let len: number = nums.length
    let left: number = 0
    let right: number = len - 1
    while(left < right) {
        let mid: number = Math.ceil((left + right) / 2)
        if(nums[mid] < target) { 
            left = mid + 1
        } else if(nums[mid] > target) {
            right = mid
        } else {
            return mid
        }
    }
    return -1
};
console.log(search([7,7,8,9,9,10,13], 9))
