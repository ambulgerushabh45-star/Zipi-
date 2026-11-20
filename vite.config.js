import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true,
    port: 5173,
    allowedHosts: true,
  },
    plugins: [react()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    optimizeDeps: {
        include: ['lucide-react', 'framer-motion', 'react', 'react-dom', 'react-router-dom'],
    },
});
