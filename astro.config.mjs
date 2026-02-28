// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import linkValidator from 'astro-link-validator';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.escrituraextendida.com',
  integrations: [
    mdx(),
    linkValidator({
      checkExternal: false,
      failOnBrokenLinks: true,
      verbose: false,
    }),
  ],
  markdown: {
    // Example: switch highlight type or theme
    syntaxHighlight: {
      type: 'shiki',       // or 'prism'
      // ... more settings
    },
    shikiConfig: {
      // Use a different Shiki theme for code highlighting. Change this to any Shiki theme
      // you prefer (e.g. 'github-dark', 'nord', 'one-dark-pro', 'material-oceanic').
      theme: 'github-dark',
      // maybe languages list, etc
    },
  },
});