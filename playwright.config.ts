import { defineConfig, devices } from '@playwright/test';

// По умолчанию тесты идут по собранному сайту (astro preview), поэтому перед ними нужен npm run build.
// BASE_URL=https://grozeser.github.io/barbershop-landing/ — смоук-тест живого сайта после деплоя
const local = 'http://127.0.0.1:4331/barbershop-landing/';
const url = process.env.BASE_URL ?? local;

export default defineConfig({
  testDir: 'tests/e2e',
  testMatch: '*.e2e.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: url,
    locale: 'ru-RU',
    // без анимации появления блоки сразу видны, и axe проверяет их реальный контраст
    reducedMotion: 'reduce',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: 'npx astro preview --port 4331 --host 127.0.0.1',
        url: local,
        reuseExistingServer: !process.env.CI,
      },
});
