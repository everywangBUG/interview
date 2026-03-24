let count = 1;
function addCount(e) {
    console.log(e, 'e');
    container.innerHTML = count++;
}

const container = document.getElementById('container');
console.log(container);

// container.onmousemove = addCount;

function debounce(fn, delay, immediate) {
    let timer = null;
    return function () {
        let context = this;
        let args = arguments;
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(context, args);
        }, delay)
    }
}

// container.onmousemove = debounce(addCount, 2000);

function throttle(fn, delay) {
    let previous = 0;

    return function() {
        let context = this;
        let args = arguments;
        let now = +new Date();

        if (now - previous > delay) {
            fn.apply(context, args);
            previous = now;
        }
    }
}

container.onmousemove = throttle(addCount, 1000);