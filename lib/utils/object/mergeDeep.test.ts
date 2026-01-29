import { describe, it, expect } from 'vitest';
import { mergeDeepObjects } from './mergeDeep';

describe('mergeDeepObjects', () => {
  it('happy path: merges nested objects deeply', () => {
    const target = { a: 1, b: { x: 1 } };
    const source = { b: { y: 2 }, c: 3 };
    expect(mergeDeepObjects(target, source)).toEqual({
      a: 1,
      b: { x: 1, y: 2 },
      c: 3,
    });
  });
  it('edge case: no sources returns target unchanged', () => {
    const target = { a: 1 };
    expect(mergeDeepObjects(target)).toBe(target);
    expect(mergeDeepObjects(target)).toEqual({ a: 1 });
  });
  it('failure mode: arrays are overwritten not merged', () => {
    const target = { arr: [1, 2] };
    const source = { arr: [3] };
    expect(mergeDeepObjects(target, source)).toEqual({ arr: [3] });
  });
});
