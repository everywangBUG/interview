const promise = new CancelablePromise((resolve, reject) => {
    setTimeout(() => {
        resolve('成功结果');
    }, 2000)
})

promise.then(result => {
    console.log('成功', result);
}).catch((error) => {
    if (CancelablePromise.isCancelError(error)) {
        console.log('Promise被取消了');
    } else {
        console.log('失败', error);
    }
})

setTimeout(() => {
    Promise.cancel('用户取消了操作');
}, 10000);

class CancelablePromise {
    constructor(executor) {

    }

    then (onFullfilled, onRejected) {

    }

    catch(onRejected) {

    }

    finally(onFinally) {

    }

    cancel(reason) {

    }

    isCanceled() {

    }

    onCancel(callback) {

    }

    static resolve(value) {

    }

    static all(promises) {

    }

    static race(promises) {

    }

    static isCancelError(error) {
        
    }
}