import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Статика виджета раздаётся шлюзом под /quiz/widget/
  base: '/quiz/widget/',
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `assets/widget.js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/widget.[ext]`
      }
    }
  }
})