import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'CesiumHooks',
      fileName: 'cesium-hooks'
    },
    rollupOptions: {
      external: ['react', 'cesium'],
      output: {
        globals: {
          react: 'React',
          cesium: 'Cesium'
        }
      }
    }
  }
}) 