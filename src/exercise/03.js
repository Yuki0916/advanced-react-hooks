// useContext: simple Counter
// http://localhost:3000/isolated/exercise/03.js

import {useContext, createContext, useState} from 'react'

const CountContext = createContext()

function CountProvider({...props}) {
  const [count, setCount] = useState(0)
  return <CountContext.Provider value={[count, setCount]} {...props} />
} // Kent C Dodds的建議 這樣就可以將資料狀態建立這個元件之中

function CountDisplay() {
  const [count] = useContext(CountContext)
  return <div>{`The current count is ${count}`}</div>
}

function Counter() {
  const [, setCount] = useContext(CountContext) // 只取array第二個setCount function
  const increment = () => setCount(c => c + 1)
  return <button onClick={increment}>Increment count</button>
}

function App() {
  // 比起自己的版本，App這裡不用建立count資料
  return (
    <div>
      <CountProvider>
        <CountDisplay />
        <Counter />
      </CountProvider>
    </div>
  )
}

export default App
