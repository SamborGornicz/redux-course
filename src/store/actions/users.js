import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as usersApi from '../../api/users'
import { USER_STATUS } from '../../constants'
import { getActiveUsers, getMe } from '../selectors'
import { supabase } from '../../lib/api'

export const fetchMe = createAsyncThunk(
  'users/me',
  async (id) => {
    await usersApi.setUserStatus(id)
    return await usersApi.fetchUser(id)
  }
)

export const fetchActiveUsers = createAsyncThunk(
  'users/activeUsers',
  async () => await usersApi.fetchActiveUsers()
)

export const updateActiveUsers = createAsyncThunk(
  'users/activeUsers/update',
  async (user, { getState }) => {
    const activeUsers = getActiveUsers(getState())
    const findUser = activeUsers.find(({ id }) => id === user?.id)

    if (!findUser) {
      return [...activeUsers, user]
    }

    return activeUsers
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
)

export const signOut = createAsyncThunk(
  'users/signOut',
  async (_, { getState }) => {
    const me = getMe(getState())

    await usersApi.setUserStatus(me?.id, USER_STATUS.OFFLINE)
    await supabase.auth.signOut()

    return null
  }
)

export const usersSlice = createSlice({
  name: 'users',
  initialState: {
    me: {
      isFetching: false,
      error: null,
      data: null,
    },
    activeUsers: {
      isUpdating: false,
      isFetching: false,
      error: null,
      items: [],
    }
  },
  reducers: {
    signOutRequest: () => { },
    signOutSuccess: (state) => {
      state.me.data = null
    },
    signOutFailure: (state, { payload }) => {
      state.me.error = payload
    },
  },
  extraReducers: {
    [fetchMe.pending]: (state) => {
      state.me.isFetching = true
      state.me.error = null
    },
    [fetchMe.fulfilled]: (state, { payload }) => {
      state.me.isFetching = false
      state.me.data = payload
    },
    [fetchMe.rejected]: (state, { payload }) => {
      state.me.isFetching = true
      state.me.error = payload
    },
    [fetchActiveUsers.pending]: (state) => {
      state.activeUsers.isFetching = true
      state.activeUsers.error = null
    },
    [fetchActiveUsers.fulfilled]: (state, { payload }) => {
      state.activeUsers.isFetching = false
      state.activeUsers.items = payload
    },
    [fetchActiveUsers.rejected]: (state, { payload }) => {
      state.activeUsers.isFetching = false
      state.activeUsers.error = payload
    },
    [updateActiveUsers.pending]: (state) => {
      state.activeUsers.isUpdating = true
      state.activeUsers.error = null
    },
    [updateActiveUsers.fulfilled]: (state, { payload }) => {
      state.activeUsers.isUpdating = false
      state.activeUsers.items = payload
    },
    [updateActiveUsers.rejected]: (state, { payload }) => {
      state.activeUsers.isUpdating = false
      state.activeUsers.error = payload
    },
    [signOut.fulfilled]: (state) => {
      state.me.data = null
    },
    [signOut.rejected]: (state, { payload }) => {
      state.me.error = payload
    },
  }
})

export default usersSlice.reducer
