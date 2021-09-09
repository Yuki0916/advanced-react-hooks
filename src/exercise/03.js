// useContext: simple Counter
// http://localhost:3000/isolated/exercise/03.js

import {useContext, createContext, useState} from 'react'

const CountContext = createContext()

function CountDisplay() {
  const {count} = useContext(CountContext)

  return <div>{`The current count is ${count}`}</div>
}

function Counter() {
  const {setCount} = useContext(CountContext)
  const increment = () => setCount(c => c + 1)
  return <button onClick={increment}>Increment count</button>
}

function App() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <CountContext.Provider value={{count, setCount}}>
        <CountDisplay />
        <Counter />
      </CountContext.Provider>
    </div>
  )
}

export default App
