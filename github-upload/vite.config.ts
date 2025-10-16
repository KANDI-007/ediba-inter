import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      external: [],
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['lucide-react'],
          pdf: ['jspdf', 'html2canvas', 'jspdf-autotable']
        }
      }
    }
  },
  server: {
    host: '0.0.0.0', // Permet l'accès depuis d'autres appareils
    port: 5173,
    headers: {
      'Service-Worker-Allowed': '/'
    }
  }
});
