import { describe, it, expect } from 'vitest';
import { isString } from './string';

describe('isString', () => {
  it('happy path: returns true for strings', () => {
    expect(isString('')).toBe(true);
    expect(isString('hello')).toBe(true);
  });
  it('edge case: empty string is string', () => {
    expect(isString('')).toBe(true);
  });
  it('failure mode: returns false for non-strings', () => {
    expect(isString(1)).toBe(false);
    expect(isString(null)).toBe(false);
    expect(isString(undefined)).toBe(false);
    expect(isString({})).toBe(false);
  });
});
