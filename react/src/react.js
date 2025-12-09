function isStandardProperty(key) {
    return key !== 'children';
  }
  
function render(element, container) {
    const dom = element.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(element.type);
    Object.keys(element.props)
        .filter(isStandardProperty)
        .forEach(name => dom[name] = element.props[name]);
    element.props.children.forEach(child => render(child, dom));

    container.append(dom);
}

export default {
    render
}
