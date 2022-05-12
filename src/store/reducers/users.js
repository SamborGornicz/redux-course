import {
  FETCH_USER_REQUEST,
  FETCH_USER_SUCCESS,
  FETCH_USER_FAILURE,
  FETCH_ACTIVE_USERS_REQUEST,
  FETCH_ACTIVE_USERS_SUCCESS,
  FETCH_ACTIVE_USERS_FAILURE,
  UPDATE_ACTIVE_USERS,
  UPDATE_ACTIVE_USERS_ERROR,
  SIGN_OUT_FAILURE,
  SIGN_OUT_SUCCESS,
} from '../actions/users'

const initialState = {
  me: {
    isFetching: false,
    error: null,
    data: null,
  },
  activeUsers: {
    isFetching: false,
    error: null,
    items: [],
  }
}

const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USER_REQUEST:
      return {
        ...state,
        me: {
          ...state.me,
          isFetching: true,
          error: null
        }
      }

    case FETCH_USER_SUCCESS:
      return {
        ...state,
        me: {
          ...state.me,
          isFetching: false,
          data: action.user
        }
      }

    case SIGN_OUT_SUCCESS:
      return {
        ...state,
        me: {
          ...state.me,
          isFetching: false,
          data: null
        }
      }

    case SIGN_OUT_FAILURE:
    case FETCH_USER_FAILURE:
      return {
        ...state,
        me: {
          ...state.me,
          isFetching: false,
          error: action.error
        }
      }

    case FETCH_ACTIVE_USERS_REQUEST:
      return {
        ...state,
        activeUsers: {
          ...state.activeUsers,
          isFetching: true,
          error: null
        }
      }

    case UPDATE_ACTIVE_USERS:
    case FETCH_ACTIVE_USERS_SUCCESS:
      return {
        ...state,
        activeUsers: {
          ...state.activeUsers,
          isFetching: false,
          items: action.users
        }
      }

    case UPDATE_ACTIVE_USERS_ERROR:
    case FETCH_ACTIVE_USERS_FAILURE:
      return {
        ...state,
        activeUsers: {
          ...state.activeUsers,
          isFetching: false,
          error: action.error
        }
      }

    default:
      return state
  }
}

export default usersReducer