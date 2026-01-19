class SafeJSON {
    // 序列化符号
    static serialize = Symbol.for("SafeJSON.serialize");
    static deserialize = Symbol.for("SafeJSON.deserialize");
    
    /**
     * 安全的序列化
     * @param {any} value 要序列化的值
     * @param {Function} [replacer] 替换函数
     * @param {number|string} [space] 缩进
     * @return {string} 序列化后的字符串
     */
    static strignify(value, replacer, space) {
        
    }
}

const obj = {
    name: "张三",
    age: 25,
    birth: new Date("1998-05-20"),
    hobby: ["篮球", "游泳"],
    score: undefined,
    sayHello: function() { return "Hello"; },
    id: Symbol("id"),
    regex: /test/gi,
    set: new Set([1, 2, 3]),
    map: new Map([["key", "value"]])
  };
  
  // 你的实现应该支持：
  const serialized = SafeJSON.stringify(obj);
  const deserialized = SafeJSON.parse(serialized);
  
  // 验证
  console.log(deserialized.birth instanceof Date); // true
  console.log(typeof deserialized.sayHello); // "function"
  console.log(deserialized.sayHello()); // "Hello"
  console.log(deserialized.regex instanceof RegExp); // true
  console.log(deserialized.set instanceof Set); // true
  console.log(deserialized.map instanceof Map); // true

