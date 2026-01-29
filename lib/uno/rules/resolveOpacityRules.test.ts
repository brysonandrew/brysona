import { describe, it, expect } from 'vitest';
import { resolveOpacityRules } from './resolveOpacityRules';

describe('resolveOpacityRules', () => {
  it('happy path: returns array of rules with fade-in and fade-out', () => {
    const rules = resolveOpacityRules<Record<string, unknown>>();
    expect(Array.isArray(rules)).toBe(true);
    const fadeIn = rules.find((r) => r[0] === 'fade-in');
    const fadeOut = rules.find((r) => r[0] === 'fade-out');
    expect(fadeIn).toBeDefined();
    expect(fadeOut).toBeDefined();
  });

  it('happy path: fade-in produces expected animation output', () => {
    const rules = resolveOpacityRules<Record<string, unknown>>();
    const fadeIn = rules.find((r) => r[0] === 'fade-in');
    expect(fadeIn![1]).toEqual({
      'animation-name': 'fade-in',
      'animation-delay': '0ms',
      'animation-duration': '1000ms',
    });
  });

  it('happy path: fade-out produces expected animation output', () => {
    const rules = resolveOpacityRules<Record<string, unknown>>();
    const fadeOut = rules.find((r) => r[0] === 'fade-out');
    expect(fadeOut![1]).toEqual({
      'animation-name': 'fade-out',
      'animation-delay': '0ms',
      'animation-duration': '1000ms',
    });
  });

  it('edge case: all entries are [string, object] tuples', () => {
    const rules = resolveOpacityRules<Record<string, unknown>>();
    rules.forEach((r) => {
      expect(r).toHaveLength(2);
      expect(typeof r[0]).toBe('string');
      expect(r[1]).toBeTypeOf('object');
      expect(r[1]).not.toBeNull();
    });
  });

  it('no match: non-existent matcher is not in rules', () => {
    const rules = resolveOpacityRules<Record<string, unknown>>();
    const matchers = rules.map((r) => r[0]);
    expect(matchers).not.toContain('fade-in-out');
    expect(matchers).not.toContain('opacity-fade');
  });
});
