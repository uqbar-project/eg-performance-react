// biome-ignore lint/suspicious/noTsIgnore: el ts-ignore es intencional, expect-error rompería el build al descomentar en clase
// @ts-ignore: useMemo y useCallback se usan al descomentar la solución manual en clase
// biome-ignore lint/correctness/noUnusedImports: idem anterior
import { memo, useCallback, useMemo, useState } from 'react'
import { CompilerBadge } from './compilerBadge'
import './docentes.css'
import { RenderBadge } from './renderBadge'

interface FichaPayload {
  nombre: string
  config: { resaltado: boolean }
  onSelect: (nombre: string) => void
}

// `memo` compara las props con `===`: si el padre le pasa objetos o funciones
// creados en cada render, la comparación siempre da distinto y el `memo`
// no sirve para nada (mirar la consola).
const Ficha = memo(({ nombre, config, onSelect }: FichaPayload) => {
  console.info(`Ficha renderizada: ${nombre}`)

  return (
    <li className="callback-item">
      <span>
        {nombre}
        {config.resaltado && <strong> ★</strong>}
      </span>
      <button type="button" onClick={() => onSelect(nombre)}>
        Elegir
      </button>
    </li>
  )
})

export const PropsInestables = () => {
  const [elegido, setElegido] = useState<string | null>(null)
  // Estado ajeno a las fichas: solo fuerza re-renders del padre.
  const [vueltas, setVueltas] = useState(0)

  // A propósito INESTABLES: este objeto y esta función se crean de nuevo en
  // cada render, así que el `memo` de Ficha nunca puede saltear nada.
  // MANUAL (comentá cada línea y descomentá su versión en clase):
  const config = { resaltado: true }
  // MANUAL: const config = useMemo(() => ({ resaltado: true }), [])
  const handleSelect = (nombre: string) => setElegido(nombre)
  // MANUAL: const handleSelect = useCallback(
  // MANUAL:   (nombre: string) => setElegido(nombre),
  // MANUAL:   []
  // MANUAL: )

  return (
    <div className="callback-page">
      <section className="callback-card">
        <header className="callback-header">
          <h1 className="callback-title">Props inestables - memo</h1>
          <span className="callback-count">
            {elegido ? `Elegido: ${elegido}` : 'Sin elegir'}
          </span>
          <RenderBadge label="Padre" />
          <CompilerBadge />
        </header>

        <div className="callback-controls">
          <button
            type="button"
            className="callback-shuffle"
            onClick={() => setVueltas((v) => v + 1)}
          >
            Forzar re-render ({vueltas})
          </button>
        </div>

        <ul className="callback-list">
          {['Juli', 'Juan', 'Fer'].map((nombre: string) => (
            <Ficha
              key={nombre}
              nombre={nombre}
              config={config}
              onSelect={handleSelect}
            />
          ))}
        </ul>
      </section>
    </div>
  )
}
