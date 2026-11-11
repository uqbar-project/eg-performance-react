import { fakerES as faker } from '@faker-js/faker'
// biome-ignore lint/suspicious/noTsIgnore: el ts-ignore es intencional, expect-error rompería el build al descomentar en clase
// @ts-ignore: useMemo se usa al descomentar la solución manual en clase
// biome-ignore lint/correctness/noUnusedImports: idem anterior
import { useMemo, useState } from 'react'
import { CompilerBadge } from './compilerBadge'
import './docentes.css'
import { RenderBadge } from './renderBadge'

faker.seed(42)

const TOTAL = 20000
const TOTAL_TEXTO = TOTAL.toLocaleString('es-AR')

interface DocenteXL {
  id: number
  nombre: string
}

const allDocentesXL: DocenteXL[] = Array.from({ length: TOTAL }, (_, index) => ({
  id: index,
  nombre: faker.person.fullName(),
}))

const PASADAS = 20

// Actualizamos la función para que reciba el criterio (ascendente)
// y siga rompiendo la optimización de V8 con el random.
const ordenarPesado = (base: DocenteXL[], ascendente: boolean): DocenteXL[] =>
  Array.from({ length: PASADAS }).reduce<DocenteXL[]>(
    (ordenado) =>
      [...ordenado]
        .sort(() => Math.random() - 0.5)
        .sort((docenteA, docenteB) =>
          ascendente
            ? docenteA.nombre.localeCompare(docenteB.nombre)
            : docenteB.nombre.localeCompare(docenteA.nombre)
        ),
    base
  )

const MAX_VISIBLES = 200

export const ListaPesada = () => {
  const [query, setQuery] = useState('')
  const [ascendente, setAscendente] = useState(true)

  const t0 = performance.now()

  // 1. EL CUELLO DE BOTELLA REAL:
  // Corre sobre los 20.000 elementos. Sin useMemo, el lag de ~80ms 
  // ocurre en CADA tecla que el usuario presiona en el buscador.
  const nombresOrdenados = ordenarPesado(allDocentesXL, ascendente)
  // MANUAL (comentá la línea de arriba y descomentá esta en clase):
  // const nombresOrdenados = useMemo(() => ordenarPesado(allDocentesXL, ascendente), [ascendente])
  
  const ms = performance.now() - t0

  // 2. EL FILTRO RÁPIDO:
  // Se hace sobre la lista ya ordenada y es muy ligero.
  const criterioNormalizado = query.trim().toLowerCase()
  const filtrados = nombresOrdenados.filter((docente) =>
    docente.nombre.toLowerCase().includes(criterioNormalizado)
  )

  const visibles = filtrados.slice(0, MAX_VISIBLES)

  return (
    <div className="callback-page">
      <section className="callback-card">
        <header className="callback-header">
          <h1 className="callback-title">Lista pesada - useMemo</h1>
          <span className="callback-count">
            {filtrados.length.toLocaleString('es-AR')} resultados ·{' '}
            {ms.toFixed(1)} ms
          </span>
          <RenderBadge label="Padre" />
          <CompilerBadge />
        </header>

        <div className="callback-controls">
          <input
            className="callback-search"
            type="text"
            placeholder={`Filtrar ${TOTAL_TEXTO} docentes`}
            aria-label="Filtrar docentes"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button
            type="button"
            className="callback-shuffle"
            onClick={() => setAscendente((ordenAnterior) => !ordenAnterior)}
          >
            Orden: {ascendente ? 'A-Z' : 'Z-A'}
          </button>
        </div>

        <ul className="callback-list">
          {visibles.length === 0 && (
            <li className="callback-empty">Sin resultados</li>
          )}
          {visibles.map((docente) => (
            <li key={docente.id} className="callback-item">
              {docente.nombre}
            </li>
          ))}
        </ul>

        {filtrados.length > visibles.length && (
          <p className="callback-empty">
            Se filtran {visibles.length} de{' '}
            {filtrados.length.toLocaleString('es-AR')} (la lista se recorta a
            propósito: {TOTAL_TEXTO} nodos DOM congelarían la página)
          </p>
        )}
      </section>
    </div>
  )
}