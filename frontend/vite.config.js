import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import  viteCommonjs  from 'vite-plugin-commonjs';

export default defineConfig({
  plugins: [
    viteCommonjs(), // Handle CommonJS modules
    react(),
    tailwindcss(),
  ]
});