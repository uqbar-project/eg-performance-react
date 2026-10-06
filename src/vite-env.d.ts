/// <reference types="vite/client" />

declare module '*.css'
declare module '*.scss'
declare module '*.sass'
declare module '*.less'
declare module '*.styl'

// Bandera de build-time definida en vite.config.ts (define).
// Indica si el bundle se compiló con el React Compiler activado.
declare const __REACT_COMPILER__: boolean
