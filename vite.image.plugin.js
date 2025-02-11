import { copyImages } from './scripts/copyImages.js';

export default function imagePlugin() {
  return {
    name: 'vite-plugin-copy-images',
    buildStart() {
      copyImages();
    },
    handleHotUpdate({ file }) {
      if (file.includes('src/content/about') && file.match(/\.(jpg|jpeg|png|gif|svg)$/i)) {
        copyImages();
      }
    }
  };
}
