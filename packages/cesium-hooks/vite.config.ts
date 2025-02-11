import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
      include: ['src/**/*.ts', 'src/**/*.tsx']
    })
  ],
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