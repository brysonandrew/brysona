import { describe, it, expect } from 'vitest';
import { isNumberFinite } from './finite';

describe('isNumberFinite', () => {
  it('happy path: returns true for finite numbers', () => {
    expect(isNumberFinite(0)).toBe(true);
    expect(isNumberFinite(1)).toBe(true);
    expect(isNumberFinite(-1)).toBe(true);
  });
  it('edge case: large and decimal numbers', () => {
    expect(isNumberFinite(1e10)).toBe(true);
    expect(isNumberFinite(0.1)).toBe(true);
  });
  it('failure mode: returns false for NaN, Infinity, non-numbers', () => {
    expect(isNumberFinite(Number.NaN)).toBe(false);
    expect(isNumberFinite(Number.POSITIVE_INFINITY)).toBe(false);
    expect(isNumberFinite(Number.NEGATIVE_INFINITY)).toBe(false);
    expect(isNumberFinite('1')).toBe(false);
    expect(isNumberFinite(undefined)).toBe(false);
  });
});
