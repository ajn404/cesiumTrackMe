import { defineConfig } from 'vite'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'CesiumHooks',
      fileName: 'cesium-hooks',
      formats: ['es', 'umd']
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
