import { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { signOut } from '../store/actions/users'
import { getMe } from '../store/selectors'
import ActiveUsers from './ActiveUsers'
import Avatar from './Avatar'

const Navigation = () => {
  const dispatch = useDispatch()
  const me = useSelector(getMe)

  const signMeOut = useCallback(() => {
    dispatch(signOut())
  }, [dispatch])

  if (!me) {
    return null
  }

  return (
    <>
      <div className="w-full h-30 py-3 px-3 md:px-6 flex justify-between items-center">
        <Avatar
          image={me?.avatar_url}
          name={me?.username}
        />

        <button onClick={signMeOut} className="bg-transparent border border-black rounded-md py-1 px-3 font-bold hover:bg-black hover:text-white">
          logout
        </button>
      </div>

      <ActiveUsers />
    </>
  )
}

export default Navigation