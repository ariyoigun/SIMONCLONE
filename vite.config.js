import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'https://simon.satuputarudemak.id',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
