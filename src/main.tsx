import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AppContador } from './components/contador.tsx'
import { Docentes } from './components/docentes.tsx'
import { AppLayout } from './components/layout.tsx'
import { ListaPesada } from './components/listaPesada.tsx'
import { PropsInestables } from './components/propsInestables.tsx'
import { TodoList } from './components/todoList.tsx'

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <TodoList />,
      },
      {
        path: '/docentes',
        element: <Docentes />,
      },
      {
        path: '/contador',
        element: <AppContador />,
      },
      {
        path: '/lista',
        element: <ListaPesada />,
      },
      {
        path: '/props',
        element: <PropsInestables />,
      },
    ],
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
