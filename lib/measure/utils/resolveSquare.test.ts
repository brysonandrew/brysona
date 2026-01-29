import { describe, it, expect } from 'vitest';
import { resolveSquare } from './resolveSquare';

describe('resolveSquare', () => {
  it('happy path: returns equal width and height for positive size', () => {
    const result = resolveSquare(100);
    expect(result).toEqual({ width: 100, height: 100 });
    expect(resolveSquare(1)).toEqual({ width: 1, height: 1 });
  });

  it('edge case: zero size returns zero dimensions', () => {
    expect(resolveSquare(0)).toEqual({ width: 0, height: 0 });
  });

  it('edge case: fractional size is preserved', () => {
    const result = resolveSquare(16.5);
    expect(result).toEqual({ width: 16.5, height: 16.5 });
  });

  it('failure mode: negative size is returned as-is (caller responsibility)', () => {
    const result = resolveSquare(-10);
    expect(result).toEqual({ width: -10, height: -10 });
  });
});
