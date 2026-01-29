import { describe, it, expect } from 'vitest';
import { resolveGradientStops } from './resolveGradientStops';

describe('resolveGradientStops', () => {
  it('happy path: colors and default count produce stops 0% to 100%', () => {
    const out = resolveGradientStops({
      colors: ['red', 'blue'],
    });
    expect(out).toBe('red 0%, blue 100%');
  });

  it('happy path: three colors with count 3', () => {
    const out = resolveGradientStops({
      colors: ['a', 'b', 'c'],
      count: 3,
    });
    expect(out).toBe('a 0%, b 50%, c 100%');
  });

  it('edge case: single color repeated when count > colors.length', () => {
    const out = resolveGradientStops({
      colors: ['red'],
      count: 5,
    });
    expect(out).toBe(
      'red 0%, red 25%, red 50%, red 75%, red 100%',
    );
  });

  it('edge case: count 2 gives 0% and 100%', () => {
    const out = resolveGradientStops({
      colors: ['x', 'y'],
      count: 2,
    });
    expect(out).toBe('x 0%, y 100%');
  });

  it('failure mode: count 1 produces NaN% (division by zero)', () => {
    const out = resolveGradientStops({
      colors: ['red'],
      count: 1,
    });
    expect(out).toContain('NaN');
  });

  it('invariant: percentages are deterministic and evenly spaced for count > 1', () => {
    const out = resolveGradientStops({
      colors: ['a', 'b'],
      count: 5,
    });
    expect(out).toBe(
      'a 0%, b 25%, a 50%, b 75%, a 100%',
    );
  });

  it('round-trip: output format is "color pct%" repeated', () => {
    const out = resolveGradientStops({
      colors: ['#fff', '#000'],
      count: 3,
    });
    const segments = out.split(', ');
    expect(segments).toHaveLength(3);
    segments.forEach((seg) => {
      expect(seg).toMatch(/^.+\s\d+%$/);
    });
  });
});
