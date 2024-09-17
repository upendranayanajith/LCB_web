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
      external: ['pdfjs-dist']
    }
  }

})
