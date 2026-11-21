import { defineConfig } from 'wxt';
import { resolve } from 'node:path';

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  srcDir: 'src',
  entrypointsDir: '.',
  publicDir: 'public',
  outDir: 'dist',

  hooks: {
    'entrypoints:found': (_wxt, infos) => {
      infos.push(
        { name: 'background', type: 'background', inputPath: resolve('src/scripts/background.ts') },
        { name: 'content', type: 'content-script', inputPath: resolve('src/scripts/content.ts') },
      );
    },
  },

  manifest: {
    name: 'Straiker',
    description: 'Straiker Chrome extension',
    version: "0.0.1",
    permissions: [],
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
