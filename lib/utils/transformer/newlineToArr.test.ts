import { describe, it, expect } from 'vitest';
import { newlineToArr } from './newlineToArr';

describe('newlineToArr', () => {
  it('happy path: splits on newlines and trims empty lines', () => {
    expect(newlineToArr('a\nb\nc')).toEqual(['a', 'b', 'c']);
  });
  it('edge case: single line and blank-only lines filtered', () => {
    expect(newlineToArr('only')).toEqual(['only']);
    expect(newlineToArr('a\n\nb\n  \nc')).toEqual(['a', 'b', 'c']);
  });
  it('failure mode: empty string returns empty array', () => {
    expect(newlineToArr('')).toEqual([]);
  });
});
