import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'

const farmInitialState = {
  farm: false,
  plan: '',
}

export const actionTypes = {
  FARM: 'FARM',
  UPDATE_PLAN: 'UPDATE_PLAN'
}

// REDUCERS
export const reducer = (state = farmInitialState, action) => {
  switch (action.type) {
    case actionTypes.FARM:
      return Object.assign({}, state, {
        count: state.count + 1,
      })
    case actionTypes.UPDATE_PLAN:
      return Object.assign({}, state, {
        plan: action.payload
      })
    default:
      return state
  }
}


export const updatePlan = plan => dispatch => {
  return dispatch({ type: actionTypes.UPDATE_PLAN, payload: plan })
}

export const initStore = (initialState = farmInitialState) => {
  return createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(thunkMiddleware))
  )
}