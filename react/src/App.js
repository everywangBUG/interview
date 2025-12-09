const App = {
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

export default App;
