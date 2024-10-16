const fn = () => console.log('打印节流')
const throttle = (fn, delay)  => {
  let timer = null
  if(timer) return
  return function(args) {
    timer = setTimeout(() => {
      fn.call(this, ...args)
      timer = null
    }, delay)
  }
}
throttle(fn, 3000)