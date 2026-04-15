console.log(window);
function App() {
    const [count,setCount] = window.MiniReact.useState(0)
   
    function handleClick(){
      setCount((count)=> count + 1)
      console.log(111)
    }

    window.MiniReact.useEffect(() => {
      const timer = setTimeout((prevCount) => {
        const newCount = prevCount + 1;
        return newCount;
      }, 1000)

      return () => {
        clearTimeout(timer);
      }
    }, [count])

    MiniReact.useEffect(() => {
      setTimeout(() => {
          const el = document.getElementById("button");
          el.textContent = "改成+1"
      }, 2000)
    })
    
    return <div>
      <p>{count}</p>
      <button onClick={handleClick} id="button">加一</button>
    </div>;
  }
  
window.MiniReact.render(<App/>, document.getElementById('root'));