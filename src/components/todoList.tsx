import { useEffect, useState } from 'react'
import { TodoItem } from '../domain/todoItem'
import './todoList.css'

const priority = () => Math.trunc(Math.random() * 5)

const baseTodoList = Array.from(Array(100).keys()).map(
  (n) => new TodoItem(`a${n}`, priority())
)

const priorityLevel = (value: number) => {
  if (value <= 1) {
    return 'low'
  }
  if (value <= 3) {
    return 'mid'
  }
  return 'high'
}

export const TodoList = () => {
  console.info('renderizando master')
  const [todoList, setTodoList] = useState<TodoItem[]>(baseTodoList)
  const [description, setDescription] = useState('')
  const [length, setLength] = useState(0)

  useEffect(() => {
    let i = 0
    while (i < 2000000000) {
      i++
    }
    setLength(todoList.length)

    // otra opción
    // fetch('https://httpbin.org/delay/5')
    //   .then(response => response.json())
    //   .then(_data => {
    //     setLength(todoList.length)
    //   })
  }, [todoList])

  const addTodoItem = () => {
    const newItem = new TodoItem(description, priority())
    setTodoList([newItem].concat(todoList))
    setDescription('')
  }

  const deleteItem = (todoItem: TodoItem) => {
    const index = todoList.indexOf(todoItem)
    const newList = [...todoList.slice(0, index), ...todoList.slice(index + 1)]
    setTodoList(newList)
  }

  const changeDescription = (todoItem: TodoItem, newDescription: string) => {
    todoItem.description = newDescription
    const index = todoList.indexOf(todoItem)
    const newList = [
      ...todoList.slice(0, index),
      todoItem,
      ...todoList.slice(index + 1),
    ]
    setTodoList(newList)
  }

  return (
    <div className="todo-page">
      <section className="todo-card">
        <header className="todo-header">
          <h1 className="todo-title">Lista de pendientes</h1>
          <span className="todo-count">{length} elementos</span>
        </header>

        <div className="todo-form">
          <input
            className="todo-new-input"
            type="text"
            value={description}
            placeholder="Descripción del pendiente"
            aria-label="Descripción del pendiente"
            onChange={(event) => setDescription(event.target.value)}
          />
          <button type="button" className="todo-add" onClick={addTodoItem}>
            Agregar
          </button>
        </div>

        <div className="todo-table">
          <div className="todo-row todo-head">
            <span>Descripción</span>
            <span>Prioridad</span>
            <span>Hecho</span>
            <span />
          </div>

          {todoList.length === 0 && (
            <p className="todo-empty">No hay pendientes. Agregá uno arriba.</p>
          )}

          {todoList.map((todoItem: TodoItem) => (
            <TodoItemRow
              key={todoItem.id}
              todoItem={todoItem}
              changeDescription={changeDescription}
              deleteItem={deleteItem}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
/* qué pasa si pongo key={1} */
/* qué pasa si pongo key={index} */
/* se arregla cuando uso key ={todoItem.id} */

type TodoItemRowPayload = {
  todoItem: TodoItem
  changeDescription: (todoItem: TodoItem, description: string) => void
  deleteItem: (todoItem: TodoItem) => void
}

export const TodoItemRow = ({
  todoItem,
  changeDescription,
  deleteItem,
}: TodoItemRowPayload) => {
  console.info(`renderizando ${todoItem.id}`)
  const [selected, setSelected] = useState(false)

  return (
    <div className={`todo-row ${selected ? 'is-selected' : ''}`}>
      <span
        data-testid="fecha"
        className={selected ? 'todo-desc is-selected' : 'todo-desc'}
      >
        <input
          className="todo-cell-input"
          type="text"
          value={todoItem.description}
          aria-label={`Descripción del pendiente ${todoItem.id}`}
          onChange={(event) => changeDescription(todoItem, event.target.value)}
        />
      </span>

      <span className="todo-priority-cell">
        <span
          className={`todo-priority is-${priorityLevel(todoItem.priority)}`}
        >
          {todoItem.priority}
        </span>
      </span>

      <span className="todo-actions">
        <button
          type="button"
          className="todo-check"
          aria-label="Seleccionar"
          title="Seleccionar"
          onClick={() => {
            setSelected(!selected)
          }}
        >
          ✓
        </button>
      </span>

      <span className="todo-actions">
        <button
          type="button"
          className="todo-delete"
          aria-label="Eliminar"
          title="Eliminar"
          onClick={() => deleteItem(todoItem)}
        >
          ✕
        </button>
      </span>
    </div>
  )
}
