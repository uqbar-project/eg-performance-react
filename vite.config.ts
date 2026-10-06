/// <reference types="vite/client" />

import babel from '@rolldown/plugin-babel'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
// React Compiler (babel) debe correr ANTES que react().
// Si se invierte el orden, el Compiler no corre (falla silenciosa).
// Para apagarlo: REACT_COMPILER=off pnpm dev (ver scripts en package.json).
const compilerOff = process.env.REACT_COMPILER === 'off'
console.info(`[vite] React Compiler: ${compilerOff ? 'OFF' : 'ON'}`)

export default defineConfig({
  // Bandera de build-time para mostrar en la UI si el Compiler está activo.
  // Se lee con __REACT_COMPILER__ desde cualquier componente.
  define: {
    __REACT_COMPILER__: JSON.stringify(!compilerOff),
  },
  plugins: [
    ...(compilerOff
      ? []
      : [
          babel({
            include: /\.[jt]sx?$/,
            presets: [reactCompilerPreset()],
          }),
        ]),
    react(),
  ],
  resolve: {
    alias: {
      src: '/src',
      components: '/src/components',
    },
  },
})
