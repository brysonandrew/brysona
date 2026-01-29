import { describe, it, expect } from 'vitest';
import { GOOGLE_CATEGORIES } from './categories';

const noDuplicateEntries = <T>(arr: readonly T[]): boolean =>
  new Set(arr).size === arr.length;

/** Contract: categories in fonts/google/categories.ts are the canonical set. */
const EXPECTED_GOOGLE_CATEGORIES = [
  'sans-serif',
  'display',
  'serif',
  'handwriting',
  'monospace',
] as const;

describe('GOOGLE_CATEGORIES invariants', () => {
  it('is non-empty', () => {
    expect(GOOGLE_CATEGORIES.length).toBeGreaterThan(0);
  });
  it('has no duplicate entries', () => {
    expect(noDuplicateEntries(GOOGLE_CATEGORIES)).toBe(true);
  });
  it('contains all expected category keys', () => {
    for (const key of EXPECTED_GOOGLE_CATEGORIES) {
      expect(GOOGLE_CATEGORIES).toContain(key);
    }
  });
  it('has exactly the expected number of categories', () => {
    expect(GOOGLE_CATEGORIES.length).toBe(EXPECTED_GOOGLE_CATEGORIES.length);
  });
});
