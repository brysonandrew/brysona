import { describe, it, expect } from 'vitest';
import { sortByKeys } from './sortKeys';

describe('sortByKeys', () => {
  it('happy path: returns new object with keys sorted alphabetically', () => {
    expect(sortByKeys({ c: 1, a: 2, b: 3 })).toEqual({ a: 2, b: 3, c: 1 });
  });
  it('edge case: single key and empty object', () => {
    expect(sortByKeys({ z: 1 })).toEqual({ z: 1 });
    expect(sortByKeys({})).toEqual({});
  });
  it('failure mode: preserves all entries', () => {
    const input = { b: 1, a: 2 };
    const out = sortByKeys(input);
    expect(Object.keys(out)).toEqual(['a', 'b']);
    expect(out).toEqual({ a: 2, b: 1 });
  });
});
