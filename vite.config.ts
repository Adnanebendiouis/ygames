import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mkcert from 'vite-plugin-mkcert';

export default defineConfig({
  plugins: [react(), mkcert()],
  server: {
    // Leave https empty; mkcert plugin will enable HTTPS automatically
    port: 5173, // optional, set your local dev port
  },
});
