import './compilerBadge.css'

// Indica si este bundle se compiló con el React Compiler activado.
// El valor viene de build-time (define en vite.config.ts), por eso cambia
// entre `pnpm dev` y `pnpm dev:sin-compiler`.
export const CompilerBadge = () => {
  const isOn = __REACT_COMPILER__

  return (
    <span
      className={`compiler-badge ${isOn ? 'is-on' : 'is-off'}`}
      title={
        isOn
          ? 'Bundle compilado con React Compiler'
          : 'Bundle SIN React Compiler (REACT_COMPILER=off)'
      }
    >
      Compiler: {isOn ? 'ON' : 'OFF'}
    </span>
  )
}
