import { describe, it, expect } from 'vitest';
import { colorToStylesRecord } from './colorToStyles';

describe('colorToStylesRecord', () => {
  it('happy path: returns text and bg style objects', () => {
    expect(colorToStylesRecord('#fff')).toEqual({
      text: { color: '#fff' },
      bg: { backgroundColor: '#fff' },
    });
  });
  it('edge case: any string used as color', () => {
    expect(colorToStylesRecord('red')).toEqual({
      text: { color: 'red' },
      bg: { backgroundColor: 'red' },
    });
  });
  it('failure mode: empty string still returns structure', () => {
    expect(colorToStylesRecord('')).toEqual({
      text: { color: '' },
      bg: { backgroundColor: '' },
    });
  });
});
