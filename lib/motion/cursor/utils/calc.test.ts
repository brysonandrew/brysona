import { describe, it, expect } from 'vitest';
import { resolveCalc, INIT_CALC } from './calc';

describe('resolveCalc', () => {
  it('regression: positive sign yields plus in calc string (cursor offset fix)', () => {
    expect(resolveCalc(50, 1, 10)).toBe('calc(50% + 10px)');
  });

  it('regression: negative sign yields minus in calc string', () => {
    expect(resolveCalc(50, -1, 10)).toBe('calc(50% - 10px)');
  });

  it('regression: zero percent and zero px with positive sign', () => {
    expect(resolveCalc(0, 1, 0)).toBe('calc(0% + 0px)');
  });
});

describe('INIT_CALC', () => {
  it('regression: equals resolveCalc(0, 1, 0) for initial cursor position', () => {
    expect(INIT_CALC).toBe('calc(0% + 0px)');
  });
});
