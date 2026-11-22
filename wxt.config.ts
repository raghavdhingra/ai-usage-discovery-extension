import { defineConfig } from 'wxt';
import { resolve } from 'node:path';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  srcDir: 'src',
  entrypointsDir: '.',
  publicDir: 'public',
  outDir: 'dist',
  vite: () => ({
    plugins: [tailwindcss()],
  }),

  hooks: {
    'entrypoints:found': (_wxt, infos) => {
      infos.push(
        { name: 'service-worker', type: 'background', inputPath: resolve('src/scripts/service-worker.ts') },
        { name: 'content', type: 'content-script', inputPath: resolve('src/scripts/content.ts') },
      );
    },
  },

  manifest: {
    name: 'Straiker',
    description: 'Straiker Chrome extension',
    version: "0.0.1",
    permissions: ['storage'],
    icons: {
      16: 'icon/16.png',
      32: 'icon/32.png',
      48: 'icon/48.png',
      96: 'icon/96.png',
      128: 'icon/128.png',
    },
    action: {
      default_title: 'Straiker',
      default_icon: {
        16: 'icon/16.png',
        32: 'icon/32.png',
        48: 'icon/48.png',
      },
    },
  },
});
