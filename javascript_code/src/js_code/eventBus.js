class EventBus {
  constructor() {
    // 存储事件和对应的回调函数数组
  }

  on(eventName, callback) {
    // 检查事件名称和回调函数是否有效

    // 如果没有这个事件的订阅数组，创建一个空数组

    // 将回调函数添加到对应事件的数组中

    // 返回一个取消订阅的函数
  }

  once(eventName, callback) {
    // 创建一个包装函数

    // 在包装函数中调用原始回调

    // 执行后取消订阅
  }

  emit(eventName, ...args) {
    // 根据事件名称获取回调函数数组

    // 如果数组存在，便利执行每一个回调函数

    // 传递参数

    // 捕获异常处理
  }

  off(eventName, callback) {
    // 获取时间对应的回调数组

    // 如果没有数组，直接返回

    // 找到并移除对应的回调函数

    // 如果回调数组为空，删除这个事件
  }

  clear() {
    
  }
}

// 简单的易于理解的eventBus
function simpleEventBus() {
  const events = {};

  return {
    on(name, fn) {
      
      if (!events[name]) events[name] = [];
      events[name].push(fn);
    },

    emit(name, data) {
      if (!events[name]) return;
      if (events[name]) {
        events[name].filter(fn => fn).forEach(fn => fn(data));
      }
    },

    off(name, fn) {
      if (events.name) {
        const index = events[name].indexof(fn);
        if (index > -1) {
          events[name].splice(index, 1);
        }
      }
    }
  }
}

const bus = simpleEventBus();
const login = (user) => console.log('用户登录', user)
const logout = (reason) => console.log('用户登出', reason);
bus.on('user.login', login);
bus.on('user.logout',logout('非正常情况登出'));
bus.emit('user.login', {id: 1, name: '张三'});
bus.emit('user.logout', '主动登出');
bus.off('user.logout', logout);
bus.emit('user.logout', '第二次取消后订阅后的登出');
