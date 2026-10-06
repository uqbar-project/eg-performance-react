// biome-ignore lint/suspicious/noTsIgnore: el ts-ignore es intencional, expect-error rompería el build al descomentar en clase
// @ts-ignore: memo y useCallback se usan al descomentar la solución manual en clase
// biome-ignore lint/correctness/noUnusedImports: idem anterior
import { memo, useCallback, useState } from 'react'
import { CompilerBadge } from './compilerBadge'
import './docentes.css'
import { RenderBadge } from './renderBadge'

interface SearchPayload {
  onChange: (text: string) => void
}

// `memo` y `useCallback` trabajan en par: `memo` compara las props del hijo
// con `===` y saltea el re-render si son iguales, pero eso solo funciona si
// `onChange` mantiene la misma referencia entre renders. Por eso `handleSearch`
// debería cachearse con `useCallback`: sin esa referencia estable, `memo`
// vería una función nueva cada vez y el hijo se re-renderizaría igual.
// (Con el Compiler activado ambos sobran: él estabiliza la referencia solo.)
//
// EN CLASE: la solución manual está en las líneas marcadas MANUAL.
// Comentá la línea ACTIVA y descomentá la MANUAL para activarla
// (hace falta en modo sin-compiler; es redundante con Compiler ON).
const SearchBase = ({ onChange }: SearchPayload) => {
  console.info('Search renderizado')

  return (
    <input
      className="callback-search"
      type="text"
      placeholder="Ingrese criterio de búsqueda"
      aria-label="Ingrese criterio de búsqueda"
      onChange={(event) => onChange(event.target.value)}
    />
  )
}

const Search = SearchBase
// MANUAL: const Search = memo(SearchBase)

const allDocentes = [
  'Juli',
  'Juan',
  'Fer',
  'Nico',
  'Viotti',
  'Lucas',
  'Jorgito',
]

const shuffle = (list: string[]): string[] => {
  if (list.length <= 1) {
    return list
  }
  const rand = Math.floor(Math.random() * list.length)
  return [list[rand], ...shuffle(list.filter((_, i) => i !== rand))]
}

export const Docentes = () => {
  const [docentes, setDocentes] = useState<string[]>(allDocentes)

  const handleSearchBase = (nombre: string) => {
    const docentesFiltrados = allDocentes.filter((docente: string) =>
      docente.includes(nombre)
    )
    setDocentes(docentesFiltrados)
  }

  const handleSearch = handleSearchBase
  // MANUAL: const handleSearch = useCallback(handleSearchBase, [])

  return (
    <div className="callback-page">
      <section className="callback-card">
        <header className="callback-header">
          <h1 className="callback-title">Docentes - memo</h1>
          <span className="callback-count">
            {docentes.length} {docentes.length === 1 ? 'docente' : 'docentes'}
          </span>
          <RenderBadge label="Padre" />
          <CompilerBadge />
        </header>

        <div className="callback-controls">
          <button
            type="button"
            className="callback-shuffle"
            onClick={() => setDocentes(shuffle(docentes))}
          >
            Shuffle
          </button>
          <Search onChange={handleSearch} />
        </div>

        <ul className="callback-list">
          {docentes.length === 0 && (
            <li className="callback-empty">Sin resultados</li>
          )}
          {docentes.map((docente: string) => (
            <li key={docente} className="callback-item">
              {docente}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
