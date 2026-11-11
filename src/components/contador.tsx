import { useEffect, useState } from 'react'
import { CompilerBadge } from './compilerBadge'
import './contador.css'
import { RenderBadge } from './renderBadge'

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
  )
}

export const AppContador = () => {
  const [counter, setCounter] = useState(0)

  // A propósito SIN useCallback (ejercicio: agregalo a mano y probá este
  // ejemplo con `pnpm dev:sin-compiler` para verlo en acción).
  // Igual se usa la forma funcional de setCounter para no leer un valor
  // desactualizado del contador (closure).
  const increment = () => {
    setCounter((prevCounter) => prevCounter + 1)
  }

  return (
    <div className="contador-page">
      <h1 className="contador-title">Contador - useCallback</h1>
      <RenderBadge label="Padre" />
      <CompilerBadge />
      <Contador contador={counter} incrementar={increment} />
    </div>
  )
}
