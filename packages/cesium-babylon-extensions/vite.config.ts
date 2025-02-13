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
      name: 'CesiumBabylonExtensions',
      fileName: 'cesium-babylon-extensions'
    },
    rollupOptions: {
      external: ['react', 'cesium', '@babylonjs/core'],
      output: {
        globals: {
          react: 'React',
          cesium: 'Cesium',
          '@babylonjs/core': 'BABYLON'
        }
      }
    }
  }
}) 