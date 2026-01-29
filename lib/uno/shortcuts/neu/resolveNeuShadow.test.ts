import { describe, it, expect } from 'vitest';
import { resolveNeuShadow } from './resolveNeuShadow';

describe('resolveNeuShadow', () => {
  it('happy path: maps size, color, blur to fill/back/emptyFill/emptyBack strings', () => {
    const out = resolveNeuShadow({
      size: 4,
      blur: 2,
      color: { fill: 'red', back: 'blue' },
    });
    expect(out.fill).toBe('4px 4px 8px red');
    expect(out.back).toBe('-4px -4px 8px blue');
    expect(out.emptyFill).toBe('4px 4px 0px red');
    expect(out.emptyBack).toBe('-4px -4px 0px blue');
  });

  it('happy path: size * blur used for blur component', () => {
    const out = resolveNeuShadow({
      size: 2,
      blur: 3,
      color: { fill: 'hsl(0,0%,50%)', back: 'hsl(0,0%,60%)' },
    });
    expect(out.fill).toBe('2px 2px 6px hsl(0,0%,50%)');
    expect(out.back).toBe('-2px -2px 6px hsl(0,0%,60%)');
  });

  it('edge case: zero size and blur', () => {
    const out = resolveNeuShadow({
      size: 0,
      blur: 0,
      color: { fill: 'transparent', back: 'transparent' },
    });
    expect(out.fill).toBe('0px 0px 0px transparent');
    expect(out.back).toBe('0px 0px 0px transparent');
    expect(out.emptyFill).toBe('0px 0px 0px transparent');
    expect(out.emptyBack).toBe('0px 0px 0px transparent');
  });

  it('edge case: fractional size and blur', () => {
    const out = resolveNeuShadow({
      size: 1.5,
      blur: 0.5,
      color: { fill: '#fff', back: '#000' },
    });
    expect(out.fill).toBe('1.5px 1.5px 0.75px #fff');
    expect(out.back).toBe('-1.5px -1.5px 0.75px #000');
  });
});
