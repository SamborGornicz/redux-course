import { connect } from 'react-redux'

import { fetchMe, signOut } from '../store/actions/users'
import { getMe } from '../store/selectors'
import ActiveUsers from './ActiveUsers'
import Avatar from './Avatar'

const Navigation = ({ me, signOut }) => {
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

        <button onClick={signOut} className="bg-transparent border border-black rounded-md py-1 px-3 font-bold hover:bg-black hover:text-white">
          logout
        </button>
      </div>

      <ActiveUsers />
    </>
  )
}

const mapStateToProps = (state) => ({
  me: getMe(state)
})

const mapDispatchToProps = {
  fetchProfileInfo: fetchMe,
  signOut,
}

export default connect(mapStateToProps, mapDispatchToProps)(Navigation)