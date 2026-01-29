import { describe, it, expect } from 'vitest';
import { resolveRemFromPx } from './resolveRemFromPx';

describe('resolveRemFromPx', () => {
  it('happy path: converts px to rem with default base 16', () => {
    expect(resolveRemFromPx(16)).toBe('1rem');
    expect(resolveRemFromPx(32)).toBe('2rem');
  });
  it('edge case: custom base and fractional result', () => {
    expect(resolveRemFromPx(10, 16)).toBe('0.625rem');
    expect(resolveRemFromPx(8, 8)).toBe('1rem');
  });
  it('failure mode: zero base produces Infinity string', () => {
    expect(resolveRemFromPx(16, 0)).toBe('Infinityrem');
  });
});
