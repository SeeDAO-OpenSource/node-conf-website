import type { Plugin } from 'vite';
import fs from 'fs';

export function markdownRawPlugin(): Plugin {
  return {
    name: 'vite-plugin-markdown-raw',
    transform(code: string, id: string) {
      if (id.endsWith('.md?raw')) {
        const path = id.slice(0, -4); // remove '?raw'
        const content = fs.readFileSync(path, 'utf-8');
        return {
          code: `export default ${JSON.stringify(content)};`,
          map: null
        };
      }
    }
  };
}
