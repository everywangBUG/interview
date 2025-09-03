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
 * 数字、字符、布尔值的基本类型与===判断一致，NaN和NaN相等(NaN===NaN为false)，+0和-0相等(Object.is(+0, -0)为false)
 * @param {*} val1
 * @param {*} val2
 */
function sameValueZero(val1, val2) {
    if (typeof val1 === 'number' && typeof val2 === 'number') {
        if (isNaN(val1) && isNaN(val2)) {
            return true;
        }
        if (val1 === 0 && val2 === 0) {
            return true;
        }
    }
    return val1 === val2;
}

/**
 * 创建一个唯一值的arr，每个值中不包含给定的第二个参数数组中的值
 * @param {array} arr
 * @param {array} values
 * @return {array} res
 */
function difference(arr, values) {
    if (!Array.isArray(values)) {
        return [...arr];
    }

    const res = []
    for (let i = 0; i < arr.length; i++) {
        let shouldInclude = true;
        for (let j = 0; j < values.length; j++) {
            if (sameValueZero(arr[i], values[j])) {
                shouldInclude = false;
                break;
            }
        }
        if (shouldInclude) {
            res.push(arr[i]);
        }
    }
    return res;
}
difference(difference([3, 1, 2], [4, 2])); // [3, 1]
```

