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
/**
 * 判断是否相等
 * @param {*} a
 * @param {*} b
 * @return {boolean}
 * 
 */
function isEqual(a, b) {
    // 基本类型的比较
    if (a === b) return true;

    // 处理NaN
    if (Number.isNaN(a) && Number.isNaN(b)) return true;

    // 类型不同返回false
    if (typeof a !== typeof b) return false;

    // 处理null和undefined
    if (a === null || b === null) return a === b;

    // 处理数组
    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) return false;
        for(let i = 0; i < arr.length; i++) {
            if (!isEqual(arr[i], b[i])) return false;
        }
        return true;
    }

    // 处理对象
    if (typeof a === 'object' && typeof b === 'object') {
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);

        if (keysA.length !== keysB.length) return false;

        for (const key of keysA) {
            if (!isEqual(a[key], b[key])) return false;
        }
        return true;
    }
    
    return false;
}

/**
 * 接收一个comparator比较器，调用arr和values的元素，结果从arr中返回
 * @param {array} arr
 * @param {array} values
 * @param {function} comparator
 * @return res
 */
function differenceWith(arr, values, comparator) {
    if (!Array.isArray(arr)) return [];
    if (!Array.isArray(values)) return [...arr];

    if (typeof comparator !== 'function') {
        return difference(arr, values);
    }

    const res = [];
    for (let i = 0; i < arr.length; i++) {
        let shouldInclude = true;
        for (let j = 0; j < arr.length; j++) {
            if (comparator(arr[i], values[j])) {
                shouldInclude = false;
            }
        }
        if (shouldInclude) {
            res.push(arr[i]);
        }
    }
    return res;
}

const objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
differenceWith(objects, [{ 'x': 1, 'y': 2 }], isEqual); // [{ 'x': 2, 'y': 1 }]
```



#### drop

```javascript
/**
 * 创建一个切片数组，去除array的前面n个元素(n的默认值为1)
 * @param {array} arr
 * @param {number} n
 */
function drop(arr, n = 1) {
    if (n >= arr.length) {
        return [];
    }
    if (n < 0) {
        return [...arr]
    }
    return arr.slice(n, arr.length);
    
    // return arr.slice(n)
}

drop([1, 2, 3]); // [2, 3]
drop([1, 2, 3], 2); // [3]
drop([1, 2, 3], 5); // []
drop([1, 2, 3], 0); // [1, 2, 3]
```



#### dropRight

```javascript
/**
 * 创建一个切片数组，去除array尾部的n个元素。（n默认值为1。）
 * @param {array} arr
 * @param {number} n
 */
function dropRight(arr, n) {
    if (n) {
        return arr;
    }
    return arr.slice(-n);
}

dropRight([1, 2, 3]); // [1， 2]
dropRight([1, 2, 3], 2); // [1]
dropRight([1, 2, 3], 5); // []
dropRight([1, 2, 3], 0); // [1, 2, 3]
```



#### dropRightWith

```javascript
/**
 * 从数组尾部开始，移除所有满足predicate的元素，直到遇到第一个不满足的元素为止，并返回。predicate会传入3个参数： (value, index, array)。
 * @param {array} arr
 * @param {Function} predicate
 */
function dropRightWhile(arr, predicate) {
    if (!Array.isArray(arr)) return [];

    if (predicate === undefined) predicate = ((v) => v);
    
    // predicate为函数
    if (typeof predicate === 'function') {
        const end = arr.findLastIndex((value, index, array) => {
            return !predicate(value, index, array);
    	})
        return arr.slice(0, end + 1);
    }

    // predicate为对象
	if (Object.prototype.toString.call(predicate) === '[object Object]') {
        for (let key in predicate) {
            const end = arr.findLastIndex((value, index, array) => {
                for (let k in value) {
                    return value[k] !== predicate[key];
                }
            })
            return arr.slice(0, end + 1);
        }
    }

    // predicate为数组键值对类型
    if (Array.isArray(predicate)) {
        const end = arr.findLastIndex((value, index, array) => {
            const [predicateKey, predicateValue] = predicate;
            for (let key in value) {
                if (key === predicateKey) {
                    return value[key] !== predicateValue;
                }
            }
        })
        return arr.slice(0, end + 1);
    }
    
    // predicate为字符串
    if (typeof predicate === 'string') {
        predicate = (obj, index, arr) = > obj[predicate];
        const end = arr.findLastIndex((value, index, array) => {
            return !predicate(value, index, array)
        })
        return arr.slice(0, end + 1);
    }
}

const users = [
  { 'user': 'barney',  'active': true },
  { 'user': 'fred',    'active': false },
  { 'user': 'pebbles', 'active': false }
];
dropRightWhile(users, { 'user': 'pebbles', 'active': false }); // ['barney', 'fred']
dropRightWhile(users, function(o) { return !o.active; }); // ['barney']
dropRightWhile(users, ['active', false]); // ['barney']
dropRightWhile(users, 'active'); // ['barney', 'fred', 'pebbles']
```

