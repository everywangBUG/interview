/** 
 * @description 数组扁平化test
 * @author everywang
 */
import { flatten1, flatten2 } from "./01_array_layer_flatten";

describe("数组扁平化", () => {
  test("flatten1空数组", () => {
    const res = flatten1([]);
    expect(res).toEqual([]);
  });
  test("flatten1非嵌套数组", () => {
    const arr = [1, 2, 3, 4, 5];
    const res = flatten1(arr);
    expect(res).toEqual([1, 2, 3, 4, 5]);
  });
  test("flatten1一级嵌套数组", () => {
    const arr = [1, 2, 3, [4, 5]];
    const res = flatten1(arr);
    expect(res).toEqual([1, 2, 3, 4, 5]);
  });
  test("flatten1二级嵌套数组", () => {
    const arr = [1, 2, 3, [4, 5, [6, 7]]];
    const res = flatten1(arr);
    expect(res).toEqual([1, 2, 3, 4, 5, [6, 7]]);
  });

  test("flatten2空数组", () => {
    const res = flatten2([]);
    expect(res).toEqual([]);
  });
  test("flatten2非嵌套数组", () => {
    const arr = [1, 2, 3, 4, 5];
    const res = flatten2(arr);
    expect(res).toEqual([1, 2, 3, 4, 5]);
  });
  test("flatten2一级嵌套数组", () => {
    const arr = [1, 2, 3, [4, 5]];
    const res = flatten2(arr);
    expect(res).toEqual([1, 2, 3, 4, 5]);;
  });
  test("flatten2二级嵌套数组", () => {
    const arr = [1, 2, 3, [4, 5, [6, 7]]];
    const res = flatten2(arr);
    expect(res).toEqual([1, 2, 3, 4, 5, [6, 7]]);
  });
});