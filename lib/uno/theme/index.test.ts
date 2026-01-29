import { describe, it, expect } from 'vitest';
import {
  resolveTheme,
  THEME_BREAKPOINTS,
  THEME_FONT_SIZE,
  THEME_WIDTH,
} from './index';

describe('resolveTheme', () => {
  it('happy path: returns breakpoints, width, fontSize and spreads partial', () => {
    const out = resolveTheme({});
    expect(out.breakpoints).toBe(THEME_BREAKPOINTS);
    expect(out.width).toBe(THEME_WIDTH);
    expect(out.fontSize).toBe(THEME_FONT_SIZE);
  });

  it('happy path: partial overrides default keys', () => {
    const customBreakpoints = { sm: '400px', md: '600px' } as const;
    const out = resolveTheme({ breakpoints: customBreakpoints });
    expect(out.breakpoints).toEqual(customBreakpoints);
    expect(out.width).toBe(THEME_WIDTH);
    expect(out.fontSize).toBe(THEME_FONT_SIZE);
  });

  it('edge case: empty partial leaves defaults unchanged', () => {
    const out = resolveTheme({});
    expect(out.breakpoints).toEqual(THEME_BREAKPOINTS);
    expect(out.fontSize.base).toEqual(['1rem', '1.75rem']);
    expect(out.width.sm).toBe('480px');
  });

  it('edge case: partial can add extra keys', () => {
    const out = resolveTheme({ colors: { primary: 'blue' } });
    expect(out.breakpoints).toBe(THEME_BREAKPOINTS);
    expect((out as { colors?: { primary: string } }).colors?.primary).toBe(
      'blue',
    );
  });

  it('deterministic: same partial produces same output', () => {
    const partial = { width: { sm: '500px' } };
    const a = resolveTheme(partial);
    const b = resolveTheme(partial);
    expect(a).toEqual(b);
  });
});
