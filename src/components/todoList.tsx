import { useEffect, useState } from 'react'
import { TodoItem } from '../domain/todoItem'
import { NavLink } from 'react-router-dom'
import './todoList.css'

const priority = () => Math.trunc(Math.random() * 5)

const baseTodoList = Array.from(Array(100).keys()).map(n => new TodoItem('a' + n, priority()))

export const TodoList = () => {
  console.info('renderizando master')
  const [todoList, setTodoList] = useState<TodoItem[]>(baseTodoList)
  const [description, setDescription] = useState('')
  const [length, setLength] = useState(0)

  useEffect(() => {
    let i = 0
    while (i < 2000000000) i++
    setLength(todoList.length)

    // otra opción
    // fetch('https://medium.com/@cybersphere/fetch-api-the-ultimate-guide-to-cors-and-no-cors-cbcef88d371e', {
    //   mode: 'no-cors' 
    // }).then(() => {
    //   setLength(todoList.length)
    // })

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
    const newList = [...todoList.slice(0, index), todoItem, ...todoList.slice(index + 1)]
    setTodoList(newList)
  }

  return <>
    <div className='menu'>
      <NavLink to='/callback'
          className={({ isActive, isPending }) =>
          isPending ? 'pending' : isActive ? 'active' : ''}>Docentes (useCallback)
      </NavLink>
    </div>

    <div className="page">
      <span>{length} elementos</span>
      <div className="form">
      <input type="text" value={description} onChange={(event) => setDescription(event.target.value)}></input>
      <button className="primary" onClick={addTodoItem}>Agregar</button>
    </div>
    <div className="grid">
      <div className="table header">
        <span>Descripción</span>
        <span>Prioridad</span>
        <span></span>
      </div>
      {todoList.map((todoItem: TodoItem) => (
        <TodoItemRow key={todoItem.id} todoItem={todoItem} changeDescription={changeDescription} deleteItem={deleteItem}/>
      ))
      }
    </div>
  </div>

  </>
}
/* qué pasa si pongo key={1} */
/* qué pasa si pongo key={index} */


type TodoItemRowPayload = {
  todoItem: TodoItem,
  changeDescription: (todoItem: TodoItem, description: string) => void,
  deleteItem: (todoItem: TodoItem) => void,
}

export const TodoItemRow = ({ todoItem, changeDescription, deleteItem }: TodoItemRowPayload) => {
  console.info(`renderizando ${todoItem.id}`)
  const [selected, setSelected] = useState(false)

  return <div>
    <div className="table">
      <span data-testid="fecha" className={selected ? 'selected' : 'normal'}><input type="text" value={todoItem.description} onChange={(event) => changeDescription(todoItem, event.target.value)}></input></span>
      <span>{todoItem.priority}</span>
      <span><button className="primary" onClick={() => { setSelected(!selected) }}>o</button></span>
      <span><button className="secondary" onClick={() => deleteItem(todoItem)}>x</button></span>
    </div>
    <hr />
  </div>
}