import { describe, it, expect } from 'vitest';
import { resolveRange } from './resolveRange';

describe('resolveRange', () => {
  it('happy path: returns stepped values from min toward max with multiplier 1', () => {
    const out = resolveRange(0, 5, 1);
    expect(out).toEqual([0, 1, 2, 3, 4]);
  });

  it('happy path: uses custom multiplier', () => {
    const out = resolveRange(0, 10, 2);
    expect(out).toEqual([0, 2, 4, 6, 8]);
  });

  it('edge case: min equals max yields empty array', () => {
    const out = resolveRange(5, 5, 1);
    expect(out).toEqual([]);
  });

  it('failure mode: max less than min throws Invalid array length', () => {
    expect(() => resolveRange(10, 5, 1)).toThrow(RangeError);
    expect(() => resolveRange(10, 5, 1)).toThrow('Invalid array length');
  });

  it('edge case: fractional multiplier produces decimal steps', () => {
    const out = resolveRange(0.5, 2, 0.5);
    expect(out).toEqual([0.5, 1, 1.5]);
  });

  it('edge case: default multiplier is 1', () => {
    const out = resolveRange(1, 4);
    expect(out).toEqual([1, 2, 3]);
  });

  it('failure / no match: zero multiplier divides by zero; length is -Infinity or NaN, array is empty or invalid', () => {
    const out = resolveRange(0, 10, 0);
    expect(Number.isFinite(out.length)).toBe(true);
    expect(out.length).toBe(0);
  });
});
