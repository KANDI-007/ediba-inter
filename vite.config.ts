import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  base: './', // Chemins relatifs pour Netlify
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.svg', '**/*.webp'],
  publicDir: 'public',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
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
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    headers: {
      'Service-Worker-Allowed': '/',
      'Content-Type': 'application/javascript'
    }
  }
});
