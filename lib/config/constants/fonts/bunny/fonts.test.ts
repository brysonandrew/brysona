import { describe, it, expect } from 'vitest';
import { BUNNY_FONTS } from './fonts';
import { BUNNY_CATEGORIES } from './categories';

const noDuplicateEntries = <T>(arr: readonly T[]): boolean =>
  new Set(arr).size === arr.length;

/** CSS font-weight range (fonts/bunny/fonts.ts uses numeric weights). */
const MIN_WEIGHT = 100;
const MAX_WEIGHT = 900;

describe('BUNNY_FONTS invariants', () => {
  it('is non-empty', () => {
    expect(BUNNY_FONTS.length).toBeGreaterThan(0);
  });
  it('each entry has shape { key, name, weights }', () => {
    for (const entry of BUNNY_FONTS) {
      expect(entry).toHaveProperty('key');
      expect(entry).toHaveProperty('name');
      expect(entry).toHaveProperty('weights');
      expect(Array.isArray(entry.weights)).toBe(true);
    }
  });
  it('each key is in BUNNY_CATEGORIES', () => {
    const categoriesSet = new Set(BUNNY_CATEGORIES);
    for (const entry of BUNNY_FONTS) {
      expect(categoriesSet.has(entry.key)).toBe(true);
    }
  });
  it('each entry has non-empty weights array', () => {
    for (const entry of BUNNY_FONTS) {
      expect(entry.weights.length).toBeGreaterThan(0);
    }
  });
  it('each weight value is in CSS range 100–900', () => {
    for (const entry of BUNNY_FONTS) {
      for (const w of entry.weights) {
        expect(w).toBeGreaterThanOrEqual(MIN_WEIGHT);
        expect(w).toBeLessThanOrEqual(MAX_WEIGHT);
      }
    }
  });
  it('font names list has no duplicates (canonical list)', () => {
    const names = BUNNY_FONTS.map((f) => f.name);
    expect(noDuplicateEntries(names)).toBe(true);
  });
});
