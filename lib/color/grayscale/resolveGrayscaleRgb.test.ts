import { describe, it, expect } from 'vitest';
import { resolveGrayscaleRgb } from './resolveGrayscaleRgb';

describe('resolveGrayscaleRgb', () => {
  it('happy path: returns "n, n, n" for number n', () => {
    expect(resolveGrayscaleRgb(0)).toBe('0, 0, 0');
    expect(resolveGrayscaleRgb(128)).toBe('128, 128, 128');
    expect(resolveGrayscaleRgb(255)).toBe('255, 255, 255');
  });

  it('edge case: boundaries 0 and 255', () => {
    expect(resolveGrayscaleRgb(0)).toBe('0, 0, 0');
    expect(resolveGrayscaleRgb(255)).toBe('255, 255, 255');
  });

  it('edge case: single digit and three digit values', () => {
    expect(resolveGrayscaleRgb(1)).toBe('1, 1, 1');
    expect(resolveGrayscaleRgb(100)).toBe('100, 100, 100');
  });

  it('invariant: output always has three comma-separated segments', () => {
    const out = resolveGrayscaleRgb(42);
    const parts = out.split(', ');
    expect(parts).toHaveLength(3);
    expect(parts[0]).toBe(parts[1]);
    expect(parts[1]).toBe(parts[2]);
    expect(parts[0]).toBe('42');
  });
});
