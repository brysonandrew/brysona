import { describe, it, expect } from 'vitest';
import { prefixKeys } from './prefixKeys';

describe('prefixKeys', () => {
  it('happy path: prefixes all keys', () => {
    expect(
      prefixKeys({ prefix: 'x-', record: { a: '1', b: '2' } }),
    ).toEqual({ 'x-a': '1', 'x-b': '2' });
  });
  it('edge case: array values joined with space', () => {
    expect(
      prefixKeys({ prefix: 'p-', record: { k: ['a', 'b'] } }),
    ).toEqual({ 'p-k': 'a b' });
  });
  it('failure mode: prefixValuesRx replaces matched substrings with prefix+match', () => {
    const out = prefixKeys({
      prefix: 'var-',
      record: { color: 'red' },
      prefixValuesRx: /red/g,
    });
    expect(out['var-color']).toBe('var-red');
  });
});
