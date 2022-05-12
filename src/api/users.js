import { supabase } from '../lib/api';
import { USER_STATUS } from '../constants';

export const fetchUser = async (id) => {
  let { data: user, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)

  if (error) {
    throw new Error(error)
  }

  return user?.length ? user[0] : user
}

export const fetchActiveUsers = async () => {
  let { data: users, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('status', USER_STATUS.ONLINE)

  if (error) {
    throw new Error(error)
  }

  return users
}

export const subscribeActiveUsers = async ({ onInsert, onUpdate }) => {
  return supabase
    .from(`profiles`)
    .on('INSERT', onInsert)
    .on('UPDATE', onUpdate)
    .subscribe()
}

export const setUserStatus = async (id, status = USER_STATUS.ONLINE) => {
  let { data: user, error } = await supabase
    .from('profiles')
    .update({ status })
    .eq('id', id)

  if (error) {
    throw new Error(error)
  }

  return user
}