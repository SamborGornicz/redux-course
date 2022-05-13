import * as usersApi from '../../api/users'
import { USER_STATUS } from '../../constants'
import { supabase } from '../../lib/api'
import { getActiveUsers, getMe } from '../selectors'

export const FETCH_USER_REQUEST = 'FETCH_USER_REQUEST'
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS'
export const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE'

export const FETCH_ACTIVE_USERS_REQUEST = 'FETCH_ACTIVE_USERS_REQUEST'
export const FETCH_ACTIVE_USERS_SUCCESS = 'FETCH_ACTIVE_USERS_SUCCESS'
export const FETCH_ACTIVE_USERS_FAILURE = 'FETCH_ACTIVE_USERS_FAILURE'

export const SIGN_OUT_REQUEST = 'SIGN_OUT_REQUEST'
export const SIGN_OUT_SUCCESS = 'SIGN_OUT_SUCCESS'
export const SIGN_OUT_FAILURE = 'SIGN_OUT_FAILURE'

export const UPDATE_ACTIVE_USERS = 'UPDATE_ACTIVE_USERS'
export const UPDATE_ACTIVE_USERS_ERROR = 'UPDATE_ACTIVE_USERS_ERROR'

export const fetchUserRequest = () => ({ type: FETCH_USER_REQUEST })
export const fetchUserSuccess = (user) => ({ type: FETCH_USER_SUCCESS, user })
export const fetchUserFailure = (error) => ({ type: FETCH_USER_FAILURE, error })

export const fetchActiveUsersRequest = () => ({ type: FETCH_ACTIVE_USERS_REQUEST })
export const fetchActiveUsersSuccess = (users) => ({ type: FETCH_ACTIVE_USERS_SUCCESS, users })
export const fetchActiveUsersFailure = (error) => ({ type: FETCH_ACTIVE_USERS_FAILURE, error })

export const signOutRequest = () => ({ type: SIGN_OUT_REQUEST })
export const signOutSuccess = (users) => ({ type: SIGN_OUT_SUCCESS, users })
export const signOutFailure = (error) => ({ type: SIGN_OUT_FAILURE, error })

export const updateActiveUsersAction = (users) => ({ type: UPDATE_ACTIVE_USERS, users })
export const updateActiveUsersError = (error) => ({ type: UPDATE_ACTIVE_USERS, error })

export const fetchMe = id => async dispatch => {
  try {
    dispatch(fetchUserRequest())

    const user = await usersApi.fetchUser(id)
    await usersApi.setUserStatus(id)

    dispatch(fetchUserSuccess(user))
  } catch (error) {
    dispatch(fetchUserFailure(error))
  }
}

export const fetchActiveUsers = () => async dispatch => {
  try {
    dispatch(fetchActiveUsersRequest())

    const activeUsers = await usersApi.fetchActiveUsers()

    dispatch(fetchActiveUsersSuccess(activeUsers))
  } catch (error) {
    dispatch(fetchActiveUsersFailure(error))
  }
}

export const updateActiveUsers = ({ new: user }) => async (dispatch, getState) => {
  try {
    let updatedUsers = null
    const activeUsers = getActiveUsers(getState())
    const findUser = activeUsers.find(({ id }) => id === user?.id)

    if (!findUser) {
      updatedUsers = [...activeUsers, user]
    } else {
      updatedUsers = activeUsers
        .map(activeUser => {
          if (activeUser.id === user?.id) {
            if (user.status === USER_STATUS.OFFLINE) {
              return null
            }

            return user
          }
          return activeUser
        })
        .filter(Boolean)
    }

    dispatch(updateActiveUsersAction(updatedUsers))
  } catch (error) {
    dispatch(updateActiveUsersError(error))
  }
}

export const signOut = () => async (dispatch, getState) => {
  try {
    dispatch(signOutRequest())
    const me = getMe(getState())

    await usersApi.setUserStatus(me?.id, USER_STATUS.OFFLINE)
    await supabase.auth.signOut()

    dispatch(signOutSuccess())
  } catch (error) {
    dispatch(signOutFailure(error))
  }
}