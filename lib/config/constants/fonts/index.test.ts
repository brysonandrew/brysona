import { describe, it, expect } from 'vitest';
import {
  FONT_KEYS,
  FONT_SHARE_CATEGORIES,
  FONT_SHARE_NAMES,
} from './index';

const noDuplicateEntries = <T>(arr: readonly T[]): boolean =>
  new Set(arr).size === arr.length;

describe('lib/config/constants/fonts index invariants', () => {
  describe('FONT_KEYS', () => {
    it('is non-empty', () => {
      expect(FONT_KEYS.length).toBeGreaterThan(0);
    });
    it('has no duplicate entries', () => {
      expect(noDuplicateEntries(FONT_KEYS)).toBe(true);
    });
    it('contains required keys: sans, serif, mono', () => {
      expect(FONT_KEYS).toContain('sans');
      expect(FONT_KEYS).toContain('serif');
      expect(FONT_KEYS).toContain('mono');
    });
  });

  describe('FONT_SHARE_CATEGORIES', () => {
    it('is non-empty', () => {
      expect(FONT_SHARE_CATEGORIES.length).toBeGreaterThan(0);
    });
    it('has no duplicate entries', () => {
      expect(noDuplicateEntries(FONT_SHARE_CATEGORIES)).toBe(true);
    });
    it('contains required categories: sans, serif', () => {
      expect(FONT_SHARE_CATEGORIES).toContain('sans');
      expect(FONT_SHARE_CATEGORIES).toContain('serif');
    });
  });

  describe('FONT_SHARE_NAMES', () => {
    it('is non-empty', () => {
      expect(FONT_SHARE_NAMES.length).toBeGreaterThan(0);
    });
    it('has no duplicate entries', () => {
      expect(noDuplicateEntries(FONT_SHARE_NAMES)).toBe(true);
    });
  });
});
