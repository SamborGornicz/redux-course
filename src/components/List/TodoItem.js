import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import parseISO from 'date-fns/parseISO'

import Avatar from "../Avatar"

const TodoItem = ({ todo, onToggle, onDelete }) => {
  const lastUpdateInMinutes = formatDistanceToNow(
    parseISO(todo.updated_at)
  )

  const handleOnDelete = (e) => {
    e.preventDefault()
    onDelete(todo.id)
  }

  const handleOnToggle = (e) => {
    e.preventDefault()
    onToggle(todo.id, !todo.is_complete)
  }

  return (
    <li className="bg-white shadow overflow-hidden rounded-md mb-2 w-full block transition duration-150 ease-in-out">
      <div className="flex items-center px-4 py-4 sm:px-6">
        <div className="min-w-0 flex-1 flex items-center">
          <div className="text-sm leading-5 font-medium truncate">{todo.task}</div>
        </div>

        <div>
          <input
            className="cursor-pointer"
            onChange={handleOnToggle}
            type="checkbox"
            checked={todo.is_complete || false}
          />
        </div>

        <button
          onClick={handleOnDelete}
          className="w-4 h-4 ml-2 border-2 hover:border-black rounded"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="gray">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      <div className="flex justify-between items-start px-4 py-4 sm:px-6">
        <div className="flex flex-col text-left">
          <small>Created by: </small>
          <div className="transform scale-75 -translate-x-5">
            <Avatar image={todo.author?.avatar_url} name={todo.author?.username} />
          </div>
        </div>

        <div className="text-right">
          <small>Last update:</small>
          <p className="pt-1">{lastUpdateInMinutes} ago</p>
        </div>
      </div>
    </li>
  )
}

export default TodoItem