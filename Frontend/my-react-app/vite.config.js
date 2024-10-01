import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],





  optimizeDeps: {
    include: ['pdfjs-dist/build/pdf.worker.entry'],
  },

  build: {
    // Ensure Vite correctly handles external scripts
    rollupOptions: {
      external: ['pdfjs-dist'],
    },
  },

  server: {
    host:'192.168.10.30',
    port: 443, // Set the desired port here
    strictPort: true, // Optional: prevents the server from starting if the port is already in use
  }
})
