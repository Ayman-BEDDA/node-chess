import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 8080, // Ajoutez cette ligne
    host: '0.0.0.0' // Décommentez cette ligne si vous voulez que votre application soit accessible à partir d'autres machines sur le réseau
  },
})
