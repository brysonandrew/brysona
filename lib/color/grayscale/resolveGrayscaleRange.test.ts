import { describe, it, expect } from 'vitest';
import { resolveGrayscaleRange } from './resolveGrayscaleRange';

describe('resolveGrayscaleRange', () => {
  it('happy path: returns array of 10 grayscale rgb strings from min toward max', () => {
    const out = resolveGrayscaleRange(0, 255);
    expect(Array.isArray(out)).toBe(true);
    expect(out).toHaveLength(10);
    expect(out[0]).toBe('0, 0, 0');
    expect(out[9]).toBe('229, 229, 229');
  });

  it('invariant: every element is "n, n, n" form', () => {
    const out = resolveGrayscaleRange(0, 100);
    out.forEach((s) => {
      const parts = s.split(', ');
      expect(parts).toHaveLength(3);
      expect(parts[0]).toBe(parts[1]);
      expect(parts[1]).toBe(parts[2]);
    });
  });

  it('edge case: min equals max gives constant value repeated', () => {
    const out = resolveGrayscaleRange(50, 50);
    expect(out).toHaveLength(10);
    const unique = [...new Set(out)];
    expect(unique.length).toBe(1);
    expect(unique[0]).toBe('50, 50, 50');
  });

  it('edge case: narrow range spreads across 10 steps', () => {
    const out = resolveGrayscaleRange(10, 19);
    expect(out).toHaveLength(10);
    expect(out[0]).toBe('10, 10, 10');
    expect(out[9]).toBe('18, 18, 18');
  });

  it('deterministic: same inputs produce same output', () => {
    const a = resolveGrayscaleRange(0, 255);
    const b = resolveGrayscaleRange(0, 255);
    expect(a).toEqual(b);
  });
});
