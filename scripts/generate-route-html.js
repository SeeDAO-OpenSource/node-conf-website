import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const BASE_URL = 'https://taoist-labs.github.io/node-conf-website'

// Define routes and their metadata
const routes = [
  {
    path: '/about',
    title: 'About SeeDAO节点共识大会 | Web3社区治理',
    description: 'SeeDAO节点共识大会的背景、目标和愿景。了解我们如何通过Web3技术推动社区治理创新。',
    image: `${BASE_URL}/og-image.jpg`,
  },
  {
    path: '/archives',
    title: 'SeeDAO节点共识大会历史记录 | 历届会议归档',
    description: 'SeeDAO节点共识大会的历史记录和往届会议记录。查看过去的提案、决议和社区发展历程。',
    image: `${BASE_URL}/og-image.jpg`,
  },
]

// Read the template HTML file
const templatePath = path.join(__dirname, '../index.html')
const template = fs.readFileSync(templatePath, 'utf-8')

// Generate HTML for each route
routes.forEach(route => {
  // Create meta tags
  const metaTags = `
    <!-- Primary Meta Tags -->
    <meta name="title" content="${route.title}" />
    <meta name="description" content="${route.description}" />
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${BASE_URL}${route.path}" />
    <meta property="og:title" content="${route.title}" />
    <meta property="og:description" content="${route.description}" />
    <meta property="og:image" content="${route.image}" />
    
    <!-- Twitter Meta Tags -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${BASE_URL}${route.path}" />
    <meta name="twitter:title" content="${route.title}" />
    <meta name="twitter:description" content="${route.description}" />
    <meta name="twitter:image" content="${route.image}" />
  `

  // Replace the existing meta tags in the template
  const modifiedHtml = template.replace(
    /(<!-- Primary Meta Tags -->)[\s\S]*?(<!-- Baidu Meta Tags -->)/,
    `$1${metaTags}$2`
  )

  // Create the directory if it doesn't exist
  const routePath = path.join(__dirname, '../dist', route.path)
  fs.mkdirSync(routePath, { recursive: true })

  // Write the HTML file
  fs.writeFileSync(path.join(routePath, 'index.html'), modifiedHtml)
  console.log(`Generated HTML for ${route.path}`)
})

console.log('Route HTML generation complete!')
