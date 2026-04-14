// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  server: {
    port: 5173,
    // WHY proxy: forwards /api calls to Spring Boot during local development
    // On AWS: React is on S3 and calls EC2 directly — no proxy needed
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  },

  // WHY build.outDir: 'dist' is what gets uploaded to S3 on deployment
  build: {
    outDir: 'dist',
    sourcemap: false   // disable in production — don't expose source to public
  }
})