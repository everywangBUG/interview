// 耗时任务
function calculate(data) {
    let res = 0
    for (let i = 0; i <= 1000000000; i++) {
        res += i;
    }
    console.log("主线程发送的数据:", data)
    return res + data;
}

// 监听主线程发送的信息
self.onmessage = function (event) {
    console.log("接受到了主线程的信息", event.data);
    const res = calculate(event.data);

    // 发送计算的结果给主线程
    self.postMessage(res);
}
