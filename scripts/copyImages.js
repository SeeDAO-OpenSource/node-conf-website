import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to ensure directory exists
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Function to copy images
function copyImages() {
  const sourceDir = path.join(__dirname, '../src/content/about');
  const targetDir = path.join(__dirname, '../public/images/about');

  // Ensure target directory exists
  ensureDirectoryExists(targetDir);

  // Read source directory
  const files = fs.readdirSync(sourceDir);

  // Copy image files
  files.forEach(file => {
    if (file.match(/\.(jpg|jpeg|png|gif|svg)$/i)) {
      const sourcePath = path.join(sourceDir, file);
      const targetPath = path.join(targetDir, file);
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`Copied ${file} to public/images/about/`);
    }
  });
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  copyImages();
}

export { copyImages };
