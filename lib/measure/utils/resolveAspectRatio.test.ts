/**
 * @vitest-environment jsdom
 * Uses jsdom: resolveAspectRatio reads element.clientWidth/clientHeight (and
 * naturalWidth/naturalHeight for images). Requires document and DOM elements.
 */
import { describe, it, expect } from 'vitest';
import { resolveAspectRatio } from './resolveAspectRatio';

const setDimensions = (
  el: HTMLDivElement | HTMLImageElement,
  width: number,
  height: number,
  natural = false,
) => {
  if (natural && 'naturalWidth' in el) {
    Object.defineProperty(el, 'naturalWidth', { value: width, configurable: true });
    Object.defineProperty(el, 'naturalHeight', { value: height, configurable: true });
  }
  Object.defineProperty(el, 'clientWidth', { value: width, configurable: true });
  Object.defineProperty(el, 'clientHeight', { value: height, configurable: true });
};

describe('resolveAspectRatio', () => {
  it('happy path: returns width/height ratio for div with dimensions', () => {
    const div = document.createElement('div');
    setDimensions(div, 16, 9);
    expect(resolveAspectRatio(div)).toBe(16 / 9);
  });

  it('happy path: image uses naturalWidth/naturalHeight when present', () => {
    const img = document.createElement('img');
    setDimensions(img, 100, 50, true);
    expect(resolveAspectRatio(img)).toBe(2);
  });

  it('edge case: square element returns 1', () => {
    const div = document.createElement('div');
    setDimensions(div, 100, 100);
    expect(resolveAspectRatio(div)).toBe(1);
  });

  it('failure mode: zero height yields Infinity', () => {
    const div = document.createElement('div');
    setDimensions(div, 100, 0);
    expect(resolveAspectRatio(div)).toBe(Number.POSITIVE_INFINITY);
  });
});
