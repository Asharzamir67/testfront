// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  define: {
    'process.env': process.env,
    'process.platform': JSON.stringify(process.platform),
    'global': 'window'  // Add this line
  },
  server: {
    port: 3000,
    open: false,
    cors: true,
    strictPort: true,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets',
    rollupOptions: {
      external: ['electron'],  // Add this to prevent bundling electron
    }
  },
  resolve: {
    alias: {
      'electron': 'electron',
    },
  },
  optimizeDeps: {
    exclude: ['electron'],
  },
});