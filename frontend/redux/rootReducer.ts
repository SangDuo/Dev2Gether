import { HYDRATE } from 'next-redux-wrapper'
import { AnyAction, CombinedState, combineReducers } from 'redux'
import alertReducer, { alertState } from './silces/alertSlice'
import boardReducer, { BoardState } from './silces/boardSlice'
import userReducer, { UserState } from './silces/userSlice'

interface ReducerState {
  board: BoardState
  user: UserState
  alert: alertState
}

const rootReducer = (
  state: ReducerState | undefined,
  action: AnyAction
): CombinedState<ReducerState> => {
  switch (action.type) {
    case HYDRATE:
      return action.payload
    default:
      const combineReducer = combineReducers({
        board: boardReducer,
        user: userReducer,
        alert: alertReducer,
      })
      return combineReducer(state, action)
  }
}

export default rootReducer
