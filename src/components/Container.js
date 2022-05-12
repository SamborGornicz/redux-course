import { useEffect } from 'react';
import { Auth } from '@supabase/ui'
import { connect } from 'react-redux';

import TodoList from "./List";
import AuthWrapper from "./Auth";
import Navigation from "./Navigation";
import { fetchMe } from '../store/actions/users'

function Container({ fetchUserProfile }) {
  const { user } = Auth.useUser()

  useEffect(() => {
    if (user?.id) {
      fetchUserProfile(user.id)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  return (
    <div className="min-w-full min-h-screen bg-gray-200">
      {!user ? (
        <AuthWrapper />
      ) : (
        <>
          <Navigation />
          <TodoList />
        </>
      )}
    </div>
  );
}

const mapDispatchToProps = {
  fetchUserProfile: fetchMe
}

export default connect(null, mapDispatchToProps)(Container);
