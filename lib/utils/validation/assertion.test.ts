import { describe, it, expect } from 'vitest';
import { assertion } from './assertion';

describe('assertion', () => {
  it('happy path: does not throw when expr is truthy', () => {
    expect(() => assertion(true)).not.toThrow();
    expect(() => assertion(1)).not.toThrow();
    expect(() => assertion('ok')).not.toThrow();
  });
  it('edge case: custom message used when throwing', () => {
    expect(() => assertion(false, 'custom')).toThrow('custom');
  });
  it('failure mode: throws Error when expr is falsy', () => {
    expect(() => assertion(false)).toThrow(Error);
    expect(() => assertion(0)).toThrow();
    expect(() => assertion('')).toThrow();
    expect(() => assertion(null)).toThrow();
    expect(() => assertion(undefined)).toThrow();
  });
});
