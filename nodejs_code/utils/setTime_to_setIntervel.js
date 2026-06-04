function myInterval(func, delay) {
  // 使用闭包来保存定时器的id
  var timeId;
  
  function loop() {
    func();
    timeId = setTimeout(loop, delay);
  }

  timeId = setTimeout(loop, delay);
 
  return {
    clear: function() {
      clearTimeout(timeId)
    }
  }
}

var interval = myInterval(function() {
  console.log("Hello World!");
}, 1000)

// 五秒后清除定时器
setTimeout(function() {
  interval.clear();
}, 5000)