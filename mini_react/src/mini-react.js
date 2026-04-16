"use strict";

/**
 * 自定义的 React-like 库
 * 支持 JSX 渲染、Hooks 和组件化
 */
// 定义全局变量
var MiniReact = (function () {
    // React 元素创建
    function createElement(type, props, ...children) {
        // 处理 props
        const _props = props || {};

        // 处理 children
        const flattenedChildren = children.flat(Infinity);
        const processedChildren = flattenedChildren.map(child => {
            if (child == null) {
                return createTextNode("");
            }
            const isTextNode = typeof child === "string" || typeof child === "number";
            return isTextNode ? createTextNode(child) : child;
        }).filter(child => child != null);

        return {
            type,
            props: {
                ..._props,
                children: processedChildren
            },
        };
    }

    // 创建文本节点
    function createTextNode(nodeValue) {
        return {
            type: "TEXT_ELEMENT",
            props: {
                nodeValue: String(nodeValue),
                children: []
            }
        };
    }

    // 工作循环相关变量
    // 下一个要处理的任务单元
    let nextUnitOfWork = null;
    // 转换成wipRoot fiber节点
    let wipRoot = null;
    // 当前的节点
    let currentRoot = null;
    // 删除的dom数组
    let deletions = [];

    // 当前工作的 Fiber
    let wipFiber = null;
    // state和hook的下标
    let stateHookIndex = null;

    /**
     * 渲染入口
     * @param {*} element React 元素
     * @param {*} container DOM 容器
     */
    function render(element, container) {
        wipRoot = {
            dom: container,
            props: {
                children: [element],
            },
            alternate: currentRoot,
        };

        // console.log(wipRoot, "wipRoot");

        deletions = [];
        nextUnitOfWork = wipRoot;
    }

    /**
     * 主工作循环
     * @param {IdleDeadline} deadline 空闲时间
     */
    function workLoop(deadline) {
        let shouldYield = false;
        // console.log("进入工作循环");
        // 如果fiber节点有值，应该停止渲染，进入工作循环
        while (nextUnitOfWork && !shouldYield) {
            // console.log(nextUnitOfWork, "nextUnitOfWork");
            // 下一个进入处理函数的单元
            nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
            // 如果浏览器有空闲的时间，应该处理
            shouldYield = deadline.timeRemaining() < 1;
        }

        // 所有的单元被处理完毕后提交commitRoot
        if (!nextUnitOfWork && wipRoot) {
            commitRoot();
        }
        
        if (typeof requestIdleCallback !== 'undefined') {
            // 进入工作循环
            requestIdleCallback(workLoop);
        } else {
            // 兼容不支持 requestIdleCallback 的环境
            setTimeout(workLoop, 0);
        }
    }

    // 启动工作循环
    if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(workLoop);
    } else {
        setTimeout(workLoop, 0);
    }

    /**
     * 提交根节点
     */
    function commitRoot() {
        // 删除需要删除的节点
        deletions.forEach(commitWork);
        
        // 提交工作
        if (wipRoot && wipRoot.child) {
            commitWork(wipRoot.child);
        }
        
        // 执行 effect hooks
        commitEffectHooks();
        
        // 更新当前根
        currentRoot = wipRoot;
        wipRoot = null;
        deletions = [];
    }

        /**
     * 提交工作单元
     */
    function commitWork(fiber) {
        // 没有fiber节点返回
        if (!fiber) {
            return;
        }

        let domParentFiber = fiber.return;
        console.log(domParentFiber, "domParentFiber");
        while (domParentFiber && !domParentFiber.dom) {
            domParentFiber = domParentFiber.return;
        }

        if (!domParentFiber) return;
        
        const domParent = domParentFiber.dom;

        if (fiber.effectTag === "PLACEMENT" && fiber.dom != null) {
            // 新增节点
            domParent.appendChild(fiber.dom);
        } else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
            // 更新属性或者方法
            updateDom(fiber.dom, fiber.alternate.props, fiber.props);
        } else if (fiber.effectTag === "DELETION") {
            // 删除节点
            commitDeletion(fiber, domParent);
        }

        // 递归处理child和sibling
        commitWork(fiber.child);
        commitWork(fiber.sibling);
    }

    /**
     * 执行 effect hooks
     */
    function commitEffectHooks() {
        function runCleanup(fiber) {
            if (!fiber) return;

            if (fiber.alternate && fiber.alternate.effectHooks) {
                fiber.alternate.effectHooks.forEach((hook, index) => {
                    const deps = fiber.effectHooks?.[index]?.deps;

                    if (!hook.deps || !isDepsEqual(hook.deps, deps)) {
                        if (hook.cleanup) hook.cleanup();
                    }
                });
            }

            runCleanup(fiber.child);
            runCleanup(fiber.sibling);
        }

        function run(fiber) {
            if (!fiber) return;

            if (fiber.effectHooks) {
                fiber.effectHooks.forEach((newHook, index) => {
                    if (!fiber.alternate) {
                        newHook.cleanup = newHook.callback();
                        return;
                    }

                    if (!newHook.deps) {
                        newHook.cleanup = newHook.callback();
                    } else if (newHook.deps.length > 0) {
                        const oldHook = fiber.alternate?.effectHooks?.[index];

                        if (!oldHook || !isDepsEqual(oldHook.deps, newHook.deps)) {
                            if (newHook.cleanup) newHook.cleanup();
                            newHook.cleanup = newHook.callback();
                        }
                    } else {
                        if (newHook.cleanup) newHook.cleanup();
                        newHook.cleanup = newHook.callback();
                    }
                });
            }

            run(fiber.child);
            run(fiber.sibling);
        }

        runCleanup(wipRoot);
        run(wipRoot);
    }

    /**
     * 比较依赖项是否相等
     */
    function isDepsEqual(deps, newDeps) {
        if (!deps || !newDeps) return false;
        if (deps.length !== newDeps.length) {
            return false;
        }

        for (let i = 0; i < deps.length; i++) {
            if (deps[i] !== newDeps[i]) {
                return false;
            }
        }

        return true;
    }

    /**
     * 删除节点
     */
    function commitDeletion(fiber, domParent) {
        if (fiber.dom) {
            domParent.removeChild(fiber.dom);
        } else {
            if (fiber.child) {
                commitDeletion(fiber.child, domParent);
            }
        }
    }

    /**
     * 执行工作单元
     */
    function performUnitOfWork(fiber) {
        const isFunctionComponent = typeof fiber.type === "function";
        if (isFunctionComponent) {
            updateFunctionComponent(fiber);
        } else {
            updateHostComponent(fiber);
        }
        
        if (fiber.child) {
            return fiber.child;
        }

        let nextFiber = fiber;
        while (nextFiber) {
            if (nextFiber.sibling) {
                return nextFiber.sibling;
            }
            nextFiber = nextFiber.return;
        }
    }

    /**
     * 更新函数组件
     */
    function updateFunctionComponent(fiber) {
        wipFiber = fiber;
        stateHookIndex = 0;
        wipFiber.stateHooks = [];
        wipFiber.effectHooks = [];

        try {
            const children = [fiber.type(fiber.props)];
            const filteredChildren = children.filter(child => child != null);
            reconcileChildren(fiber, filteredChildren);
        } catch (error) {
            console.error("组件渲染错误:", error);
            // 错误处理：渲染错误边界或空内容
            reconcileChildren(fiber, []);
        }
    }

    /**
     * 更新宿主组件
     */
    function updateHostComponent(fiber) {
        if (!fiber.dom) {
            fiber.dom = createDom(fiber);
        }

        reconcileChildren(fiber, fiber.props.children);
    }

    /**
     * 创建 DOM
     */
    function createDom(fiber) {
        const dom = fiber.type === "TEXT_ELEMENT"
            ? document.createTextNode("")
            : document.createElement(fiber.type);
        
        // 设置 DOM 引用
        dom._fiber = fiber;
        
        updateDom(dom, {}, fiber.props);
        return dom;
    }

    // DOM 更新辅助函数
    const isEvent = key => key.startsWith("on");
    const isProperty = key => key !== "children" && !isEvent(key);
    const isNew = (prev, next) => key => prev[key] !== next[key];
    const isGone = (prev, next) => key => !(key in next);

    /**
     * 更新 DOM
     */
    function updateDom(dom, prevProps, nextProps) {
        // 移除旧的监听器
        Object.keys(prevProps)
            .filter(isEvent)
            .filter(key => !(key in nextProps) || isNew(prevProps, nextProps)(key))
            .forEach(name => {
                const eventType = name.toLowerCase().substring(2);
                dom.removeEventListener(eventType, prevProps[name]);
            });

        // 移除旧的属性
        Object.keys(prevProps)
            .filter(isProperty)
            .filter(isGone(prevProps, nextProps))
            .forEach(name => {
                dom[name] = "";
            });

        // 设置新的或者被改变的属性
        Object.keys(nextProps)
            .filter(isProperty)
            .filter(isNew(prevProps, nextProps))
            .forEach(name => {
                dom[name] = nextProps[name];
            });

        // 添加新的事件监听器
        Object.keys(nextProps)
            .filter(isEvent)
            .filter(isNew(prevProps, nextProps))
            .forEach(name => {
                const eventType = name.toLowerCase().substring(2);
                const handler = nextProps[name];
                if (typeof handler === 'function') {
                    dom.addEventListener(eventType, handler);
                }
            });
    }

    /**
     * 协调子节点
     */
    function reconcileChildren(wipFiber, elements) {
        let index = 0;
        let oldFiber = wipFiber.alternate?.child;
        let prevSibling = null;

        while (index < elements.length || oldFiber != null) {
            const element = elements[index];
            let newFiber = null;

            // 修复：安全访问 element.type
            const sameType = oldFiber && element && element.type === oldFiber.type;

            // 新的节点和旧的节点更新前后类型相同，更新属性和内容
            if (sameType) {
                newFiber = {
                    type: oldFiber.type,
                    props: element.props,
                    dom: oldFiber.dom,
                    return: wipFiber,
                    alternate: oldFiber,
                    effectTag: "UPDATE"
                };
            }

            // 新的节点和旧的节点fiber类型不同，是新增的节点，之前不存在对应的旧fiber
            if (element && !sameType) {
                newFiber = {
                    type: element.type,
                    props: element.props,
                    dom: null,
                    return: wipFiber,
                    alternate: null,
                    effectTag: "PLACEMENT"
                };
            }

            // 打上删除的节点标记
            if (oldFiber && !sameType) {
                oldFiber.effectTag = "DELETION";
                deletions.push(oldFiber);
            }

            if (oldFiber) {
                oldFiber = oldFiber.sibling;
            }

            if (newFiber) {  // 只有在 newFiber 存在时才连接
                if (index === 0) {
                    wipFiber.child = newFiber;
                } else {
                    prevSibling.sibling = newFiber;
                }
                
                prevSibling = newFiber;
            }
            
            index++;
        }
    }

    /**
     * useState Hook
     */
    function useState(initialState) {
        const currentFiber = wipFiber;

        const oldHook = wipFiber.alternate?.stateHooks?.[stateHookIndex];

        const stateHook = {
            state: oldHook ? oldHook.state : initialState,
            queue: oldHook ? oldHook.queue : []
        };

        // 处理队列中的更新
        stateHook.queue.forEach((action) => {
            stateHook.state = typeof action === "function" 
                ? action(stateHook.state) 
                : action;
        });

        stateHook.queue = [];

        stateHookIndex++;
        wipFiber.stateHooks.push(stateHook);

        function setState(action) {
            const isFunction = typeof action === "function";
            
            // 添加到队列
            stateHook.queue.push(isFunction ? action : () => action);

            // 🔥 修复：确保 wipRoot 是完整的 Fiber
            wipRoot = {
                dom: currentRoot?.dom,
                props: currentRoot?.props || { children: [] },
                alternate: currentRoot,
                child: null,
                return: null,
                sibling: null
            };

            nextUnitOfWork = wipRoot;
        }

        return [stateHook.state, setState];
    }

    /**
     * useEffect Hook
     */
    function useEffect(callback, deps) {
        const effectHook = {
            callback,
            deps,
            cleanup: undefined
        };

        wipFiber.effectHooks.push(effectHook);
    }

    /**
     * 返回 MiniReact API
     */
    return {
        createElement,
        render,
        useState,
        useEffect
    };
})();

// 全局导出
if (typeof window !== 'undefined') {
    window.MiniReact = MiniReact;
}

// 模块导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MiniReact;
}

function App() {
    const [count, setCount] = MiniReact.useState(0);
    
    function handleClick() {
        console.log("点击按钮");
        setCount(count => {
            const newCount = count + 1;
            console.log("设置新 count:", newCount);
            return newCount;
        });
    }

    MiniReact.useEffect(() => {
        const timer = setTimeout(() => {
            // console.log("useEffect 中的定时器触发");
            setCount((prevCount) => {
                const newCount = prevCount + 1;
                // console.log("定时器更新 count:", newCount);
                return newCount;  // 必须返回新值
            });
        }, 1000);
        
        // 清理函数
        return () => {
            clearTimeout(timer);
        };
    }, []);

    // MiniReact.useEffect(() => {
    //     setTimeout(() => {
    //         const el = document.getElementById("button");
    //         el.textContent = "改成+1"
    //     }, 2000)
    // })
    
    return MiniReact.createElement("div", null,
        MiniReact.createElement("h1", null, "MiniReact 计数器"),
        MiniReact.createElement("p", null, "当前计数: ", count),
        MiniReact.createElement("button", { onClick: handleClick, id: "button" }, "加一")
    );
}

// 确保 DOM 加载完成
document.addEventListener('DOMContentLoaded', function() {
    const rootElement = document.getElementById('root');
    if (rootElement) {
        console.log("开始渲染到", rootElement);
        MiniReact.render(MiniReact.createElement(App, null), rootElement);
    } else {
        console.error("找不到 #root 元素");
    }
});