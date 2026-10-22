export const SLOT_STEP = 30;
export const BOOKING_DAYS = 30;
const BUSY_SHARE = 0.35;

const pad = (n: number) => String(n).padStart(2, '0');

/** Локальная дата в формате YYYY-MM-DD, как у input type="date" */
export const toISODate = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export function dateRange(now: Date) {
  const max = new Date(now);
  max.setDate(max.getDate() + BOOKING_DAYS);
  return { min: toISODate(now), max: toISODate(max) };
}

export function isDateInRange(date: string, now: Date) {
  const { min, max } = dateRange(now);
  return /^\d{4}-\d{2}-\d{2}$/.test(date) && date >= min && date <= max;
}

// FNV-1a: детерминированная «занятость», чтобы слоты не прыгали между перерисовками
function hash(text: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0) / 2 ** 32;
}

const isBusy = (date: string, masterId: string, time: string) =>
  hash(`${date}|${masterId}|${time}`) < BUSY_SHARE;

export interface Slot {
  time: string;
  busy: boolean;
}

interface SlotQuery {
  date: string;
  /** минуты */
  duration: number;
  /** один мастер или все — для варианта «любой свободный» */
  masterIds: string[];
  now: Date;
  open: number;
  close: number;
}

// shortcut: занятость проверяется только по началу слота, без пересечения с длительностью — данные всё равно демо
// shortcut: «сейчас» берётся по часам браузера, а не по Москве; при реальном бэкенде время отдаёт сервер
export function getSlots({ date, duration, masterIds, now, open, close }: SlotQuery): Slot[] {
  const isToday = date === toISODate(now);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const slots: Slot[] = [];
  for (let m = open * 60; m + duration <= close * 60; m += SLOT_STEP) {
    if (isToday && m <= nowMinutes) continue;
    const time = `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
    slots.push({ time, busy: masterIds.every((id) => isBusy(date, id, time)) });
  }
  return slots;
}

/** 10 цифр после +7 или null */
export function normalizePhone(input: string) {
  let digits = input.replace(/\D/g, '');
  if (digits.length === 11 && (digits[0] === '7' || digits[0] === '8')) digits = digits.slice(1);
  return digits.length === 10 ? digits : null;
}

/** Маска «+7 (999) 123-45-67», которая растёт по мере ввода */
export function formatPhoneInput(input: string) {
  let digits = input.replace(/\D/g, '');
  // код страны отбрасываем, только если он точно есть: иначе код 812 потерял бы восьмёрку
  if (input.trimStart().startsWith('+7') || (digits.length === 11 && /^[78]/.test(digits))) {
    digits = digits.slice(1);
  }
  digits = digits.slice(0, 10);
  if (!digits) return '';
  const parts = [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 8), digits.slice(8, 10)];
  let out = `+7 (${parts[0]}`;
  if (parts[1]) out += `) ${parts[1]}`;
  if (parts[2]) out += `-${parts[2]}`;
  if (parts[3]) out += `-${parts[3]}`;
  return out;
}

export interface BookingFields {
  service: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  consent: boolean;
}

export type FieldKey = keyof BookingFields;

/** Список полей с ошибками в порядке формы */
export function validate(fields: BookingFields, now: Date): FieldKey[] {
  const errors: FieldKey[] = [];
  if (!fields.service) errors.push('service');
  if (!isDateInRange(fields.date, now)) errors.push('date');
  if (!fields.time) errors.push('time');
  if (!fields.name.trim()) errors.push('name');
  if (!normalizePhone(fields.phone)) errors.push('phone');
  if (!fields.consent) errors.push('consent');
  return errors;
}
