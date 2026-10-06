import { useRef } from 'react'
import './renderBadge.css'

// Muestra cuántas veces se renderizó el componente padre
// (el badge se vuelve a renderizar cada vez que el padre lo hace).
// Nota: mutar una ref durante el render hace que el Compiler NO compile
// este componente en particular, lo cual no afecta al resto de la app.
export const RenderBadge = ({ label }: { label: string }) => {
  const count = useRef(0)
  count.current += 1

  return (
    <span className="render-badge">
      {label}: {count.current} renders
    </span>
  )
}
