import { useCallback, useEffect, useState } from 'react'
import './contador.css'

type ContadorPayload = {
  contador: number
  incrementar: () => void
}

const Contador = ({ contador, incrementar }: ContadorPayload) => {
  useEffect(() => {
    console.info('tengo una nueva función increment')
  }, [])

  return (
    <div className="main">
      <span className="contador">{contador}</span>
      <button type="button" className="primary" onClick={incrementar}>
        +
      </button>
    </div>
  )
}

export const AppContador = () => {
  const [counter, setCounter] = useState(0)

  const increment = useCallback(() => {
    setCounter((prevCounter) => prevCounter + 1)
  }, [])

  return <Contador contador={counter} incrementar={increment} />
}
