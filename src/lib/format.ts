const priceFormat = new Intl.NumberFormat('ru-RU');
// UTC, чтобы дата не съезжала на день в зависимости от часового пояса сборки
const dateFormat = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  timeZone: 'UTC',
});

export const formatPrice = (rub: number) => `${priceFormat.format(rub)}\u00A0₽`;

/** 9 → «09:00», как требует schema.org и как показываем на сайте */
export const formatHour = (hour: number) => `${String(hour).padStart(2, '0')}:00`;

export const formatDate = (isoDate: string) => dateFormat.format(new Date(isoDate));
