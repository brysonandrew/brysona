import { describe, it, expect } from 'vitest';
import { stripPx } from './stripPx';

describe('stripPx', () => {
  it('happy path: strips px from string and returns number', () => {
    expect(stripPx('16px')).toBe(16);
    expect(stripPx('0px')).toBe(0);
  });
  it('edge case: number input returned as-is', () => {
    expect(stripPx(16)).toBe(16);
    expect(stripPx(0)).toBe(0);
  });
  it('failure mode: non-numeric string produces NaN', () => {
    expect(stripPx('abc')).toBe(Number.NaN);
    expect(stripPx('foo')).toBe(Number.NaN);
  });
});
