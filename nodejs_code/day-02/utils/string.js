// 字符串首字母大写
function capitalize(str) {
  return str.slice(0, 1).toUpperCase() + str.slice(1);
}

// 截断数组
function truncate(str, length) {
  return str.length > length ? str : str.slice(0, length);
}

// slugify => 将全部字符串转换为“-”连接的小写字母
function slugify(str) {
  if (!str) return "";

  // 转小写并去掉首尾空格
  let slug = str.toLowerCase().trim();

  // 去掉重音符号
  slug = slug.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // 替换非法字符为空格
  slug = slug.replace(/[^a-z0-9\s-]/g, " ");

  // 将多个空格或者连接字符合并为一个连字符
  slug = slug.replace(/[\s-]+/g, "-");

  return slug;
}

slugify("Django 5.0 Release! What's new?");

// CJS导出
module.exports = {
  capitalize,
  truncate,
  slugify,
};

// ESM导出
export { capitalize, truncate, slugify };
