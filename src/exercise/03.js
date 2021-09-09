// useContext: simple Counter
// http://localhost:3000/isolated/exercise/03.js

import {useContext, createContext, useState} from 'react'

const CountContext = createContext()

function useCount() {
  const context = useContext(CountContext)
  if (!context) {
    throw new Error('useCount must to be used within the CountProvider')
  }
  return context
} // 將useContext抽出，並且添加錯誤處理。將undefined白畫面問題有更細節的描述，並且可以與CountProvider封裝成模組

function CountProvider({...props}) {
  const [count, setCount] = useState(0)
  return <CountContext.Provider value={[count, setCount]} {...props} />
} // Kent C Dodds的建議 這樣就可以將資料狀態建立這個元件之中
// 若封裝成模組
// 舉例 import {useCount, CountProvider} from '../customHook/CountContext'

function CountDisplay() {
  const [count] = useCount()
  return <div>{`The current count is ${count}`}</div>
}

function Counter() {
  const [, setCount] = useCount() // 只取array第二個setCount function
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
