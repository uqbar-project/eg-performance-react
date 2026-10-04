import { Outlet } from 'react-router-dom'
import { TopBar } from './topBar'

export const AppLayout = () => {
  return (
    <div className="app-layout">
      <TopBar />
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  )
}
