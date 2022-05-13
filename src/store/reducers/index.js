import { combineReducers } from 'redux'

import usersReducer from '../actions/users'

const rootReducer = combineReducers({
  users: usersReducer
})

export default rootReducer