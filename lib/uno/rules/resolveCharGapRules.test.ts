import { describe, it, expect } from 'vitest';
import { resolveCharGapRules } from './resolveCharGapRules';

describe('resolveCharGapRules', () => {
  it('happy path: returns array of rules with char-gap matchers and letter-spacing bodies', () => {
    const rules = resolveCharGapRules<Record<string, unknown>>();
    expect(Array.isArray(rules)).toBe(true);
    const charGap1 = rules.find((r) => r[0] === 'char-gap-1');
    expect(charGap1).toBeDefined();
    expect(charGap1![1]).toEqual({ 'letter-spacing': '0.005em' });
  });

  it('happy path: critical char-gap scale 1–10 produces expected outputs', () => {
    const rules = resolveCharGapRules<Record<string, unknown>>();
    const byName = Object.fromEntries(rules.map((r) => [r[0], r[1]]));
    expect(byName['char-gap-1']).toEqual({ 'letter-spacing': '0.005em' });
    expect(byName['char-gap-5']).toEqual({ 'letter-spacing': '0.08em' });
    expect(byName['char-gap-10']).toEqual({ 'letter-spacing': '1em' });
  });

  it('happy path: char-gap-transition rule exists with transition properties', () => {
    const rules = resolveCharGapRules<Record<string, unknown>>();
    const transition = rules.find((r) => r[0] === 'char-gap-transition');
    expect(transition).toBeDefined();
    expect(transition![1]).toEqual({
      'transition-property': 'letter-spacing',
      'transition-duration': '200ms',
      'transition-timing-function': 'ease-in',
    });
  });

  it('edge case: all entries are [string, object] tuples', () => {
    const rules = resolveCharGapRules<Record<string, unknown>>();
    rules.forEach((r) => {
      expect(r).toHaveLength(2);
      expect(typeof r[0]).toBe('string');
      expect(r[1]).toBeTypeOf('object');
      expect(r[1]).not.toBeNull();
    });
  });

  it('no match: non-existent matcher is not in rules', () => {
    const rules = resolveCharGapRules<Record<string, unknown>>();
    const matchers = rules.map((r) => r[0]);
    expect(matchers).not.toContain('char-gap-99');
    expect(matchers).not.toContain('not-a-rule');
  });
});
