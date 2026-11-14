import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

export default defineConfig({
  plugins: [svelte()],
  // Relative base so the build works on GitHub Pages or any sub-path.
  base: './',
  resolve: {
    alias: {
      '@': path.resolve('./src'),
    },
  },
});
