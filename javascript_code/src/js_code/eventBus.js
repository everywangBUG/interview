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
bus.off('user.logout', logout);
bus.emit('user.logout', '主动登出');
bus.emit('user.logout', '第二次取消后订阅后的登出');

class EventBus {
  constructor() {
    // 存储事件和对应的回调函数数组
    this.events = {};
  }

  on(eventName, callback) {
    // 检查事件名称和回调函数是否有效
    if (!eventName || !callback) return;
    // 如果没有这个事件的订阅数组，创建一个空数组
    if (!this.events[eventName]) this.events[eventName] = [];
    // 将回调函数添加到对应事件的数组中
    this.events[eventName].push(callback);
    // 返回一个取消订阅的函数
    return this; // 链式调用
  }

  once(eventName, callback) {
    // 创建一个包装函数
    const onceWrapper = (...args) => {
      callback.apply(this, ...args);
      this.off(eventName, ...args)
    }
    // 在包装函数中调用原始回调
    this.on(eventName, onceWrapper);

    return this;
  }

  emit(eventName, ...args) {
    // 根据事件名称获取回调函数数组
    const fns = this.events[eventName];
    // 如果数组存在，便利执行每一个回调函数
    fns?.filter(fn => fn).forEach(fn => fn.apply(this, ...args));

    return this;
  }

  off(eventName, callback) {
    // 获取事件对应的回调数组
    const fns = this.events[eventName];
    // 如果没有数组，直接返回
    // 找到并移除对应的回调函数
    const fnIdx = this.events[eventName]?.filter(event => event).findIndex(event => event.eventName === callback);
    // 如果回调数组为空，删除这个事件
    if (fnIdx > -1) {
      console.info(`${eventName}取消了订阅`);
      fns.splice(fnIdx, 1);
    }

    return this;
  }

  // 移除所有监听
  clear(eventName) {
    if (this.events[eventName]) {
      delete this.events[eventName];
    } else {
      this.events = {};
    }
    return this;
  }
}

const eventBus = new EventBus();
const subscribeEventBus1 = (name) => console.log(`${name}订阅了事件1`);
const subscribeEventBus2 = (name) => console.log(`${name}订阅了事件2`);
const subscribeEventBus3 = (name) => console.log(`${name}订阅了事件3`);
eventBus.on('subscribe_bus1', subscribeEventBus1).clear().off('subscribe_bus1').emit('subscribe_bus1');
eventBus.on('subscribe_bus2', subscribeEventBus2).emit('subscribe_bus2');
eventBus.once('once_subscribe', subscribeEventBus3).emit('once_subscribe');