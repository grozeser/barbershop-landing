const priceFormat = new Intl.NumberFormat('ru-RU');
// UTC, чтобы дата не съезжала на день в зависимости от часового пояса сборки
const dateFormat = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  timeZone: 'UTC',
});

export const formatPrice = (rub: number) => `${priceFormat.format(rub)} ₽`;

export const formatDate = (isoDate: string) => dateFormat.format(new Date(isoDate));
