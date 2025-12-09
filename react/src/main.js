const element = {
  type: 'div',
  props: {
    id: 'app',
    style: 'width: 100px; height: 100px; background-color: red',
    children: [
      {
        type: 'TEXT_ELEMENT',
        props: {
          nodeValue: '手写react框架',
          children: []
        }
      }
    ]
  }
}

const textElement = {
  type: 'TEXT_ELEMENT',
  props: {
    nodeValue: '手写react框架'
  }
}

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

const container = document.getElementById('root');

render(element, container);
