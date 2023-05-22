import react from '@vitejs/plugin-react';
import * as path from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        // presets: ['@babel/preset-env'],
        // plugins: [['@babel/plugin-proposal-decorators', { version: '2023-01' }]],
        parserOpts: {
          plugins: ['decorators-legacy'],
        },
      },
    }),
  ],
  resolve: {
    alias: {
      'react-router-decorator': path.resolve(__dirname, './src/index.tsx'),
    },
  },
});
