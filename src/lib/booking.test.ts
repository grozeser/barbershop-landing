import { describe, expect, it } from 'vitest';
import {
  dateRange,
  formatPhoneInput,
  getSlots,
  isDateInRange,
  normalizePhone,
  validate,
} from './booking';

const now = new Date(2026, 9, 23, 14, 10); // 23 октября 2026, 14:10 по локальному времени
const base = { duration: 60, masterIds: ['artem'], now, open: 10, close: 22 };

describe('getSlots', () => {
  it('идёт с шагом 30 минут и заканчивается до закрытия', () => {
    const slots = getSlots({ ...base, date: '2026-10-24' });
    expect(slots[0].time).toBe('10:00');
    expect(slots[1].time).toBe('10:30');
    expect(slots.at(-1)?.time).toBe('21:00');
    expect(slots).toHaveLength(23);
  });

  it('учитывает длительность услуги', () => {
    const slots = getSlots({ ...base, date: '2026-10-24', duration: 90 });
    expect(slots.at(-1)?.time).toBe('20:30');
  });

  it('не показывает прошедшее время сегодня', () => {
    const slots = getSlots({ ...base, date: '2026-10-23' });
    expect(slots[0].time).toBe('14:30');
  });

  it('возвращает пустой список, если сегодня уже поздно', () => {
    const late = new Date(2026, 9, 23, 21, 30);
    expect(getSlots({ ...base, now: late, date: '2026-10-23' })).toEqual([]);
  });

  it('детерминирован: одинаковый запрос — одинаковая занятость', () => {
    const a = getSlots({ ...base, date: '2026-10-25' });
    const b = getSlots({ ...base, date: '2026-10-25' });
    expect(a).toEqual(b);
    expect(a.some((s) => s.busy)).toBe(true);
    expect(a.some((s) => !s.busy)).toBe(true);
  });

  it('для «любого мастера» слот занят, только если заняты все', () => {
    const ids = ['artem', 'alina', 'denis', 'mark'];
    const any = getSlots({ ...base, date: '2026-10-26', masterIds: ids });
    const each = ids.map((id) => getSlots({ ...base, date: '2026-10-26', masterIds: [id] }));
    any.forEach((slot, i) => {
      expect(slot.busy).toBe(each.every((slots) => slots[i].busy));
    });
  });
});

describe('dates', () => {
  it('разрешает от сегодня до +30 дней', () => {
    expect(dateRange(now)).toEqual({ min: '2026-10-23', max: '2026-11-22' });
    expect(isDateInRange('2026-10-23', now)).toBe(true);
    expect(isDateInRange('2026-11-22', now)).toBe(true);
    expect(isDateInRange('2026-10-22', now)).toBe(false);
    expect(isDateInRange('2026-11-23', now)).toBe(false);
    expect(isDateInRange('', now)).toBe(false);
  });
});

describe('phone', () => {
  it('нормализует разные форматы в 10 цифр', () => {
    expect(normalizePhone('+7 (999) 123-45-67')).toBe('9991234567');
    expect(normalizePhone('89991234567')).toBe('9991234567');
    expect(normalizePhone('9991234567')).toBe('9991234567');
    expect(normalizePhone('+7 (999) 123')).toBeNull();
    expect(normalizePhone('')).toBeNull();
  });

  it('маска растёт по мере ввода и не даёт лишних цифр', () => {
    expect(formatPhoneInput('')).toBe('');
    expect(formatPhoneInput('9')).toBe('+7 (9');
    expect(formatPhoneInput('9991')).toBe('+7 (999) 1');
    expect(formatPhoneInput('999123456')).toBe('+7 (999) 123-45-6');
    expect(formatPhoneInput('+7 (999) 123-45-678')).toBe('+7 (999) 123-45-67');
    expect(formatPhoneInput('89991234567')).toBe('+7 (999) 123-45-67');
    expect(formatPhoneInput('+7 999 123 45 67')).toBe('+7 (999) 123-45-67');
  });

  it('не принимает первую 8 или 7 за код страны при вводе по цифре', () => {
    expect(formatPhoneInput('8')).toBe('+7 (8');
    expect(formatPhoneInput('812')).toBe('+7 (812');
    expect(formatPhoneInput('+7 (812')).toBe('+7 (812');
    expect(formatPhoneInput('7')).toBe('+7 (7');
  });
});

describe('validate', () => {
  const valid = {
    service: 'haircut',
    date: '2026-10-24',
    time: '12:00',
    name: 'Иван',
    phone: '+7 (999) 123-45-67',
    consent: true,
  };

  it('пропускает заполненную форму', () => {
    expect(validate(valid, now)).toEqual([]);
  });

  it('возвращает все ошибки по порядку полей', () => {
    const empty = { service: '', date: '', time: '', name: '  ', phone: '+7 (9', consent: false };
    expect(validate(empty, now)).toEqual(['service', 'date', 'time', 'name', 'phone', 'consent']);
  });
});
