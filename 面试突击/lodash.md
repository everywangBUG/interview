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



#### differenceBy

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
 * 判断两个对象是否相等
 * @param {Object} obj1
 * @param {Object} obj2
 */
function isObjectEqual(obj1, obj2) {
    if (obj1 === obj2) {
        return true;
    }
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
	if (Object.keys(obj1).length !== Object.keys(obj2).length) {
        return false;
    }
    for (let key in keys1) {
        if (!keys1.include(key) || !isObjectEqual(obj1[key], obj2[key])) {
            return false;
        }
    }
    return true;
}

/**
 * arr和values中通过迭代器iteratee，返回值进行比较
 * @param {array} arr
 * @param {array} values
 * @param {array|function|Object|string} iteratee
 * @return {array} res
 */
function differenceBy(arr, values, iteratee = v => v) {
    if (typeof iteratee === 'string') {
        const key = iteratee;
        iteratee = v => v[key];
    }
    const res = [];
    for (let i = 0; i < arr.length; i++) {
		let shouldInclude = true;
        for (let j = 0; j < values.length; j++) {
            if (typeof i === 'object' && typeof j === 'object' && i && j) {
                if (isObjectEqual(i, j)) {
                    shouldInclude = false;
                }
            } else if (sameValueZero(iteratee(arr[i]), iteratee(values[j]))) {
                shouldInclude = false;
            }
        }
        if (shouldInclude) {
            res.push(arr[i]);
        }
    }
    return res;
}
differenceBy([3.1, 2.2, 1.3], [4.4, 2.5], Math.floor); // [3.1, 1.3]
differenceBy([{ 'x': 2 }, { 'x': 1 }], [{ 'x': 1 }], 'x'); // [{ 'x' : 2 }]
```



#### differenceWith

```javascript
function differenceWith() {
    
}
```

