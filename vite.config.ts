import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { markdownRawPlugin } from './vite.markdown.plugin'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/node-conf-website/',
  plugins: [
    react(),
    markdownRawPlugin()
  ],
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  assetsInclude: ['src/content/*.md'],
  optimizeDeps: {
    exclude: ['src/content/*.md']
  }
})