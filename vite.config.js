// vite.config.js
const path = require('path');
const { defineConfig } = require('vite');
import { peerDependencies, dependencies } from './package.json';

module.exports = defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'samba',
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: [
        ...Object.keys(peerDependencies),
        ...Object.keys(dependencies),
      ],
    },
  },
});
