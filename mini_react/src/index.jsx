function App() {
    const [count,setCount] = window.MiniReact.useState(0)
   
    function handleClick(){
      setCount((count)=> count + 1)
      console.log(111)
    }

    window.MiniReact.useEffect(() => {
      console.log(111)
      setTimeout(() => {
        setCount++;
      }, 1000)
    }, [count])
    
    return <div>
      <p>{count}</p>
      <button onClick={handleClick}>加一</button>
    </div>;
  }
  
window.MiniReact.render(<App/>, document.getElementById('root'));