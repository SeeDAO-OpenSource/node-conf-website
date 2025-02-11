import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// @ts-ignore
import { markdownRawPlugin } from './vite.markdown.plugin'
import imagePlugin from './vite.image.plugin'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/node-conf-website',
  plugins: [
    react(),
    markdownRawPlugin(),
    imagePlugin()
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
