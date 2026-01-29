import { describe, it, expect } from 'vitest';
import { BUNNY_CATEGORIES } from './categories';

const noDuplicateEntries = <T>(arr: readonly T[]): boolean =>
  new Set(arr).size === arr.length;

/** Contract: categories in fonts/bunny/categories.ts are the canonical set. */
const EXPECTED_BUNNY_CATEGORIES = [
  'sans-serif',
  'serif',
  'display',
  'handwriting',
  'monospace',
] as const;

describe('BUNNY_CATEGORIES invariants', () => {
  it('is non-empty', () => {
    expect(BUNNY_CATEGORIES.length).toBeGreaterThan(0);
  });
  it('has no duplicate entries', () => {
    expect(noDuplicateEntries(BUNNY_CATEGORIES)).toBe(true);
  });
  it('contains all expected category keys', () => {
    for (const key of EXPECTED_BUNNY_CATEGORIES) {
      expect(BUNNY_CATEGORIES).toContain(key);
    }
  });
  it('has exactly the expected number of categories', () => {
    expect(BUNNY_CATEGORIES.length).toBe(EXPECTED_BUNNY_CATEGORIES.length);
  });
});
