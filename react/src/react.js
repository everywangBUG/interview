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
    console.log(props, '111')
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
    const dom = element.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(element.type);
    console.log(element, '111')
    Object.keys(element.props)
        .filter(isStandardProperty)
        .forEach(name => dom[name] = element.props[name]);
    element.props.children.forEach(child => render(child, dom));

    container.append(dom);
}

export default {
    render,
    createElement
}
