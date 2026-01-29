import { describe, it, expect } from 'vitest';
import { isDefined } from './defined';

describe('isDefined', () => {
  it('happy path: returns true for defined values', () => {
    expect(isDefined(0)).toBe(true);
    expect(isDefined('')).toBe(true);
    expect(isDefined(null)).toBe(true);
    expect(isDefined(false)).toBe(true);
  });
  it('edge case: object and array are defined', () => {
    expect(isDefined({})).toBe(true);
    expect(isDefined([])).toBe(true);
  });
  it('failure mode: returns false only for undefined', () => {
    expect(isDefined(undefined)).toBe(false);
  });
});
