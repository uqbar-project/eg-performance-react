import { NavLink } from 'react-router-dom'
import './topBar.css'

const sections = [
  { to: '/', label: 'TodoList' },
  { to: '/docentes', label: 'Docentes - memo' },
  { to: '/contador', label: 'Contador - useCallback' },
  { to: '/lista', label: 'Lista - useMemo' },
  { to: '/props', label: 'Props - memo' },
]

export const TopBar = () => {
  return (
    <header className="topbar">
      <span className="topbar-brand">Performance en React</span>
      <nav className="topbar-nav" aria-label="Secciones">
        {sections.map((section) => (
          <NavLink
            key={section.to}
            to={section.to}
            end
            className={({ isActive }) =>
              isActive ? 'topbar-link is-active' : 'topbar-link'
            }
          >
            {section.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
