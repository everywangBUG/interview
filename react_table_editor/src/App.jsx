import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>{count}</div>
      <button onClick={() => setCount(count => count += 1)}>加一</button>
    </>
  )
}

export default App
