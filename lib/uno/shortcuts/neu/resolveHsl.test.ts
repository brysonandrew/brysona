import { describe, it, expect } from 'vitest';
import { resolveHsl } from './resolveHsl';

describe('resolveHsl', () => {
  it('happy path: maps hue, saturation, lightness to hsl() string', () => {
    const out = resolveHsl({ hue: 180, saturation: 50, lightness: 60 });
    expect(out).toBe('hsl(180, 50%, 60%)');
  });

  it('happy path: typical mid-gray', () => {
    const out = resolveHsl({ hue: 0, saturation: 0, lightness: 50 });
    expect(out).toBe('hsl(0, 0%, 50%)');
  });

  it('edge case: zero values', () => {
    const out = resolveHsl({ hue: 0, saturation: 0, lightness: 0 });
    expect(out).toBe('hsl(0, 0%, 0%)');
  });

  it('edge case: boundary 100 lightness', () => {
    const out = resolveHsl({ hue: 200, saturation: 100, lightness: 100 });
    expect(out).toBe('hsl(200, 100%, 100%)');
  });

  it('edge case: fractional values are stringified as numbers', () => {
    const out = resolveHsl({ hue: 30.5, saturation: 20, lightness: 40 });
    expect(out).toBe('hsl(30.5, 20%, 40%)');
  });
});
