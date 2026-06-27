import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AppContador } from './components/contador.tsx'
import { DemoCallback } from './components/ejemploUseCallback.tsx'
import { TodoList } from './components/todoList.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <TodoList />,
  },
  {
    path: '/callback',
    element: <DemoCallback />,
  },
  {
    path: '/contador',
    element: <AppContador />,
  },
])

const rootElement = document.getElementById('root')
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  )
}
