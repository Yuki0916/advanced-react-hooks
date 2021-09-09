// useCallback: custom hooks
// http://localhost:3000/isolated/exercise/02.js

import {
  useCallback,
  useEffect,
  useReducer,
  useState,
  useRef,
  useLayoutEffect,
} from 'react'
import {
  fetchPokemon,
  PokemonForm,
  PokemonDataView,
  PokemonInfoFallback,
  PokemonErrorBoundary,
} from '../pokemon'

function useSafeDispatch(dispatch) {
  const isMount = useRef(false)

  useLayoutEffect(() => {
    isMount.current = true
    return () => {
      isMount.current = false
    }
  }, [])

  return useCallback(
    (...args) => {
      if (isMount.current) {
        return dispatch(...args)
      }
    },
    [dispatch],
  ) // 儘管知道useReducer的dispatch是memoized function，但經過一層function呼叫，eslint就會判定為需要相依
}

function asyncReducer(state, action) {
  switch (action.type) {
    case 'pending': {
      return {status: 'pending', data: null, error: null}
    }
    case 'resolved': {
      return {status: 'resolved', data: action.data, error: null}
    }
    case 'rejected': {
      return {status: 'rejected', data: null, error: action.error}
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

function useAsync(initialState) {
  const [state, unsfaeDispatch] = useReducer(asyncReducer, {
    status: 'idle',
    data: null,
    error: null,
    ...initialState,
  })

  const isMount = useRef(false)

  useEffect(() => {
    isMount.current = true
    return () => {
      isMount.current = false
    }
  }, [])

  const dispatch = useSafeDispatch(unsfaeDispatch)
  // 使用過多useCallback包裝，會造成一些原本是靜態function(dispatch, setState)因重新定義需要hook相依處理

  const run = useCallback(
    promise => {
      if (!promise) {
        return
      }
      dispatch({type: 'pending'})
      promise.then(
        data => {
          dispatch({type: 'resolved', data})
        },
        error => {
          dispatch({type: 'rejected', error})
        },
      )
    },
    [dispatch],
  ) // 不管fetch api的過程做了什麼事情，只專注接收fetch的promise result進行結果處理

  return {...state, run}
}

function PokemonInfo({pokemonName}) {
  const state = useAsync({
    status: pokemonName ? 'pending' : 'idle',
  })
  const {data: pokemon, status, error, run} = state

  useEffect(() => {
    if (!pokemonName) {
      return
    }
    run(fetchPokemon(pokemonName))
  }, [pokemonName, run])

  if (status === 'idle') {
    return 'Submit a pokemon'
  } else if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (status === 'rejected') {
    throw error
  } else if (status === 'resolved') {
    return <PokemonDataView pokemon={pokemon} />
  }

  throw new Error('This should be impossible')
}

function App() {
  const [pokemonName, setPokemonName] = useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonErrorBoundary onReset={handleReset} resetKeys={[pokemonName]}>
          <PokemonInfo pokemonName={pokemonName} />
        </PokemonErrorBoundary>
      </div>
    </div>
  )
}

function AppWithUnmountCheckbox() {
  const [mountApp, setMountApp] = useState(true)
  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={mountApp}
          onChange={e => setMountApp(e.target.checked)}
        />{' '}
        Mount Component
      </label>
      <hr />
      {mountApp ? <App /> : null}
    </div>
  )
}

export default AppWithUnmountCheckbox
