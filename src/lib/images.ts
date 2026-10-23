import type { ImageMetadata } from 'astro';

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/images/*.jpg', {
  eager: true,
});

/** Фото из src/assets/images по имени файла без расширения; опечатка в имени ломает сборку */
export function image(name: string) {
  const file = files[`../assets/images/${name}.jpg`];
  if (!file) throw new Error(`Нет фото src/assets/images/${name}.jpg`);
  return file.default;
}
