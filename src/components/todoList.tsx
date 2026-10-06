import { useEffect, useState } from 'react'
import { TodoItem } from '../domain/todoItem'
import './todoList.css'

const priority = () => Math.trunc(Math.random() * 5)

const baseTodoList = Array.from(Array(100).keys()).map(
  (indice) => new TodoItem(`a${indice}`, priority())
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

type KeyMode = 'id' | 'index' | 'const'

// Simula una operación sincrónica costosa (bloquea el event loop).
// Está encapsulada para poder reemplazarla por trabajo real
// (ordenar N elementos, parsear un payload grande, etc.).
const ITERACIONES_SIMULADAS = 2000000000

const simulateHeavyOperation = () => {
  let iteracion = 0
  while (iteracion < ITERACIONES_SIMULADAS) {
    iteracion++
  }
}

export const TodoList = () => {
  console.info('renderizando master')
  const [todoList, setTodoList] = useState<TodoItem[]>(baseTodoList)
  const [description, setDescription] = useState('')
  const [length, setLength] = useState(0)
  const [keyMode, setKeyMode] = useState<KeyMode>('id')
  const [simulateHeavy, setSimulateHeavy] = useState(true)

  useEffect(() => {
    if (simulateHeavy) {
      simulateHeavyOperation()
    }
    setLength(todoList.length)

    // Alternativa asincrónica: no congela la UI, pero el dato tarda en
    // reflejarse. Vive acá (y no dentro de simulateHeavyOperation) porque
    // necesita acceso al estado del componente (todoList, setLength).
    // fetch('https://httpbin.org/delay/5')
    //   .then(response => response.json())
    //   .then(_data => {
    //     setLength(todoList.length)
    //   })
  }, [todoList, simulateHeavy])

  const addTodoItem = () => {
    const newItem = new TodoItem(description, priority())
    setTodoList((prevList) => [newItem, ...prevList])
    setDescription('')
  }

  const deleteItem = (todoItem: TodoItem) => {
    setTodoList((prevList) =>
      prevList.filter((item) => item.id !== todoItem.id)
    )
  }

  const changeDescription = (todoItem: TodoItem, newDescription: string) => {
    setTodoList((prevList) =>
      prevList.map((item) =>
        item.id === todoItem.id
          ? { ...item, description: newDescription }
          : item
      )
    )
  }

  return (
    <div className="todo-page">
      <section className="todo-card">
        <header className="todo-header">
          <h1 className="todo-title">TodoList - keys y useEffect</h1>
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

        <div className="todo-options">
          <label className="todo-option">
            Key:
            <select
              className="todo-select"
              value={keyMode}
              aria-label="Modo de key"
              onChange={(event) => setKeyMode(event.target.value as KeyMode)}
            >
              <option value="id">id (estable)</option>
              <option value="index">índice</option>
              <option value="const">constante 1</option>
            </select>
          </label>
          <label className="todo-option">
            <input
              type="checkbox"
              checked={simulateHeavy}
              onChange={(event) => setSimulateHeavy(event.target.checked)}
            />
            Simular cálculo pesado en useEffect
          </label>
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

          {todoList.map((todoItem: TodoItem, index: number) => {
            const key =
              keyMode === 'id' ? todoItem.id : keyMode === 'index' ? index : 1
            return (
              <TodoItemRow
                key={key}
                todoItem={todoItem}
                changeDescription={changeDescription}
                deleteItem={deleteItem}
              />
            )
          })}
        </div>
      </section>
    </div>
  )
}
/* Probalo cambiando el selector de Key arriba:
   - con índice o constante 1, el estado seleccionado "salta" de fila al eliminar
   - con id (estable) cada fila conserva su propio estado */

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
