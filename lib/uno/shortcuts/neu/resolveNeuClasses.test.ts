import { describe, it, expect } from 'vitest';
import { resolveNeuRules } from './resolveNeuClasses';

describe('resolveNeuRules', () => {
  it('happy path: returns all neu class keys with deterministic style objects', () => {
    const out = resolveNeuRules({
      size: 2,
      blur: 2,
      hue: 200,
      saturation: 50,
      lightness: 50,
    });
    expect(Object.keys(out).sort()).toEqual([
      'neu-basic',
      'neu-empty',
      'neu-empty-flat-risen',
      'neu-empty-flat-sunken',
      'neu-flat-risen',
      'neu-flat-sunken',
      'neu-text',
    ]);
    expect(out['neu-basic']).toHaveProperty('color');
    expect(out['neu-basic']).toHaveProperty('background-color');
    expect(out['neu-empty']['background-color']).toBe('rgba(0,0,0,0)');
    expect(out['neu-flat-risen']).toHaveProperty('box-shadow');
    expect(out['neu-flat-sunken']['box-shadow']).toMatch(/^inset /);
  });

  it('happy path: base and shadows use resolveHsl for given hue/saturation/lightness', () => {
    const out = resolveNeuRules({
      size: 1,
      blur: 1,
      hue: 0,
      saturation: 0,
      lightness: 60,
    });
    expect(out['neu-basic']['background-color']).toBe('hsl(0, 0%, 60%)');
    expect(out['neu-basic'].color).toBe('hsl(0, 0%, 40%)');
  });

  it('edge case: lightness at 0 clamps fill contrast to 0', () => {
    const out = resolveNeuRules({
      size: 10,
      blur: 2,
      hue: 180,
      saturation: 50,
      lightness: 0,
    });
    expect(out['neu-basic']).toHaveProperty('background-color');
    expect(out['neu-basic'].color).toBe('hsl(180, 50%, 100%)');
  });

  it('edge case: lightness at 100 clamps back contrast to 100', () => {
    const out = resolveNeuRules({
      size: 10,
      blur: 2,
      hue: 0,
      saturation: 0,
      lightness: 100,
    });
    expect(out['neu-basic']['background-color']).toBe('hsl(0, 0%, 100%)');
    expect(out['neu-basic'].color).toBe('hsl(0, 0%, 0%)');
  });

  it('edge case: size and blur zero yields deterministic shadow strings', () => {
    const out = resolveNeuRules({
      size: 0,
      blur: 0,
      hue: 100,
      saturation: 20,
      lightness: 50,
    });
    expect(out['neu-flat-risen']['box-shadow']).toContain('0px');
    expect(out['neu-flat-sunken']['box-shadow']).toMatch(/^inset /);
  });

  it('deterministic: same config produces same output', () => {
    const config = {
      size: 3,
      blur: 1.5,
      hue: 270,
      saturation: 80,
      lightness: 55,
    };
    const a = resolveNeuRules(config);
    const b = resolveNeuRules(config);
    expect(a).toEqual(b);
  });
});
