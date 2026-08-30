import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Optional: Proxy configuration for local development
  // Uncomment if you want to proxy API requests to a local backend or AWS
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'http://localhost:3000', // Your local backend or AWS endpoint
  //       changeOrigin: true,
  //       secure: false,
  //     }
  //   }
  // }
})
