import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { TodoList } from './components/todoList.tsx'
import { DemoCallback } from './components/ejemploUseCallback.tsx'
import { AppContador } from './components/contador.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <TodoList/>,
  },
  {
    path: '/callback',
    element: <DemoCallback/>,
  },
  {
    path: '/contador',
    element: <AppContador/>,
  },

])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
