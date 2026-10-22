// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://grozeser.github.io',
  // GitHub Pages serves the repo under a subpath; build links with import.meta.env.BASE_URL
  base: '/barbershop-landing',
  vite: {
    plugins: [tailwindcss()],
  },
});
