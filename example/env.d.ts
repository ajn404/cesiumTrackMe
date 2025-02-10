/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ION_TOKEN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 