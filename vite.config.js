// vite.config.js
import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

export default defineConfig({
  base: './', // 👈 Use relative paths
  plugins: [preact()],
});
