import { supabase } from '../lib/api';
import { fetchUser } from './users';

export const fetchTodos = async () => {
  let { data: todos, error } = await supabase
    .from('todos')
    .select('*,  author:profiles(*)')

  if (error) {
    throw new Error(error)
  }

  return todos
}

export const subscribeTodos = async ({ onInsert, onUpdate, onDelete }) => {
  return supabase
    .from(`todos`)
    .on('INSERT', onInsert)
    .on('UPDATE', onUpdate)
    .on('DELETE', onDelete)
    .subscribe()
}

export const addTodo = async (taskText, userId) => {
  const { error, data } = await supabase
    .from('todos')
    .insert({ task: taskText, user_id: userId })
    .single()

  if (error) {
    throw new Error(error)
  }

  const author = await fetchUser(data?.user_id)
  return { ...data, author }
}

export const deleteTodo = async (id) => {
  const { error } = await supabase
    .from('todos')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(error)
  }

  return true
}

export const toggleTodo = async (id, isComplete) => {
  const { error, data } = await supabase
    .from('todos')
    .update({ is_complete: isComplete })
    .eq('id', id)
    .single()

  if (error) {
    throw new Error(error)
  }

  return data
}