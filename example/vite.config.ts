import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import cesium from 'vite-plugin-cesium'
import autoprefixer from 'autoprefixer';
import path from "path"

export default defineConfig({
  plugins: [react(), cesium()],
  base: '/cesiumTrackMe/',
  css: {
    postcss: {
      plugins: [
        autoprefixer(),
        require('tailwindcss'),
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    fs: {
      allow: ['..']
    }
  },
}) 