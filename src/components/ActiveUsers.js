import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"

import * as usersApi from '../api/users'
import { fetchActiveUsers, updateActiveUsers } from "../store/actions/users"
import { getActiveUsers, isFetchingActiveUsers } from "../store/selectors"
import Avatar from "./Avatar"

const ActiveUsers = () => {
  const dispatch = useDispatch()
  const isFetching = useSelector(isFetchingActiveUsers)
  const activeUsers = useSelector(getActiveUsers)

  const handleIncomingActiveUsers = () => dispatch(updateActiveUsers)

  useEffect(() => {
    usersApi.subscribeActiveUsers({
      onUpdate: handleIncomingActiveUsers,
      onInsert: handleIncomingActiveUsers,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    dispatch(fetchActiveUsers())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

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

export default ActiveUsers