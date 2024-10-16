/**
 * @description 括号匹配 一个字符串中可能包含{} () []三种，(a{b}c)匹配 {a(b不匹配
 * @author everywang
 */

/**
 * @param {string} leftBracket
 * @param {string} rightBracket
 * @return {boolean}
 */
export function isMatch(leftBracket: string, rightBracket: string): boolean {
  if (leftBracket === '{' && rightBracket === '}') return true
  if (leftBracket === '[' && rightBracket === ']') return true
  if (leftBracket === '(' && rightBracket === ')') return true
  return false
}

/**
 * 
 * @param {string} str
 * @returns {boolean} 
 */
export function bracketsMatch(str: string) : boolean {
  if(str.length === 0) return true
  const leftBracket: string = '{[('
  const rightBracket: string = '}])'
  let stack: string[] = []
  for(let i = 0; i < str.length; i++) {
    //如果左括号中包含了{[(其中一个，压栈
    if(leftBracket.includes(str[i])) {
      stack.push(str[i])
    } else if(rightBracket.includes(str[i])) {
      const top = stack[stack.length - 1]
      //如果左括号和右括号匹配，则出栈，不匹配，直接返回false
      if(isMatch(top, str[i])) {
        stack.pop()
      } else {
        return false
      }
    }
  }
  //如果全部出栈代表括号全部匹配
  return stack.length === 0
}

//功能测试
const str1 = '{a[b(d)f]e}'
console.log(bracketsMatch(str1))

const str2 = '{a[b(f]e}'
console.log(bracketsMatch(str2))
