export const getMe = (state) => state.users.me.data
export const getActiveUsers = (state) => state.users.activeUsers.items
export const isFetchingActiveUsers = (state) => state.users.activeUsers.isFetching