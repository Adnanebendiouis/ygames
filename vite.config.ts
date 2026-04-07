import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mkcert from 'vite-plugin-mkcert';

export default defineConfig({
  plugins: [react(), mkcert()],
  server: {
    port: 5173,
  },
  build: {
    target: ['chrome80', 'firefox78', 'safari13'],
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-mui': ['@mui/material', '@mui/icons-material'],
          'vendor-misc': ['react-hot-toast', 'react-icons', 'react-helmet-async'],
        },
      },
    },
  },
});
