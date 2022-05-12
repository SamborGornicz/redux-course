import { useState } from "react"

const TodoForm = ({ addTodo, clearError }) => {
  const [taskText, setTaskText] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    addTodo(taskText)
    setTaskText('')
  }

  const handleInputChange = (e) => {
    clearError()
    setTaskText(e.target.value)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 my-2">
      <input
        className="rounded w-full p-2 shadow"
        placeholder="What should I do..."
        value={taskText}
        onChange={handleInputChange}
      />

      <button className="bg-black text-white shadow font-semibold px-4 py-2 rounded-md border-transparent border hover:bg-transparent hover:text-black hover:border-black" type="submit">
        Add
      </button>
    </form>
  )
}

export default TodoForm