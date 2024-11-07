import { memo, useCallback, useState } from 'react'
import './ejemploUseCallback.css'
import { NavLink } from 'react-router-dom'

interface SearchPayload {
  onChange: (text: string) => void
}

// memo wrappea el componente para chequear que el onChange
// haya cambiado, y así definimos si se renderiza de nuevo
const Search = memo(({ onChange }: SearchPayload) => {
  console.info('Search renderizado')

  return (
    <input
      type='text'
      placeholder='Ingrese criterio de búsqueda'
      onChange={(event) => onChange(event.target.value)} />
  )
})

const allDocentes = ['Juli', 'Juan', 'Fer', 'Nico', 'Guille', 'Jorgito']

const shuffle = (list: string[]): string[] => {
  if (list.length === 1) {
    return list
  }
  const rand = Math.floor(Math.random() * list.length)
  return [list[rand], ...shuffle(list.filter((_, i) => i != rand))]
};

export const DemoCallback = () => {
  const [docentes, setDocentes] = useState<string[]>(allDocentes)

  const handleSearch = useCallback((nombre: string) => {
    const docentesFiltrados = allDocentes.filter((docente: string) => docente.includes(nombre))
    setDocentes(docentesFiltrados)
  }, [])

  return (
    <>
      <div className='menu'>
        <NavLink to='/'
            className={({ isActive, isPending }) =>
            isPending ? 'pending' : isActive ? 'active' : ''}>Lista de pendientes (keys)
        </NavLink>
      </div>
      <div className='main'>
      <div className='row'>
        <button className='primary' onClick={() => setDocentes(shuffle(docentes))}>Shuffle</button>
        <Search onChange={handleSearch}/>
      </div>
      <ul>
        {docentes.map((docente: string) => (
          <li key={docente}>{docente}</li>
        ))}
      </ul>
    </div>
    </>
  )
}
