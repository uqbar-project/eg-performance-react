import { memo, useCallback, useState } from 'react'
import './ejemploUseCallback.css'

interface SearchPayload {
  onChange: (text: string) => void
}

// memo wrappea el componente para chequear que el onChange
// haya cambiado, y así definimos si se renderiza de nuevo
const Search = memo(({ onChange }: SearchPayload) => {
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
})

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

export const DemoCallback = () => {
  const [docentes, setDocentes] = useState<string[]>(allDocentes)

  const handleSearch = useCallback((nombre: string) => {
    const docentesFiltrados = allDocentes.filter((docente: string) =>
      docente.includes(nombre)
    )
    setDocentes(docentesFiltrados)
  }, [])

  return (
    <div className="callback-page">
      <section className="callback-card">
        <header className="callback-header">
          <h1 className="callback-title">Docentes</h1>
          <span className="callback-count">
            {docentes.length} {docentes.length === 1 ? 'docente' : 'docentes'}
          </span>
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
