import { createSlice } from '@reduxjs/toolkit'
import * as usersApi from '../../api/users'
import { USER_STATUS } from '../../constants'
import { getActiveUsers, getMe } from '../selectors'
import { supabase } from '../../lib/api'

export const usersSlice = createSlice({
  name: 'users',
  initialState: {
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
  },
  reducers: {
    fetchUserRequest: (state) => {
      state.me.isFetching = true
      state.me.error = null
    },
    fetchUserSuccess: (state, { payload }) => {
      state.me.isFetching = false
      state.me.data = payload
    },
    fetchUserFailure: (state, { payload }) => {
      state.me.isFetching = false
      state.me.error = payload
    },
    fetchActiveUsersRequest: (state) => {
      state.activeUsers.isFetching = true
      state.activeUsers.error = null
    },
    fetchActiveUsersSuccess: (state, { payload }) => {
      state.activeUsers.isFetching = false
      state.activeUsers.items = payload
    },
    fetchActiveUsersFailure: (state, { payload }) => {
      state.activeUsers.isFetching = false
      state.activeUsers.error = payload
    },
    updateActiveUsersAction: (state, { payload }) => {
      state.activeUsers.isFetching = false
      state.activeUsers.items = payload
    },
    updateActiveUsersError: (state, { payload }) => {
      state.activeUsers.isFetching = false
      state.activeUsers.error = payload
    },
    signOutRequest: () => { },
    signOutSuccess: (state) => {
      state.me.data = null
    },
    signOutFailure: (state, { payload }) => {
      state.me.error = payload
    },
  },
})

export const {
  fetchUserRequest,
  fetchUserSuccess,
  fetchUserFailure,
  fetchActiveUsersRequest,
  fetchActiveUsersSuccess,
  fetchActiveUsersFailure,
  updateActiveUsersAction,
  updateActiveUsersError,
  signOutRequest,
  signOutSuccess,
  signOutFailure,
} = usersSlice.actions

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

export default usersSlice.reducer
