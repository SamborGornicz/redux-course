import { useEffect, useState } from "react"
import { Auth } from "@supabase/ui"

import Alert from "../Alert"
import TodoItem from './TodoItem';
import TodoForm from "./Form";
import * as todosApi from "../../api/todos"
import * as usersApi from "../../api/users"

const TodoList = () => {
  const { user } = Auth.useUser()

  const [todos, setTodos] = useState([])
  const [errorText, setError] = useState(null)

  useEffect(() => {
    getTodos()
  }, [])

  useEffect(() => {
    todosApi.subscribeTodos({
      onInsert: async ({ new: newTodo }) => {
        if (todos.find(todo => todo.id === newTodo.id)) {
          return null;
        }

        const author = await usersApi.fetchUser(newTodo.user_id)
        const todo = { ...newTodo, author }
        setTodos([...todos, todo])
      },
      onDelete: ({ old: deletedTodo }) => {
        const updatedTodos = todos.filter(todo => todo.id !== deletedTodo.id)
        setTodos(updatedTodos)
      },
      onUpdate: async ({ new: updatedTodo }) => {
        const updatedTodos = todos.map(todo => {
          if (todo.id === updatedTodo.id) {
            return { ...todo, ...updatedTodo }
          }
          return todo
        })

        setTodos(updatedTodos)
      }
    })
  }, [todos])

  const getTodos = async () => {
    try {
      const todosList = await todosApi.fetchTodos()
      setTodos(todosList)
    } catch (error) {
      setError(error?.message)
    }
  }

  const addTodo = async (taskText) => {
    try {
      if (taskText?.length) {
        const newTodo = await todosApi.addTodo(taskText, user.id)
        setTodos([...todos, newTodo])
      }
    } catch (error) {
      setError(error?.message)
    }
  }

  const deleteTodo = async (id) => {
    try {
      await todosApi.deleteTodo(id)
      setTodos(todos.filter((x) => x.id !== id))
    } catch (error) {
      setError(error?.message)
    }
  }

  const toggleTodo = async (id, isComplete) => {
    try {
      const updatedTodo = await todosApi.toggleTodo(id, isComplete)

      const updatedTodos = todos.map(todo => {
        if (todo.id === updatedTodo.id) {
          return { ...todo, ...updatedTodo }
        }
        return todo
      })

      setTodos(updatedTodos)
    } catch (error) {
      setError(error?.message)
    }
  }

  return (
    <div className="pb-10 w-full flex flex-col items-center">
      <div className="w-11/12 md:w-8/12 text-center lg:w-6/12 xl:w-5/12">
        <h1 className="text-7xl font-extrabold my-8">Redux ToDo</h1>

        <TodoForm addTodo={addTodo} clearError={() => setError('')} />

        {!!errorText && <Alert text={errorText} />}

        <ul>
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onDelete={deleteTodo}
              onToggle={toggleTodo}
            />
          ))}
        </ul>
      </div>
    </div>
  )
}

export default TodoList