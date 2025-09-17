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

#### dropRightWhile

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

#### dropWhile

```javascript
/**
 * 从数组头部开始，移除所有满足predicate的元素，直到遇到第一个不满足的元素为止，并返回。predicate会传入3个参数： (value, index, array)。
 * @param {array} arr
 * @param {Function} predicate
 */
function dropWhile(arr, predicate) {
   	if (!Array.isArray(arr)) return [];
    
    if (predicate === undefined) predicate = (v) => v;
    
    if (typeof predicate === 'object' && predicate !== null) {
        predicate = (obj, index, arr) => {
        	for (let key in predicate) {
            	if (obj[key] !== predicate[key]) {
                    return false;
                }
        	}
            return true;
        }
    } else if (Array.isArray(predicate)) {
        const [key, value] = predicate;
        predicate = (obj, index, arr) => obj[key] == value;
    } else if (typeof predicate === 'string') {
        const prop = predicate;
        predicate = (obj, index, arr) => obj[prop];
    }
    
    const end = arr.findIndex((value, index, arr) => !predicate(value, index, arr));

	return arr.slice(0, end + 1);
}

const users = [
  { 'user': 'barney',  'active': true },
  { 'user': 'fred',    'active': false },
  { 'user': 'pebbles', 'active': false }
];
dropWhile(users, function(o) { return !o.active; }); // ['pebbles']
dropWhile(users, { 'user': 'barney', 'active': false }); // ['fred', 'pebbles']
dropWhile(users, ['active', false]); // ['pebbles']
dropWhile(users, 'active'); // ['barney', 'fred', 'pebbles']
```

#### fill

```javascript
/**
 * 使用 value 值来填充（替换） array，从start位置开始, 到end位置结束（但不包含end位置）。
 * @param {array} arr
 * @param {*} value
 * @param {number} start
 * @param {number} end
 * @return {array} res
 */
function fill(arr, value, start = 0, end = arr.length) {
    if (!arr || !arr.length) return [];
    
    // 处理类数组对象
    const length = arr.length >>> 0;
    const result = Array.isArray(arr) ? arr : Array.from(arr);

    // 处理start参数
    start = start >> 0; // 转换为整数
    start = start < 0 ? Math.max(length + start, 0) : Math.min(start, length);

    // 处理end参数
    end = end = undefined ? length : end >>0;
    end = end < 0 ? Math.max(length + end, 0) : Math.min(end, length);

    for (let i = start; i < end; i++) {
        arr[i] = value;
    }
    return arr;
    // return arr.fill(value, start, end);
}
const array = [1, 2, 3];
fill(array, 'a'); // ['a', 'a', 'a']
fill(Array(3), 2); // [2, 2, 2]
fill([4, 6, 8, 10], '*', 1, 3) // [4, '*', '*', 10]
```

#### findIndex

```javascript
/**
 * 该方法类似_.find，区别是该方法返回第一个通过 predicate 判断为真值的元素的索引值（index），而不是元素本身。
 * @param {array} arr
 * @param {array|function|object|string} predicate
 * @param {number} fromIndex
 * @return {number} index
 */
function findIndex(arr, predicate, fromIndex) {
    if (!Array.isArray(arr)) return -1;
    
    if (Object.prototype.toString.call(predicate) === '[object Object]') {
        const matcher = predicate;
        predicate = (obj, index, arr) => {
            for (let key in matcher) {
                if (obj[key] === matcher[key]) {
                    return true;
                }
            }
            return false;
		}
    } else if (Array.isArray(predicate)) {
        const [key, value] = predicate;
        predicate = (obj, index, arr) => obj[key] === value;
    } else if (typeof predicate === 'string') {
        const prop = predicate;
        predicate = (obj, index, arr) => obj[prop];
    }
    
	for (let i = 0; i < arr.length; i++) {
        if (predicate(arr[i])) {
            return i;
        }
    }
    
    return -1;
}

const users = [
  { 'user': 'barney',  'active': false },
  { 'user': 'fred',    'active': false },
  { 'user': 'pebbles', 'active': true }
];
findIndex(users, function(o) { return o.user == 'barney'; }); // 0
findIndex(users, { 'user': 'fred', 'active': false }); // 1
findIndex(users, ['active', false]); // 0
findIndex(users, 'active'); // 2
```

#### findLastIndex

```javascript
/**
 * 这个方式类似_.findIndex， 区别是它是从右到左的迭代集合array中的元素。
 * @param {array} arr
 * @param {array|function|object|string} predicate
 * @param {number} fromIndex
 * @return {number} index
 */
function findLastIndex(arr, predicate, fromIndex = arr.length - 1) {
    if (!Array.isArray(arr)) return -1;
    
    if (Object.prototype.toString.call(predicate) === '[object Object]') {
        const matcher = predicate;
        predicate = (obj, index, arr) => {
            for (let key in matcher) {
                if (obj[key] !== matcher[key]) {
                    return false;
                }
            }
            return true;
		}
    } else if (Array.isArray(predicate)) {
        const [key, value] = predicate;
        predicate = (obj, index, arr) => obj[key] === value;
    } else if (typeof predicate === 'string') {
        const prop = predicate;
        predicate = (obj, index, arr) => obj[prop];
    }
    
    const start = fromIndex === undefined ? arr.length - 1 : fromIndex;
    
	for (let i = start; i >= 0; i--) {
        if (predicate(arr[i])) {
            return i;
        }
    }
    
    return -1;
}

const users = [
  { 'user': 'barney',  'active': true },
  { 'user': 'fred',    'active': false },
  { 'user': 'pebbles', 'active': false }
];
findLastIndex(users, function(o) { return o.user == 'pebbles'; }); // 2
findLastIndex(users, { 'user': 'barney', 'active': true }); // 0
findLastIndex(users, ['active', false]); // 2
findLastIndex(users, 'active'); // 0
```

#### flatten

```javascript
/**
 * 减少一级arr的嵌套深度
 * @param {array} arr
 * @return {array} res
 */
function flatten(arr) {
    let res = [];
    for (let i = 0; i < arr.length; i++) {
        if (!Array.isArray(arr[i])) {
            res.push(arr[i]);
        } else {
            res.push(...arr[i]);
        }
    }
    return res;
}
flatten([1, [2, [3, [4]], 5]]); // [1, 2, [3, [4]], 5]
```

#### flattenDeep

```javascript
/**
 * 将array递归为一维数组。
 * @param {array} arr
 * @return {array} res
 */
function flattenDeep(arr) {
    let res = [];
    arr.forEach(item => {
        if (!Array.isArray(item)) {
            res.push(item);
        } else {
            res = res.concat(flattenDeep(item));
        }
    })
    return res;
}
flattenDeep([1, [2, [3, [4]], 5]]);
```

#### flattenDepth

```javascript
/**
 * 根据 depth 递归减少 array 的嵌套层级
 * @param {array} arr
 * @return {array} res
 */
function flattenDepth(arr, depth = 1) {
    if (!Array.isArray(arr) || depth < 1) {
        return arr;
    }
    let res = [];
    arr.forEach(item => {
        if (Array.isArray(item) && depth > 0) {
            res = res.concat(flattenDepth(item, depth - 1));
        } else {
            res.push(item);
        }
    })
    return res;
}
const array = [1, [2, [3, [4]], 5]];
flattenDepth(array, 1); // => [1, 2, [3, [4]], 5]
flattenDepth(array, 2); // => [1, 2, 3, [4], 5]
```

#### fromPairs

```javascript
/**
 * 返回一个由键值对pairs构成的对象
 * @param {pairs} arr
 * @return {object} obj
 */
function fromPairs(pairs) {
    const obj = {};
    for (let i = 0; i < pairs.length; i++) {
        const [key, value] = pairs[i];
        obj[key] = value;
    }
    return obj;
}
fromPairs([['fred', 30], ['barney', 40], ['pebbles', 50]]); // => { 'fred': 30, 'barney': 40 }
```

#### indexOf

```javascript
/**
 * 使用SameValueZero 等值比较，返回首次 value 在数组array中被找到的 索引值， 如果 fromIndex 为负值，将从数组array尾端索引进行匹配。
 * @param {pairs} arr
 * @param {*} value
 * @param {number} fromIndex
 * @return {number} num
 */
function indexOf(arr, value, fromIndex = 0) {
    fromIndex < 0 ? fromIndex = arr.length + fromIndex : fromIndex;

    for(let i = 0; i < arr.length; i++) {
        if (arr[i] === value) {
            return i;
        }
    }
}
indexOf([1, 2, 1, 2], 2) // => 1
indexOf([1, 2, 1, 2], 2, 2); // => 3
```

#### join

```javascript
function join(arr, separator=',') {
    if (!Array.isArray(arr)) {
        return '';
    }

    let res = '';
    for(let i = 0; i < arr.length; i++) {
        if (arr[i] === null || arr[i] === undefined) {
            arr[i] = '';
        }
        res += separator + arr[i];
    }
    return res;
}
join(['a', 'b', undefined, 'c'], '~');
```

#### pull

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
 * 移除数组array中所有和给定值相等的元素，使用SameValueZero 进行全等比较。会改变原数组
 * @param {array} arr
 * @param {*} values
 * @return {number} num
 */
function pull(arr, ...args) {
    for (let i = 0; i < arr.length; i++;) {
        for (let j = 0; j < args.length; j++;) {
            if (sameValueZero(arr[i], args[j])) {
                arr.splice(i, 1);
            }
        }
    }
    return arr;
}

const array = [1, 2, 3, 1, 2, 3];
pull(array, 2, 3) // => [1, 1]
```

#### pullAllBy

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
 * 接受一个 iteratee（迭代函数） 调用 array 和 values的每个值以产生一个值，通过产生的值进行了比较。iteratee 会传入一个参数： (value)。
 * @param {Array} arr 要修改的数组
 * @param {Array} values 要移除值的数组
 * @param {Array|Function|Object|string} iteratee 要移除值的数组
 * @return {Array} arr
 */
function pullAllBy(arr, values, iteratee = v => v) {
    if (typeof iteratee === 'string') {
        const key = iteratee;
        iteratee = v => v[key];
    }
    
    // 倒序遍历避免删除索引问题
    for (let i = arr.length -1; i >= 0; i--) {
        for (let j = 0; j < values.length; j++) {
            if (isEqual(iteratee(arr[i]), iteratee(values[j]))) {
                arr.splice(i, 1);
                // 匹配到了跳出内层循环
                break;
            }
        }
    }
    return arr;
}
const array = [{ 'x': 1 }, { 'x': 2 }, { 'x': 3 }, { 'x': 1 }];
pullAllBy(array, [{ 'x': 1 }, { 'x': 3 }], 'x'); // => [{ 'x': 2 }]
```

#### pullAllWith

```javascript
/**
 * 接受 comparator 调用array中的元素和values比较。comparator 会传入两个参数：(arrVal, othVal)，改变原数组。
 * @param {Array} arr 要修改的数组
 * @param {Array} values 要移除值的数组
 * @param {Function} comparator comparator（比较器）调用每个元素。
 * @return {Array} arr
 */
function pullAllWith(arr, values, comparator) {
    for (let i = arr.length - 1; i >= 0; i--) {
        for (let j = 0; j < values.length; j++) {
            if (isEqual(arr[i], values[j])) {
                arr.splice(i, 1);
                break;
            }
        }
    }
    return arr;
}
const arr = [{ 'x': 1, 'y': 2 }, { 'x': 3, 'y': 4 }, { 'x': 5, 'y': 6 }];
pullAllWith(arr, [{ 'x': 3, 'y': 4 }], isEqual); // => [{ 'x': 1, 'y': 2 }, { 'x': 5, 'y': 6 }]
```

#### pullAt

```javascript
/**
 * 根据索引 indexes，移除array中对应的元素，并返回被移除元素的数组， 改变原数组。
 * @param {Array} arr 要修改的数组
 * @param {number|number[]} indexes 要移除值的数组
 * @return {Array} arr
 */
function pullAt(arr, ...indexes) {
    const indexSet = new Set(indexes)
    const removed = arr.filter((_, index) => indexSet.has(index));
    const remaining = arr.filter((_, index) => !indexSet.has(index));
    arr.length = 0;
    arr.push(...remaining);
    return removed;
}
const array = [5, 10, 15, 20];
const evens = pullAt(array, 1, 3);
console.log(array); // => [5, 15]
console.log(evens); // => [10, 20]
```

#### remove

```javascript
/**
 * 移除数组中predicate返回真值的所有元素，返回移除元素组成的数组，改变原数组
 * @param {Array} arr 要修改的数组
 * @param {Array|Function|Object|string} 迭代函数
 * @return {Array} res
 */
function remove(arr, predicate) {
    if (!Array.isArray(arr)) {
        return [];
    }
    
    let res = [];
    
    if (typeof predicate === 'function') {
        for (let i = arr.length - 1; i >= 0; i--) {
            if (predicate(arr[i])) {
                const removed = arr.splice(i, 1);
                res.unshift(...removed);
            }
        }
    }
    return res;
}
const arr = [1, 2, 3, 4];
const evens = remove(arr, function(n) {
    return n % 2 === 0;
})
console.log(arr); // => [1, 3]
console.log(evens); // => [2, 4]
```

#### reverse

```javascript
/**
 * 反转arr，使得第一个元素变为最后一个元素，第二个元素变为倒数第二个元素，依次类推，改变原数组
 * @param {Array} arr 要修改的数组
 * @return {Array} res
 */
function reverse(arr) {
    const res = [];
    for(let i = arr.length - 1; i >= 0; i--) {
        res.push(arr[i]);
    }
    return res;
}
const array = [1, 2, 3];
reverse(array);
```



#### debounce

```javascript
/**
 * 函数防抖
 * @param {Function} fn 执行的函数
 * @param {number} delay 延迟时间
 */
function debounce( fn, delay) {
    let timer;
    const throttleFn = function(...args) {
		if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            fn.call(this, ...args);
        }, delay);
    }
    return throttleFn;
}
const a = () => console.log(111);
const b = debounce(a, 3000);
b();
```

#### throttle

```javascript
/**
 * 函数节流
 * @param {Function} fn 执行的函数
 * @param {number} time 间隔时间
 */
function throttle(fn, time) {
    let scheduled = false;
    let latestArgs;
    let lastRunTime = 0;
    let timer;
    const throttleFn = function(...args) {
        latestArgs = args;
        // 第一次执行
        if (Date.now() - lastRunTime > time) {
            lastRunTime = Date.now();
            return fn.call(this, ...latestArgs);
        }
        if (!scheduled) { // 没有执行过执行一次
            timer = setTimeout(() => {
                fn.call(this, ...latestArgs);
                scheduled = false;
                lastRunTime = false;
            }, time);
            scheduled = true;
        }
    }
    
    // 立即执行一次
    throttleFn.flush = function() {
        if (latestArgs) {
            clearTimeout(timer);
            scheduled = false;
            lastRuntime = Date.now();
            return fn.call(this, latestArgs);
        }
    }
    
    // 取消方法
    throttleFn.cancel = function() {
        clearTimeout(timer);
        scheduled = false;
    }
   	
    return throttleFn;
}
```

