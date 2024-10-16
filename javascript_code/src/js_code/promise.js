function resolvePromise(promise, x) {
    // TODO:

};

function rejectPromise() {
    // TODO:
};

function isFunction() {
    // TODO:
};


// 定义一个promise状态的对象
const stateMap = {
    PENDDING: 'pending',
    FULFILLED: 'fulfilled',
    REJECTED: 'rejected'
};

class MyPromise {
    constructor(executor) {
        // 初始状态为pendding
        this.state = "pending";
        // 成功状态的初始值赋undefined
        this.value = undefined;
        // 失败状态的初始值赋undefined
        this.reason = undefined;
        // 当前promise调用then，promise中的onFulfilled
        this.fulfilledCbs = [];
        // 当前promise调用then，promise中的onRejected
        this.rejectedCbs = [];
        executor(
            (value) => {
                resolvePromise(this, value);
            },
            (reason) => {
                rejectPromise(this, reason);
            }
        )
    };

    then(onFulfilled, onRejected) {
        // promise1没有决议不能进行到下一步
        const promise1 = this;
        // then方法的实现主要根据promise1的状态决定
        const promise2 = new Promise(() => { });
        // 对promise的三种状态进行处理
        // 如果是fulfilled状态的处理
        if (promise1.state === stateMap.FULFILLED) {
            // 判断promise2不是function的情况
            // 把promise1的value传入到onFulfilled中，then是一个异步的过程，需要使用setTimeout进行包裹，放在下一个事件循环中使用
            setTimeout(() => {
                // onFulfilled可能不是一个函数，也可能执行出错，使用try...catch捕获错误
                try {
                    const x = onFulfilled(promise1.value);
                    // 根据x的值做出决议
                    resolvePromise(promise2, x);
                } catch (err) {
                    rejectPromise(promise2, err);
                }
            }, 0)
        };
        // 如果是rejected状态的处理
        if (promise1.state === stateMap.REJECTED) {
            // 如果onRejected不是函数
            if (!isFunction(onRejected)) {
                return promise1;
            }
            // 将包装后的function push到fulfilledCbs数组中，在下一个事件循环中执行，包setTimeout
            setTimeout(() => {
                try {
                    promise1.rejectedCbs.push(() => {
                        const x = onRejected(promise1.reason);
                        resolvePromise(promise2, x);
                    })
                } catch (err) {
                    rejectPromise(promise2, err);
                }
            }, 0)
        };
        // 如果是pending状态的处理
        if (promise1.state === stateMap.PENDDING) {
            // 通过function把value透传下去，then的链式调用
            onFulfilled = isFunction(onFulfilled) ? onFulfilled : (value) => { return value };
            onRejected = isFunction(onRejected) ? onRejected : (err) => { throw err };
            // 将包装后的function push到fulfilledCbs数组中，在下一个事件循环中执行，包setTimeout
            // fulfilledCbs跟随promise1的状态执行，在promise1变为fulfilled状态时执行
            promise1.fulfilledCbs.push(() => {
                setTimeout(() => {
                    try {
                        const x = onFulfilled(promise1.value);
                        resolvePromise(promise2, x);
                    } catch (err) {
                        rejectPromise(promise2, err);
                    }
                }, 0)
            });
            // 不执行就先放在rejectedCbs中
            promise1.rejectedCbs.push(() => {
                setTimeout(() => {
                    try {
                        const x = onRejected(promise1.reason);
                        resolvePromise(promise2, x);
                    } catch (err) {
                        rejectPromise(promise2, err);
                    }
                }, 0)
            });
        }
        return promise2;
    };
}

// p调用是promise1
const p = new MyPromise(function (resolve, reject) {
    resolve(1);
});

// p.then()调用的方法是promise2
p.then();

MyPromise.resolve(1).then(() => {
    console.log(1);
})
console.log(2);
