/**
 * 检验输入的日期
 */
function printInDateInspection(value) {
  let date;
  if (value === null || value === undefined || value === "") {
    throw new Error("Invalid date value: value is empty or undefined");
  }

  if (value instanceof Date) {
    date = value;
  } else if (typeof value === "string" || typeof value === "number") {
    date = new Date(value);
  } else {
    throw new TypeError(
      "Invalid date value type. Expected Date, number, or string ",
    );
  }

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date: cannot parse the given value");
  }

  return date;
}

/**
 * 时间转换成给定的格式
 * @param {Date|string|number} value
 * @param {string|undefined} format
 * @returns {string} date
 */
function formatDate(value, format = "yyyy-MM-dd HH:mm:ss") {
  const date = printInDateInspection(value);

  const padZero = (number, length = 2) => String(number).padStart(length, "0");

  const map = {
    yyyy: date.getFullYear(),
    yy: String(date.getFullYear()).slice(-2),
    MM: padZero(date.getMonth() + 1),
    M: padZero(date.getMonth() + 1, 1),
    dd: padZero(date.getDate()),
    d: padZero(date.getDate(), 1),
    HH: padZero(date.getHours()),
    H: padZero(date.getHours(), 1),
    mm: padZero(date.getMinutes()),
    m: padZero(date.getMinutes(), 1),
    ss: padZero(date.getSeconds()),
    s: padZero(date.getSeconds()),
    a: date.getHours() > 12 ? "PM" : "AM",
  };

  return Object.keys(map).reduce((fmt, key) => {
    return fmt.replace(new RegExp(key, "g"), map[key]);
  }, format);
}

/**
 * 将时间单位转换成相对的时间表示（如：刚刚、 3分钟、 两小时前）
 * @param {Date|string|number} time- 时间对象、时间字符串或时间戳
 * @return {string} 相对时间字符串
 */
function timeAgo(value) {
  const time = printInDateInspection(value);

  const now = new Date();
  const past = new Date(time);
  const diff = now - past; // 毫秒差

  if (isNaN(past.getTime())) {
    throw new Error("Invalid time format");
  }

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const mouths = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 0) {
    return "未来 ";
  } else if (seconds < 60) {
    return `${seconds}秒前`;
  } else if (minutes < 60) {
    return `${minutes}分钟前`;
  } else if (hours < 24) {
    return `${hours}小时前`;
  } else if (days < 30) {
    return `${days}天前`;
  } else if (mouths < 12) {
    return `${mouths}月前`;
  } else {
    return `${years}年前`;
  }
}

function isWeekend(date) {
  const time = printInDateInspection(date);

  return time.getDay() === 0 || time.getDay() === 1;
}

// cjs
module.export = {
  formatDate,
  timeAgo,
  isWeekend,
};

// esm
export { formatDate, timeAgo, isWeekend };
