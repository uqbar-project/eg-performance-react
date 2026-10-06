/// <reference types="vite/client" />

import babel from '@rolldown/plugin-babel'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
// React Compiler (babel) debe correr ANTES que react().
// Si se invierte el orden, el Compiler no corre (falla silenciosa).
export default defineConfig({
  plugins: [
    babel({
      include: /\.[jt]sx?$/,
      presets: [reactCompilerPreset()],
    }),
    react(),
  ],
  resolve: {
    alias: {
      src: '/src',
      components: '/src/components',
    },
  },
})
