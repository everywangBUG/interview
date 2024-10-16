//使用Worker()构造函数，生成Worker线程，把主线程中的任务转移到web worker子线程中
const myWorker = new Worker("fileLoad.js")
worker.postMessage("Hello World!")
worker.onmessage = function (e) {
  console.log("Received message" + e.data)
  doSomething()
}

function doSomething() {
  worker.postmessage("Work done!")
}