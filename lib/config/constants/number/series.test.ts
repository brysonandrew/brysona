import { describe, it, expect } from 'vitest';
import { DIGITS, INDICIES } from './series';

const noDuplicateEntries = <T>(arr: readonly T[]): boolean =>
  new Set(arr).size === arr.length;

/** Contract: DIGITS in number/series.ts are 1–9. */
const MIN_DIGIT = 1;
const MAX_DIGIT = 9;

/** Contract: INDICIES are 0 plus DIGITS, so 0–9. */
const MIN_INDEX = 0;
const MAX_INDEX = 9;

describe('number/series invariants', () => {
  describe('DIGITS', () => {
    it('is non-empty', () => {
      expect(DIGITS.length).toBeGreaterThan(0);
    });
    it('has no duplicate entries', () => {
      expect(noDuplicateEntries(DIGITS)).toBe(true);
    });
    it('values are within 1–9', () => {
      for (const d of DIGITS) {
        expect(d).toBeGreaterThanOrEqual(MIN_DIGIT);
        expect(d).toBeLessThanOrEqual(MAX_DIGIT);
      }
    });
    it('has exactly 9 entries (1–9)', () => {
      expect(DIGITS.length).toBe(9);
    });
  });

  describe('INDICIES', () => {
    it('is non-empty', () => {
      expect(INDICIES.length).toBeGreaterThan(0);
    });
    it('has no duplicate entries', () => {
      expect(noDuplicateEntries(INDICIES)).toBe(true);
    });
    it('values are within 0–9', () => {
      for (const i of INDICIES) {
        expect(i).toBeGreaterThanOrEqual(MIN_INDEX);
        expect(i).toBeLessThanOrEqual(MAX_INDEX);
      }
    });
    it('starts with 0 and has length 10', () => {
      expect(INDICIES[0]).toBe(0);
      expect(INDICIES.length).toBe(10);
    });
  });
});
