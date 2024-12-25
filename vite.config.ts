import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/truck_management': {
        target: 'http://localhost',
        changeOrigin: true
      }
    }
  }
})
