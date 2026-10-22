import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, existsSync } from 'fs';

// Custom plugin to copy manifest.json and icons to dist
const copyExtensionAssetsPlugin = () => ({
  name: 'copy-extension-assets',
  writeBundle() {
    if (!existsSync('dist')) {
      mkdirSync('dist', { recursive: true });
    }
    copyFileSync('manifest.json', 'dist/manifest.json');
    if (!existsSync('dist/icons')) {
      mkdirSync('dist/icons', { recursive: true });
    }
    ['icon16.png', 'icon48.png', 'icon128.png'].forEach((icon) => {
      if (existsSync(`icons/${icon}`)) {
        copyFileSync(`icons/${icon}`, `dist/icons/${icon}`);
      }
    });
  }
});

export default defineConfig({
  plugins: [react(), copyExtensionAssetsPlugin()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        dashboard: resolve(__dirname, 'src/dashboard/index.html'),
        background: resolve(__dirname, 'src/background/index.ts')
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'background') {
            return 'background.js';
          }
          return 'assets/[name]-[hash].js';
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  }
});
