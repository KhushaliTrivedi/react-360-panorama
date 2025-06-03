import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import { config as dotenvConfig } from 'dotenv';

dotenvConfig(); // Load environment variables from .env

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': process.env
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
