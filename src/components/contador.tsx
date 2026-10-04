import { useCallback, useEffect, useState } from 'react'
import './contador.css'

type ContadorPayload = {
  contador: number
  incrementar: () => void
}

const Contador = ({ contador, incrementar }: ContadorPayload) => {
  // biome-ignore lint/correctness/useExhaustiveDependencies: demo
  useEffect(() => {
    console.info('tengo una nueva función increment')
  }, [incrementar])

  return (
    <div className="contador-page">
      <div className="contador-box">
        <span className="contador">{contador}</span>
        <button
          type="button"
          className="contador-boton"
          onClick={incrementar}
          aria-label="Incrementar"
        >
          +
        </button>
      </div>
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
