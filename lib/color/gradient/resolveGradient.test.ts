import { describe, it, expect } from 'vitest';
import { resolveGradient } from './resolveGradient';

describe('resolveGradient', () => {
  it('happy path: linear gradient with parts returns name(parts...)', () => {
    const out = resolveGradient({
      name: 'linear-gradient',
      parts: ['to right', 'red', 'blue'],
    });
    expect(out).toBe('linear-gradient(to right, red, blue)');
  });

  it('happy path: radial gradient with nested parts flattens', () => {
    const out = resolveGradient({
      name: 'radial-gradient',
      parts: [['circle', 'at center'], 'white', 'black'],
    });
    expect(out).toBe(
      'radial-gradient(circle, at center, white, black)',
    );
  });

  it('edge case: single part', () => {
    const out = resolveGradient({
      name: 'linear-gradient',
      parts: ['red'],
    });
    expect(out).toBe('linear-gradient(red)');
  });

  it('failure mode: non-array parts returns empty string', () => {
    expect(
      resolveGradient({
        name: 'linear-gradient',
        parts: null as unknown as string[],
      }),
    ).toBe('');
    expect(
      resolveGradient({
        name: 'linear-gradient',
        parts: undefined as unknown as string[],
      }),
    ).toBe('');
  });

  it('invariant: syntax is name(syntax) where syntax is flat parts joined by ", "', () => {
    const out = resolveGradient({
      name: 'conic-gradient',
      parts: ['from 0deg', 'yellow', 'red'],
    });
    expect(out).toMatch(/^conic-gradient\(.+\)$/);
    expect(out).toBe(
      'conic-gradient(from 0deg, yellow, red)',
    );
  });
});
