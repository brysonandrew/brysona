import { describe, it, expect } from 'vitest';
import { GOOGLE_FONTS } from './fonts';
import { GOOGLE_CATEGORIES } from './categories';

const noDuplicateEntries = <T>(arr: readonly T[]): boolean =>
  new Set(arr).size === arr.length;

describe('GOOGLE_FONTS invariants', () => {
  it('is non-empty', () => {
    expect(GOOGLE_FONTS.length).toBeGreaterThan(0);
  });
  it('each entry has shape { key, name, weights }', () => {
    for (const entry of GOOGLE_FONTS) {
      expect(entry).toHaveProperty('key');
      expect(entry).toHaveProperty('name');
      expect(entry).toHaveProperty('weights');
      expect(Array.isArray(entry.weights)).toBe(true);
    }
  });
  it('each key is in GOOGLE_CATEGORIES', () => {
    const categoriesSet = new Set(GOOGLE_CATEGORIES);
    for (const entry of GOOGLE_FONTS) {
      expect(categoriesSet.has(entry.key)).toBe(true);
    }
  });
  it('each entry has non-empty weights array', () => {
    for (const entry of GOOGLE_FONTS) {
      expect(entry.weights.length).toBeGreaterThan(0);
    }
  });
  it('font names list has no duplicates (canonical list)', () => {
    const names = GOOGLE_FONTS.map((f) => f.name);
    expect(noDuplicateEntries(names)).toBe(true);
  });
});
