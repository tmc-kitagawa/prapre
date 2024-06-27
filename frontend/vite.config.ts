import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:8080"
    }
  },
  build: {
    outDir: path.join(__dirname, "../backend/src/main/resources/static")
  }
})
