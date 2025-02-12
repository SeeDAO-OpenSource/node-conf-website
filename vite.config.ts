import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { markdownRawPlugin } from './vite.markdown.plugin'
import imagePlugin from './vite.image.plugin'

// https://vitejs.dev/config/
export default defineConfig(({ command }: { command: string }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _unused = command
  return {
    base: '/',
    plugins: [react(), markdownRawPlugin(), imagePlugin()],
    server: {
      port: 3000,
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
      emptyOutDir: true,
    },
    preview: {
      port: 4173,
      strictPort: true,
      host: true,
    },
    assetsInclude: ['src/content/about/*.md'],
    optimizeDeps: {
      exclude: ['src/content/about/*.md'],
    },
  }
})
