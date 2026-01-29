import { describe, it, expect } from 'vitest';
import { resolveRules } from './index';

describe('resolveRules', () => {
  it('happy path: aggregated rules include critical char-gap and opacity rules', () => {
    const rules = resolveRules<Record<string, unknown>>();
    const byMatcher = Object.fromEntries(rules.map((r) => [r[0], r[1]]));
    expect(byMatcher['char-gap-1']).toEqual({ 'letter-spacing': '0.005em' });
    expect(byMatcher['char-gap-transition']).toBeDefined();
    expect(byMatcher['fade-in']).toEqual({
      'animation-name': 'fade-in',
      'animation-delay': '0ms',
      'animation-duration': '1000ms',
    });
    expect(byMatcher['fade-out']).toBeDefined();
  });

  it('edge case: no duplicate matchers', () => {
    const rules = resolveRules<Record<string, unknown>>();
    const matchers = rules.map((r) => r[0]);
    const unique = [...new Set(matchers)];
    expect(matchers.length).toBe(unique.length);
  });
});
