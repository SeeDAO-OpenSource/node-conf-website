import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// @ts-expect-error - markdown plugin types are not available
import { markdownRawPlugin } from './vite.markdown.plugin'
import imagePlugin from './vite.image.plugin'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'serve' ? '/node-conf-website' : '/',
  plugins: [react(), markdownRawPlugin(), imagePlugin()],
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  assetsInclude: ['src/content/about/*.md'],
  optimizeDeps: {
    exclude: ['src/content/about/*.md'],
  },
}))
