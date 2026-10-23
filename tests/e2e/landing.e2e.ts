import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const WCAG = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

async function expectNoAxeViolations(page: Page, include?: string) {
  const builder = new AxeBuilder({ page }).withTags(WCAG);
  if (include) builder.include(include);
  const { violations } = await builder.analyze();
  expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(', ')}`)).toEqual([]);
}

const submit = (page: Page) => page.getByRole('button', { name: 'Записаться', exact: true });

test('страница грузится без ошибок и без нарушений WCAG', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => message.type() === 'error' && errors.push(message.text()));
  page.on('pageerror', (error) => errors.push(error.message));

  await page.goto('./');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  expect(overflow).toBe(false);
  await expectNoAxeViolations(page);
  expect(errors).toEqual([]);
});

test('запись: пустая форма показывает ошибки и ставит фокус на первое поле', async ({ page }) => {
  await page.goto('./#booking');
  await submit(page).click();

  await expect(page.locator('#service')).toBeFocused();
  await expect(page.locator('[id$="-error"]:not(:empty)')).toHaveCount(6);
  await expect(page.locator('#phone')).toHaveAttribute('aria-invalid', 'true');
  await expectNoAxeViolations(page, '#booking');
});

test('запись: предвыбор мастера и успешная отправка', async ({ page }) => {
  await page.goto('./');
  await page.locator('a[data-master="alina"]').click();
  await expect(page.locator('input[name="master"][value="alina"]')).toBeChecked();

  await page.locator('#service').selectOption('shave');
  // последний доступный день: на нём точно нет прошедших слотов
  const lastDay = await page.locator('#date').getAttribute('max');
  await page.locator('#date').fill(lastDay!);
  const slot = page.locator('#time-slots label:has(input:not(:disabled))').first();
  const time = (await slot.textContent())!.trim();
  await slot.click();

  await page.locator('#name').fill('Иван');
  await page.locator('#phone').pressSequentially('9991234567');
  await expect(page.locator('#phone')).toHaveValue('+7 (999) 123-45-67');
  await page.locator('#consent').check();
  await submit(page).click();

  const success = page.locator('#booking-success');
  await expect(success).toBeVisible();
  await expect(success).toBeFocused();
  await expect(page.locator('#booking-summary')).toContainText('Королевское бритьё, Алина Ветрова');
  await expect(page.locator('#booking-summary')).toContainText(`в ${time}`);
  // данные формы не должны попасть в адрес страницы
  expect(new URL(page.url()).search).toBe('');
});

test('лайтбокс листается, проходит axe и возвращает фокус', async ({ page }) => {
  await page.goto('./');
  const triggers = page.locator('[data-lightbox]');
  await triggers.nth(1).click();

  const dialog = page.locator('#lightbox');
  const caption = page.locator('#lightbox-caption');
  await expect(dialog).toBeVisible();
  await expect(caption).toContainText('2 / 6');
  await page.keyboard.press('ArrowRight');
  await expect(caption).toContainText('3 / 6');
  await expectNoAxeViolations(page, '#lightbox');

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(triggers.nth(2)).toBeFocused();
});

test.describe('телефон', () => {
  test.skip(({ isMobile }) => !isMobile, 'только для мобильного профиля');

  test('меню закрывается после перехода по пункту', async ({ page }) => {
    await page.goto('./');
    await page.getByRole('button', { name: 'Открыть меню' }).click();
    const menu = page.locator('#mobile-menu');
    await expect(menu).toBeVisible();
    await menu.getByRole('link', { name: 'Мастера' }).click();
    await expect(menu).toBeHidden();
    await expect(page).toHaveURL(/#masters$/);
  });

  test('плавающая кнопка скрыта на первом экране и появляется ниже', async ({ page }) => {
    await page.goto('./');
    const cta = page.locator('#mobile-cta');
    await expect(cta).toBeHidden();
    await page.locator('#masters').scrollIntoViewIfNeeded();
    await expect(cta).toBeVisible();
  });
});
