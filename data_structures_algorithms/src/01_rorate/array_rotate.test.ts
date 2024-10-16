/**
 * @description Array rotate test
 * @author everywang 
 */
import test, { it } from "node:test"
import { describe } from "yargs"
import { whirlArr, whirlArr1 } from "./01_array_rotate"

describe("数组旋转", () => {
    test("正常情况", () => {
        const arr = [1, 2, 3, 4, 5, 6, 7]
        const k = 3
        const res = whirlArr(arr, k)
        expect().toEqual()
    })
})

