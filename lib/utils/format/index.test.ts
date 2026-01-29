import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  capitalize,
  camelToKebab,
  kebabToSnake,
  kebabToTitle,
  nToMoney,
  formatUrl,
  formatNZLongDate,
  formateShortDate,
} from './index';

describe('format (pure string/number)', () => {
  describe('capitalize', () => {
    it('happy path: capitalizes first letter and lowercases rest', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('HELLO')).toBe('Hello');
    });
    it('edge case: single char and null', () => {
      expect(capitalize('a')).toBe('A');
      expect(capitalize(null)).toBe('');
    });
    it('failure mode: empty string returns empty', () => {
      expect(capitalize('')).toBe('');
    });
  });

  describe('kebabToSnake', () => {
    it('happy path: replaces hyphens with underscores', () => {
      expect(kebabToSnake('foo-bar-baz')).toBe('foo_bar_baz');
    });
    it('edge case: single segment unchanged', () => {
      expect(kebabToSnake('foo')).toBe('foo');
    });
    it('failure mode: empty string returns empty', () => {
      expect(kebabToSnake('')).toBe('');
    });
  });

  describe('kebabToTitle', () => {
    it('happy path: kebab to title case', () => {
      expect(kebabToTitle('foo-bar')).toBe('Foo Bar');
    });
    it('edge case: single segment', () => {
      expect(kebabToTitle('foo')).toBe('Foo');
    });
    it('failure mode: empty string returns empty', () => {
      expect(kebabToTitle('')).toBe('');
    });
  });

  describe('nToMoney', () => {
    it('happy path: formats number as locale money string', () => {
      expect(nToMoney(1000)).toBe('$1,000');
      expect(nToMoney(0)).toBe('$0');
    });
    it('edge case: large number and decimals', () => {
      expect(nToMoney(1234567.89)).toMatch(/\$1[,.]234[,.]567/);
    });
    it('failure mode: NaN produces $NaN in string', () => {
      expect(nToMoney(Number.NaN)).toBe('$NaN');
    });
  });

  describe('formatUrl', () => {
    it('happy path: re-export from url works', () => {
      expect(formatUrl('https://example.com')).toBe('www.example.com');
    });
  });

  describe('camelToKebab / pascalToKebab', () => {
    it('regression: letter before capital gets hyphen (pascalToKebab insert point)', () => {
      expect(camelToKebab('camelCase')).toBe('camel-case');
    });
  });
});

describe('format (Date-dependent, mocked)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-15T12:00:00.000Z'));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  describe('formatNZLongDate', () => {
    it('happy path: formats date in en-NZ short style', () => {
      const d = new Date('2025-01-15');
      expect(formatNZLongDate(d)).toMatch(/\d{1,2}\/\d{1,2}\/\d{2,4}/);
    });
    it('edge case: same date object returns consistent string', () => {
      const d = new Date('2025-01-15');
      expect(formatNZLongDate(d)).toBe(formatNZLongDate(d));
    });
  });

  describe('formateShortDate', () => {
    it('happy path: formats date as short month year', () => {
      expect(formateShortDate(new Date('2025-01-15'))).toMatch(/Jan.*2025/);
    });
    it('edge case: undefined returns Present', () => {
      expect(formateShortDate(undefined)).toBe('Present');
    });
    it('failure mode: no arg returns Present', () => {
      expect(formateShortDate()).toBe('Present');
    });
  });
});
