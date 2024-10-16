/**
 * 验证IP地址
 * @param IP string字符串 一个IP地址字符串
 * @return string字符串
 */

/**
 * 合法的IPv4：
 * 1. 每组不为空
 * 2. 每组长度 <= 3
 * 3. 每组长度在0~255之间
 * 4. 每组不不包含前导0，除非本身为0
 * 
 * 合法的IPv6
 * 1. 分割为8组
 * 2. 每组不为空
 * 3. 每组长度 <= 4
 * 4. 每组为一个16进制的数，字符的范围为：0~9，a~f，A~F
 */
function solve(IP) {
  // write code here
  if(IP === null || IP.length === 0) return "Neither"
  if(isIPv4(IP)) return "IPv4"
  if(isIPv6(IP)) return "IPv6"
  return "Neither"
}

function isIPv4(IP) {
  let ips = IP.split(".")
  if(ips.length !== 4) return false
  if(IP.charAt(0) === "." || IP.charAt((IP.length - 1) === ".")) return false
  for(let i = 0; i < ips.length; i++) {
      if(!isIPv4Group(ips[i])) return false
  }
  return true
}

function isIPv4Group(IPG) {
  if(IPG == null || IPG.length === 0 || IPG.length >3) return false
  for(let i = 0; i < IPG.length; i++) {
      if(!("0" <= IPG.charAt(i) && IPG.charAt(i) <= "9")) return false
  }
  let x = Number(IPG)
  if(x > 255 || x < 0 ||(IPG.charAt(0) === "0" && IPG.length > 1)) return false
  return true
}

function isIPv6(IP) {
  let ips = IP.split(":")
  if(ips.length === 0) return false
  if(IP.charAt(0) === ":" || IP.charAt(IP.length - 1) === ":") return false
  for(let i = 0; i < ips.length; i++) {
      if(!isIPv6Group(ips[i])) return false
  }
  return true
}

function isIPv6Group(IPG) {
  if(IPG == null || IPG.length === 0 || IPG.length > 4) return false
  for(let i = 0; i < IPG.length; i++) {
      if(!("0" <= IPG.charAt(i) && IPG.charAt(i) <= "9" || 'a' <= IPG.charAt(i) && IPG.charAt(i) <= "f" || "A" <= IPG.charAt(i) && IPG.charAt(i) <= "F" ))
      return false
  } 
  return true
}

module.exports = {
  solve: solve,
};
