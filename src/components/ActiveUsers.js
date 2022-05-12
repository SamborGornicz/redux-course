import { useEffect } from "react"
import { connect } from "react-redux"

import * as usersApi from '../api/users'
import { fetchActiveUsers, updateActiveUsers } from "../store/actions/users"
import { getActiveUsers, isFetchingActiveUsers } from "../store/selectors"
import Avatar from "./Avatar"

const ActiveUsers = ({
  isFetching,
  activeUsers,
  fetchActiveUsers,
  updateActiveUsers,
}) => {
  useEffect(() => {
    usersApi.subscribeActiveUsers({
      onUpdate: updateActiveUsers,
      onInsert: updateActiveUsers,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    fetchActiveUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (isFetching) {
    // TODO: Add loading state
    return null
  }

  return (
    <div className="flex w-full justify-end items-center px-6">
      <p className="mr-2">Active users:</p>
      {activeUsers.map(({ id, avatar_url }) => (
        <Avatar key={`active-${id}`} image={avatar_url} />
      ))}
    </div>
  )
}

const mapStateToProps = (state) => ({
  activeUsers: getActiveUsers(state),
  isFetching: isFetchingActiveUsers(state)
})

const mapDispatchToProps = {
  fetchActiveUsers,
  updateActiveUsers,
}

export default connect(mapStateToProps, mapDispatchToProps)(ActiveUsers)