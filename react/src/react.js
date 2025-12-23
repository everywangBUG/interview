function createTextElement(text) {
    return {
        type: 'TEXT_ELEMENT',
        props: {
            nodeValue: text,
            children: []
        }
    }
}

function createElement(type, props, ...children) {
    return {
        type,
        props: {
            ...props,
            children: children.map(
                child => typeof child === 'object'
                ? child
                : createTextElement(child)
            )
        }
    }
}

function isStandardProperty(key) {
    return key !== 'children';
  }
  
function render(element, container) {
    // 下一个单元的数据结构
    nextUnitOfWork = {
        dom: container,
        props: {
            children: [element]
        }
    }

    // const dom = element.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(element.type);
    // Object.keys(element.props)
    //     .filter(isStandardProperty)
    //     .forEach(name => dom[name] = element.props[name]);
    // element.props.children.forEach(child => render(child, dom));

    // container.append(dom);
}

/**
 * workLoop：一个工作循环
 */
function workLoop() {

}

/**
 * begainWork：创建此Fiber的真实Dom，通过虚拟Dom创建Fiber结构
 * @param {*} workingInProgressFiber
 */

export default {
    render,
    createElement
}
