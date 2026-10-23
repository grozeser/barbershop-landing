// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://grozeser.github.io',
  // GitHub Pages serves the repo under a subpath; build links with import.meta.env.BASE_URL
  base: '/barbershop-landing',
  // без фильтра в карту попадает и /barbershop-landing, и /barbershop-landing/ — оставляем канонический
  integrations: [sitemap({ filter: (page) => page.endsWith('/') })],
  vite: {
    plugins: [tailwindcss()],
  },
});
