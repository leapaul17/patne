import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(fileURLToPath(import.meta.url))

// Publié sur GitHub Pages sous /patne/ : la racine = version de Léa, /manman/ = version de sa mère.
export default defineConfig({
  base: '/patne/',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        manman: resolve(root, 'manman/index.html'),
      },
    },
  },
})
