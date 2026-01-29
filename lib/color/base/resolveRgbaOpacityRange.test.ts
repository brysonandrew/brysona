import { describe, it, expect } from 'vitest';
import { resolveRgbaOpacityRange } from './resolveRgbaOpacityRange';

const rgb = '50, 100, 150' as const;

describe('resolveRgbaOpacityRange', () => {
  it('happy path: returns record with base key and key-01 through key-09', () => {
    const out = resolveRgbaOpacityRange('primary', rgb);
    expect(out).toHaveProperty('primary');
    expect(out.primary).toBe('rgb(50, 100, 150)');
    expect(out).toHaveProperty('primary-01');
    expect(out['primary-01']).toBe('rgba(50, 100, 150, 0.1)');
    expect(out).toHaveProperty('primary-05');
    expect(out['primary-05']).toBe('rgba(50, 100, 150, 0.5)');
    expect(out).toHaveProperty('primary-09');
    expect(out['primary-09']).toBe('rgba(50, 100, 150, 0.9)');
  });

  it('invariant: exactly 10 keys for a single input key', () => {
    const out = resolveRgbaOpacityRange('x', rgb);
    const keys = Object.keys(out);
    expect(keys).toHaveLength(10);
    expect(keys).toContain('x');
    expect(keys.filter((k) => k.startsWith('x-0'))).toHaveLength(9);
  });

  it('edge case: key name is preserved exactly', () => {
    const out = resolveRgbaOpacityRange('dark', '0, 0, 0');
    expect(out.dark).toBe('rgb(0, 0, 0)');
    expect(out['dark-01']).toBe('rgba(0, 0, 0, 0.1)');
  });

  it('invariant: opacity values increase from 0.1 to 0.9 by 0.1', () => {
    const out = resolveRgbaOpacityRange('c', rgb);
    for (let i = 1; i <= 9; i++) {
      const key = i === 1 ? 'c-01' : `c-0${i}`;
      expect(out[key]).toBe(
        `rgba(50, 100, 150, 0.${i})`,
      );
    }
  });
});
