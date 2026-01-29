import { describe, it, expect } from 'vitest';
import { resolveRgbaValue } from './resolveRgbaValue';

const rgb = '100, 150, 200' as const;

describe('resolveRgbaValue', () => {
  it('happy path: with undefined opacity returns rgb(...)', () => {
    expect(resolveRgbaValue(rgb)).toBe('rgb(100, 150, 200)');
    expect(resolveRgbaValue('0, 0, 0')).toBe('rgb(0, 0, 0)');
    expect(resolveRgbaValue('255, 255, 255')).toBe(
      'rgb(255, 255, 255)',
    );
  });

  it('happy path: with opacity digit returns rgba(...) with 0.digit', () => {
    expect(resolveRgbaValue(rgb, 1)).toBe(
      'rgba(100, 150, 200, 0.1)',
    );
    expect(resolveRgbaValue(rgb, 5)).toBe(
      'rgba(100, 150, 200, 0.5)',
    );
    expect(resolveRgbaValue(rgb, 9)).toBe(
      'rgba(100, 150, 200, 0.9)',
    );
  });

  it('edge case: opacity boundaries 1 and 9', () => {
    expect(resolveRgbaValue('0, 0, 0', 1)).toBe(
      'rgba(0, 0, 0, 0.1)',
    );
    expect(resolveRgbaValue('255, 255, 255', 9)).toBe(
      'rgba(255, 255, 255, 0.9)',
    );
  });

  it('round-trip: rgb -> resolveRgbaValue(rgb) is parseable rgb(...) form', () => {
    const value = resolveRgbaValue(rgb);
    expect(value).toMatch(/^rgb\(\d+, \d+, \d+\)$/);
    expect(value).toBe('rgb(100, 150, 200)');
  });

  it('round-trip: rgb + opacity -> rgba string contains same rgb and 0.opacity', () => {
    const value = resolveRgbaValue(rgb, 5);
    expect(value).toMatch(/^rgba\(100, 150, 200, 0\.5\)$/);
  });
});
