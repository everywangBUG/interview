/**
 * @description 使用递归使得数组完全铺平
 * @author everywang
 */

import { arrAllFlatten1, arrAllFlatten2 } from "./02_array_absolute_flatten";

describe("数组完全铺平", () => {
  test("arrAllFlatten1空数组", () => {
    const res = arrAllFlatten1([]);
    expect(res).toEqual([]);
  });
  test("arrAllFlatten非嵌套数组", () => {
    const arr = [1, 2, 3, 4]
    const res = arrAllFlatten1(arr);
    expect(res).toEqual([1, 2, 3, 4]);
  });
  test("arrAllFlatten1一级嵌套数组", () => {
    const arr = [1, 2, [3, 4]]
    const res = arrAllFlatten1(arr);
    expect(res).toEqual([1, 2, 3, 4]);
  });
  test("arrAllFlatten1二级嵌套数组", () => {
    const arr = [1, 2, [3, 4, [5, 6]]]
    const res = arrAllFlatten1(arr);
    expect(res).toEqual([1, 2, 3, 4, 5, 6]);
  });
  test("arrAllFlatten1多级嵌套数组", () => {
    const arr = [1, 2, [3, 4, ["a", 6, [true, 8]]]]
    const res = arrAllFlatten1(arr);
    expect(res).toEqual([1, 2, 3, 4, "a", 6, true, 8]);
  });

  test("arrAllFlatten2空数组", () => {
    const res = arrAllFlatten2([]);
    expect(res).toEqual([]);
  });
  test("arrAllFlatten2非嵌套数组", () => {
    const arr = [1, 2, 3, 4]
    const res = arrAllFlatten2(arr);
    expect(res).toEqual([1, 2, 3, 4]);
  });
  test("arrAllFlatten2级嵌套数组", () => {
    const arr = [1, 2, [3, 4]]
    const res = arrAllFlatten2(arr);
    expect(res).toEqual([1, 2, 3, 4]);
  });
  test("arrAllFlatten2二级嵌套数组", () => {
    const arr = [1, 2, [3, 4, [5, 6]]]
    const res = arrAllFlatten2(arr);
    expect(res).toEqual([1, 2, 3, 4, 5, 6]);
  });
  test("arrAllFlatten2多级嵌套数组", () => {
    const arr = [1, 2, [3, 4, ["a", 6, [true, 8]]]]
    const res = arrAllFlatten2(arr);
    expect(res).toEqual([1, 2, 3, 4, "a", 6, true, 8]);
  });
})