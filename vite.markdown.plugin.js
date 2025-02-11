export function markdownRawPlugin() {
  return {
    name: 'vite:markdown-raw',
    transform(code, id) {
      if (id.endsWith('.md?raw')) {
        return {
          code: `export default ${JSON.stringify(code)}`,
          map: null
        };
      }
    }
  };
}
