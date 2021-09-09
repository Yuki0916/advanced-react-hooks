// useReducer: simple Counter
// http://localhost:3000/isolated/exercise/01.js

import {useReducer, useCallback} from 'react'

function init(initialStateFromProps) {
  // doing something expensive work and only excute once
  return {
    ...initialStateFromProps,
  }
}

function countReducer(state, action) {
  const {count} = state
  const {type, step} = action
  switch (type) {
    case 'add':
      return {...state, count: count + step}

    default:
      return state
  }
} // 負責傳遞參數，運算邏輯放在reudcer內進行計算及更新 redux style
function countReducerV2(state, action) {
  return {
    ...state,
    ...(typeof action === 'function' ? action(state) : action),
  }
} // 負責更新最新值，運算邏輯放在元件之中 setState style

function Counter({initialCount = 0, step = 1}) {
  const [state, dispatch] = useReducer(
    countReducerV2,
    {count: initialCount},
    init,
  )
  const {count} = state
  // handle function 嘗試用useCallback包起來，因為每次step的值其實都一樣，但影響的元件僅有button，且子元件影響範圍很小。其實可以不用加。
  const handleAdd = useCallback(() => dispatch({type: 'add', step}), [step])
  const handleAddV2 = useCallback(
    () =>
      dispatch(currentState => ({
        count: currentState.count + step,
      })), // 運算邏輯在handle function內進行處理，reducer專心更新資料。
    [step],
  )
  return <button onClick={handleAddV2}>{count}</button>
}

function App() {
  return <Counter />
}

export default App
