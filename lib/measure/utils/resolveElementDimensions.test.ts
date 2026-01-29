import { describe, it, expect } from 'vitest';
import { resolveElementDimensions } from './resolveElementDimensions';

describe('resolveElementDimensions', () => {
  it('happy path: returns width and height from plain dimensions object', () => {
    const result = resolveElementDimensions({ width: 100, height: 50 });
    expect(result).toEqual({ width: 100, height: 50 });
  });

  it('edge case: null returns null', () => {
    expect(resolveElementDimensions(null)).toBe(null);
  });

  it('edge case: dimensions with zero width or height return null', () => {
    expect(resolveElementDimensions({ width: 0, height: 50 })).toBe(null);
    expect(resolveElementDimensions({ width: 100, height: 0 })).toBe(null);
    expect(resolveElementDimensions({ width: 0, height: 0 })).toBe(null);
  });

  it('failure mode: object with only one dimension (undefined other) yields 0 and returns null', () => {
    const partial = { width: 100 } as { width: number; height?: number };
    expect(resolveElementDimensions(partial)).toBe(null);
  });
});
