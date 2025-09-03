#### chunk

```javascript
/**
 * 将数组按指定的大小分割成多个子数组
 * @param {array} arr
 * @param {number} size
 * @return {array} res
 */
function chunk(arr, size = 1) {
	if (typeof size !== 'number' || arr.length <= 0) {
        return [];
    }
    
	let res = [];
	for (let i = 0; i < arr.length; i++) {
        const start = i * size;
        const end = start + size;
        if (start > arr.length) {
            return res;
        }
        res.push(arr.slice(start, end));
    }
    return res;
}

const arr = ['a', 'b', 'c', 'd'];
chunk(arr, 2);
chunk(arr, 3);
chunk(arr, 'number');
```



#### compact

```javascript
/**
 * 过滤数组中的假值，js中假值有false、0、''、null、undefined、NaN 
 * @param {array} arr
 * @return {array} res
 */
function compact(arr) {
    if (!Array.isArray(arr)) {
        return [];
    }
    return arr.filter(val => Boolean(val));
}

const arr = ['a', 'b', false, 0, null, undefined, '', NaN];
compact(arr); // ['a', 'b']
```



#### difference

```javascript
/**
 * 创建一个唯一值的arr，每个值中不包含给定的第二个参数数组中的值
 * @param {array} arr
 * @param {array} values
 * @return {array} res
 */
function difference(arr, values) {
    
}
diffrence(difference([3, 1, 2], [4, 2])); // [3, 1]
```

