import { fakerES as faker } from '@faker-js/faker'
// biome-ignore lint/suspicious/noTsIgnore: el ts-ignore es intencional, expect-error rompería el build al descomentar en clase
// @ts-ignore: useMemo se usa al descomentar la solución manual en clase
// biome-ignore lint/correctness/noUnusedImports: idem anterior
import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import { CompilerBadge } from './compilerBadge'
import './docentes.css'
import { RenderBadge } from './renderBadge'

// Semilla fija para que los datos sean siempre los mismos en cada recarga.
faker.seed(42)

const TOTAL = 20000
const TOTAL_TEXTO = TOTAL.toLocaleString('es-AR')

// Nombres dispersos y realistas (en español) en lugar de "Juli 1", "Juli 2", ...
// Además los textos largos y variados hacen que filtrar cueste de verdad.
// Cada elemento tiene id estable para usarlo como key
// (los nombres generados pueden repetirse).
interface DocenteXL {
  id: number
  nombre: string
}

const allDocentesXL: DocenteXL[] = Array.from({ length: TOTAL }, (_, i) => ({
  id: i,
  nombre: faker.person.fullName(),
}))

// Latencia simulada de red para que el costo se perciba en clase.
// A diferencia de una espera activa, el setTimeout NO bloquea el hilo de UI:
// el input sigue respondiendo mientras la "respuesta" está en camino.
const LATENCIA_SIMULADA_MS = 600

// Búsqueda rápida (lo que haría el backend): solo filtra, sin ordenar.
const buscarBase = (query: string): DocenteXL[] => {
  const criterioNormalizado = query.trim().toLowerCase()
  return allDocentesXL.filter((docente) =>
    docente.nombre.toLowerCase().includes(criterioNormalizado)
  )
}

// Transformación costosa a propósito: ordena miles de elementos.
// Las pasadas extra simulan normalizar un payload grande y hacen que el costo
// se note incluso en máquinas rápidas. Corre en el render (hilo de UI),
// por eso es lo que `useMemo` evita recalcular.
const PASADAS = 20

const ordenarPesado = (base: DocenteXL[]): DocenteXL[] =>
  Array.from({ length: PASADAS }).reduce<DocenteXL[]>(
    (ordenado) =>
      [...ordenado].sort((a, b) => a.nombre.localeCompare(b.nombre)),
    base
  )

const MAX_VISIBLES = 200

export const ListaPesada = () => {
  const [query, setQuery] = useState('')
  // Estado ajeno a la búsqueda: solo sirve para forzar re-renders del padre
  // y mostrar que el ordenamiento se recalcula aunque nada haya cambiado.
  const [vueltas, setVueltas] = useState(0)

  // `useDeferredValue` estabiliza el tecleo rápido: la búsqueda se dispara
  // con el valor diferido, no con cada tecla.
  const deferredQuery = useDeferredValue(query)

  // "Respuesta del backend": llega con delay simulado, sin bloquear el input.
  // El cleanup cancela la búsqueda anterior si el query cambia antes de que
  // responda (si no, una respuesta vieja pisaría a una más nueva).
  const [base, setBase] = useState<DocenteXL[]>(allDocentesXL)
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    setCargando(true)
    const id = setTimeout(() => {
      setBase(buscarBase(deferredQuery))
      setCargando(false)
    }, LATENCIA_SIMULADA_MS)
    return () => clearTimeout(id)
  }, [deferredQuery])

  const t0 = performance.now()
  const filtrados = ordenarPesado(base)
  // MANUAL (comentá la línea de arriba y descomentá esta en clase):
  // const filtrados = useMemo(() => ordenarPesado(base), [base])
  const ms = performance.now() - t0

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
            onClick={() => setVueltas((v) => v + 1)}
          >
            Forzar re-render ({vueltas})
          </button>
        </div>

        {(cargando || query !== deferredQuery) && (
          <p className="callback-empty">Actualizando lista…</p>
        )}

        <ul className="callback-list">
          {visibles.map((docente: DocenteXL) => (
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
