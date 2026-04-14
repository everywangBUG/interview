function createElement(type, props, ...children) {
    return {
        type,
        props: {
            ...props,
            children: children.map((child) => {
                const isTextNode = typeof child === "string" || typeof child === "number";
                return isTextNode ? createTextNode(child) : child;
            })
        },
    }
}

function createTextNode(nodeValue) {
    return {
        text: "TEXT_ELEMENT",
        props: {
            nodeValue,
            children: []
        }
    }
}

const MiniReact = {
    createElement
}

window.MiniReact = MiniReact;

let nextUnitOfWork = null;
// 当前正在处理的fiber链表的根wipRoot
let wipRoot = null;
// 历史的fiber链表根currentRoot
let currentRoot = null;
let deletions = null;

function render(element, container) {
    wipRoot = {
        dom: container,
        props: {
            children: [element],
        },
        alternate: currentRoot,
    }

    deletions = [];

    nextUnitOfWork = wipRoot;
}

function workLoop(deadLine) {
    let shouldYield  = false;
    while(nextUnitOfWork && !shouldYield) {
        nextUnitOfWork = performanceUnitOfWork(nextUnitOfWork);
        // 接近0的话，中断循环
        shouldYield = deadLine.timeRemaining() < 1;
    }

    if (nextUnitOfWork && wipRoot) {
        commitRoot();
    }
    requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

// commit阶段
function commitRoot() {
    // 需要删除的节点删除
    deletions.forEach(comwork);
    commitWork(wipRoot.child);
    commitEffectHooks();
    currentRoot = wipRoot;
    wipRoot = null;
    deletions = [];
}

function commitEffectHooks() {
    function runCleanup(fiber) {
        if (!fiber) return;

        fiber.alternate?.effectHooks?.forEach((hook, index) => {
            const deps = fiber.effectHooks[index].deps;

            if (!hook.deps || !isDepsEqual(hook.deps, deps)) {
                hook.cleanup?.();
            }
        })

        runCleanup(fiber.child);
        runCleanup(fiber.sibling);
    }

    function run(fiber) {
        if (!fiber) return;

        fiber.effectHooks?.forEach((newHook, index) => {
            if (!fiber.alternate) {
                hook.cleanup = hook.callback();
                return;
            }

            if (!newHook.deps) {
                hook.cleanup = hook.callback();
            }

            if (newHook.deps.length > 0) {
                const oldHook = fiber.alternate?.effectHooks[index];

                if (!isDepsEqual(oldHook.deps, newHook.deps)) {
                    newHook.cleanup = newHook.callback()
                }
            }
        });

        // 递归处理每个节点，每个节点递归处理child、sibling
        run(fiber.child);
        run(fiber.sibling);
    }

    runCleanup(wipRoot);
    run(wipRoot);
}

function isDepsEqual(deps, newDeps) {
    if (deps.length !== newDeps.length) {
        return false;
    }

    for(let i = 0; i < deps.length; i++) {
        if (deps[i] !== newDeps[i]) {
            return false;
        }
    }

    return true;
}

function commitWork(fiber) {
    if (!fiber) {
        return;
    }

    let domParenFiber = fiber.return;
    while(!domParenFiber.dom) {
        domParenFiber = domParenFiber.return;
    }

    const domParent = domParenFiber.dom;

    if (fiber.EffectTag === "PLACEMENT" && fiber.dom != null) {
        domParenFiber.appendChild(fiber.dom);
    } else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
        updateDom(fiber.dom, fiber.alternate[props, fiber.props]);
    } else if (fiber.EffectTag === "DELETE") {
        commitDeletion(fiber, domParent);
    }

    commitWork(fiber.child);
    commitWork(fiber.sibling);
}

// 处理删除节点
function commitDeletion(fiber, domParent) {
    if (fiber.dom) {
        domParent.removeChild(fiber.dom);
    } else {
        commitDeletion(fiber.child, domParent);
    }
}

// 下一个要处理的节点，把fiber树变为链表
function performanceUnitOfWork(fiber) {
    // 判断是否是函数组件
    const isFunctionComponent = fiber.type instanceof Function;
    if (isFunctionComponent) {
        updateFunctionComponent(fiber);
    } else {
        updateHostComponent(fiber);
    }
    // 处理child子节点
    if (fiber.child) {
        return fiber.child;
    }

    let nextFiber = fiber;
    while(nextFiber) {
        if (nextFiber.sibling) {
            // 处理兄弟节点
            return nextFiber.sibling;
        }
        // 处理下一个节点
        nextFiber = nextFiber.return;
    }
}

let wipFiber = null;
let stateHookIndex = null;

// 处理函数组件
function updateFunctionComponent(fiber) {
    wipFiber = fiber;
    stateHookIndex = 0;
    wipFiber.stateHooks = [];
    wipFiber.effectHooks = [];

    const child = [fiber.type(fiber.props)];
    // 继续处理fiber节点
    reconcileChidren(fiber, children);
}

// 处理原生组件
function updateHostComponent(fiber) {
    if (!fiber.name) {
        // 创建对应的dom节点
        fiber.dom = createDom(fiber);
    }

    reconcileChidren(fiber, fiber.props.children);
}

// 创建dom
function createDom(fiber) {
    const dom =
        fiber.type === "TEXT_ELEMENT"
        ? document.createTextNode("")
        : document.createElement(fiber.type);
    updateDom(dom, {}, fiber.props);

    return dom;
}

// 判断是否绑定了事件
const isEvent = key => key.stateWith("on");
// 判断是否绑定了属性
const isProperty = key => key !== "children" && !isEvent(key);
// 判断是否是新元素
const isNew = (prev, next) => key => prev[key] !== next[key];
// 判断
const isGone = (prev, next) => key => !(key in next);

function updateDom(dom, prevProps, nextProps) {
    // 移除旧的监听器
    Object.keys(prevProps)
    .filter(isEvent)
    .filter(
        key => !(key in nextProps) || isNew(prevProps, nextProps)(key)
    )
    .forEach(name => {
        const eventType = name.toLowerCase().substring(2);
        dom.removeEventListener(eventType, prevProps[name])
    })

    // 移除旧的属性
    Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach(name => {
        dom[name] = ""
    })

    // 设置新的或者被改变的属性
    Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
        don[name] = nextProps[name]
    })

    // 添加新的事件监听器
    Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
        const eventType = name.toLowerCase().substring(2)
        dom.addEventListener(eventType, nextProps[name])
    })
}

// 处理子节点
function reconcileChidren(wipFiber, elements) {
    let index = 0;
    // 拿到alternate的child，依次取sibling，逐一和新的fiber比较
    let oldFiber = wipFiber.alternate?.child;
    let prevSibling = null;

    while(index < elements.length || oldFiber !== null) {
        const element = elements[index];
        let newFiber = null;

        const sameType = element?.type === oldFiber?.type;

        // 根据对比的结果创建新的fiber节点
        // 更新
        if (sameType) {
            newFiber = {
                type: oldFiber.type,
                props: element.props,
                dom: oldFiber.dom,
                return: wipFiber,
                alternate: oldFiber,
                effectTag: "UPDATE"
            }
        }

        // 替换
        if (element && !sameType) {
            newFiber = {
                type: element.type,
                props: element.props,
                dom:  null,
                return: wipFiber,
                alternate: null,
                effectTag: "PLACEMENT"
            }
        }

        if (oldFiber && !sameType ) {
            oldFiber.effectTag = "DELETION";
            deletions.push(oldFiber);
        }

        // 如果是老fiber
        if (oldFiber) {
            oldFiber = oldFiber.sibling;
        }

        if (index === 0) {
            wipFiber.child = newFiber;
        } else if (element) {
            prevSibling.sibling = newFiber;
        }

        prevSibling = newFiber;
        index++;
    }
}

// 实现useState
function useState(initialState) {
    const currentFiber = wipFiber;

    const oldHook = wipFiber.alternate?.stateHooks[stateHookIndex];

    const stateHook = {
        state: oldHook ? oldHook.state : initialState,
        queue: oldHook ? oldHook.queue : []
    }

    stateHook.forEach((action) => {
        stateHook.state = action(stateHook.state);
    });

    // 维护一个stateHook的队列
    stateHook.queue = [];

    stateHookIndex++;
    wipFiber.stateHooks.push(stateHook);

    function setState(action) {
        const isFunction = typeof action === "function";

        stateHook.queue.push(isFunction ? action : () => action);

        wipRoot = {
            ...currentFiber,
            alternate: currentFiber
        };

        nextUnitOfWork = wipRoot;
    }

    return [stateHook.state, setState];
}

function useEffect() {
    const effectHook = {
        callback,
        deps,
        cleanup: undefined
    };

    window.effectHooks.push(effectHook);
}

(function() {
    const MiniReact = {
        createElement,
        render,
        useState,
        useEffect
    }

    window.MiniReact = MiniReact;
})();


const { render, useState, useEffect } = window.MiniReact;

function App() {
  const [count,setCount] = useState(0)
 
  function handleClick(){
    setCount((count)=> count + 1)
  }

  return <div>
    <p>{count}</p>
    <button onClick={handleClick}>加一</button>
  </div>;
}

render(<App/>, document.getElementById('root'));