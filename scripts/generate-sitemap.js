import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const BASE_URL = 'https://node.seedao.xyz'

// Add your routes here
const routes = ['/', '/archives', '/about']

const generateSitemap = () => {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${routes
      .map(
        route => `
    <url>
        <loc>${BASE_URL}${route}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>${route === '/' ? '1.0' : '0.8'}</priority>
    </url>`
      )
      .join('')}
</urlset>`

  fs.writeFileSync(path.join(__dirname, '../public/sitemap.xml'), sitemap)
  console.log('Sitemap generated successfully!')
}

generateSitemap()
