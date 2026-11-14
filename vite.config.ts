import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  // Relative base so the build works on GitHub Pages or any sub-path.
  base: './',
  resolve: {
    alias: {
      '@': path.resolve('./src'),
    },
  },
});
