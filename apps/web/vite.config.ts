import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  build: {
    target: ['chrome106', 'edge106', 'firefox110', 'safari16'],
  },
  clearScreen: false,
  plugins: [react()],
  server: {
    port: 5170,
  },
})
