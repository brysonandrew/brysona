import { describe, it, expect } from 'vitest';
import { resolveIntRecord } from './resolveIntRecord';

describe('resolveIntRecord', () => {
  it('happy path: converts px record to int record', () => {
    expect(resolveIntRecord({ a: '10px', b: '20px' })).toEqual({ a: 10, b: 20 });
  });
  it('edge case: single key and zero', () => {
    expect(resolveIntRecord({ x: '0px' })).toEqual({ x: 0 });
  });
  it('failure mode: non-numeric px string becomes NaN in result', () => {
    const out = resolveIntRecord({ bad: 'abc' as `${string}px` });
    expect(out.bad).toBe(Number.NaN);
  });
});
