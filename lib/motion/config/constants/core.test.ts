import { describe, it, expect } from 'vitest';
import {
  DURATION,
  MOTION_CONFIG,
  HOVER_VARIANT,
  PRESENCE_OPACITY,
  PRESENCE_OPACITY_05,
  PRESENCE_OPACITY_ANIMATE_DELAY_04,
  PRESENCE_OPACITY_DELAY,
  PRESENCE_OPACITY_DURATION_DELAY,
  ROTATE_DIRECTIONS,
  ROTATE_TYPES,
  SHIFT_DIRECTIONS,
  TRANSITION,
  TRANSITION_02_EASEIN_008,
  TRANSITION_02_EASE_IN_02,
  TRANSITION_02_EASE_IN_04,
  TRANSITION_04_EASEIN_008,
  ZOOM_DIRECTIONS,
  ZOOM_TYPES,
} from './core';

const noDuplicateEntries = <T>(arr: readonly T[]): boolean =>
  new Set(arr).size === arr.length;

/** Contract: duration/delay in core.ts are non-negative and bounded (e.g. ≤ 10s). */
const MAX_DURATION = 10;

/** Contract: opacity in presence configs is 0–1. */
const OPACITY_MIN = 0;
const OPACITY_MAX = 1;

const PRESENCE_KEYS = ['initial', 'animate', 'exit'] as const;

describe('motion config constants invariants', () => {
  describe('DURATION', () => {
    it('is non-negative and within expected range', () => {
      expect(DURATION).toBeGreaterThanOrEqual(0);
      expect(DURATION).toBeLessThanOrEqual(MAX_DURATION);
    });
  });

  describe('MOTION_CONFIG', () => {
    it('has required transition shape', () => {
      expect(MOTION_CONFIG).toHaveProperty('transition');
      expect(MOTION_CONFIG.transition).toHaveProperty('ease');
      expect(MOTION_CONFIG.transition).toHaveProperty('duration');
      expect(MOTION_CONFIG.transition).toHaveProperty('delay');
    });
    it('transition duration and delay are non-negative', () => {
      expect(MOTION_CONFIG.transition.duration).toBeGreaterThanOrEqual(0);
      expect(MOTION_CONFIG.transition.delay).toBeGreaterThanOrEqual(0);
    });
  });

  describe('HOVER_VARIANT', () => {
    it('is non-empty and has no duplicates', () => {
      expect(HOVER_VARIANT.length).toBeGreaterThan(0);
      expect(noDuplicateEntries(HOVER_VARIANT)).toBe(true);
    });
    it('contains idle and hover', () => {
      expect(HOVER_VARIANT).toContain('idle');
      expect(HOVER_VARIANT).toContain('hover');
    });
  });

  describe('PRESENCE_* objects', () => {
    const presenceConfigs = [
      PRESENCE_OPACITY,
      PRESENCE_OPACITY_05,
      PRESENCE_OPACITY_ANIMATE_DELAY_04,
      PRESENCE_OPACITY_DELAY,
      PRESENCE_OPACITY_DURATION_DELAY,
    ];
    it('each has initial, animate, exit keys', () => {
      for (const config of presenceConfigs) {
        for (const key of PRESENCE_KEYS) {
          expect(config).toHaveProperty(key);
        }
      }
    });
    it('opacity values are in 0–1', () => {
      const checkOpacity = (obj: { opacity?: number }) => {
        if (typeof obj?.opacity === 'number') {
          expect(obj.opacity).toBeGreaterThanOrEqual(OPACITY_MIN);
          expect(obj.opacity).toBeLessThanOrEqual(OPACITY_MAX);
        }
      };
      for (const config of presenceConfigs) {
        checkOpacity(config.initial as { opacity?: number });
        checkOpacity(config.animate as { opacity?: number });
        checkOpacity(config.exit as { opacity?: number });
      }
    });
  });

  describe('TRANSITION objects', () => {
    const transitionObjects = [
      TRANSITION,
      TRANSITION_02_EASEIN_008,
      TRANSITION_02_EASE_IN_02,
      TRANSITION_02_EASE_IN_04,
      TRANSITION_04_EASEIN_008,
    ];
    it('each has duration, ease, delay (or type) where applicable', () => {
      for (const t of transitionObjects) {
        expect(t).toHaveProperty('duration');
        expect(t).toHaveProperty('ease');
        expect(t).toHaveProperty('delay');
      }
    });
    it('duration and delay are non-negative', () => {
      for (const t of transitionObjects) {
        expect(t.duration).toBeGreaterThanOrEqual(0);
        expect(t.delay).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe('ROTATE_DIRECTIONS', () => {
    it('is non-empty and has no duplicates', () => {
      expect(ROTATE_DIRECTIONS.length).toBeGreaterThan(0);
      expect(noDuplicateEntries(ROTATE_DIRECTIONS)).toBe(true);
    });
  });

  describe('ROTATE_TYPES', () => {
    it('is non-empty and has no duplicates', () => {
      expect(ROTATE_TYPES.length).toBeGreaterThan(0);
      expect(noDuplicateEntries(ROTATE_TYPES)).toBe(true);
    });
    it('contains roll, pitch, yaw', () => {
      expect(ROTATE_TYPES).toContain('roll');
      expect(ROTATE_TYPES).toContain('pitch');
      expect(ROTATE_TYPES).toContain('yaw');
    });
  });

  describe('SHIFT_DIRECTIONS', () => {
    it('is non-empty and has no duplicates', () => {
      expect(SHIFT_DIRECTIONS.length).toBeGreaterThan(0);
      expect(noDuplicateEntries(SHIFT_DIRECTIONS)).toBe(true);
    });
    it('contains left, right, up, down', () => {
      expect(SHIFT_DIRECTIONS).toContain('left');
      expect(SHIFT_DIRECTIONS).toContain('right');
      expect(SHIFT_DIRECTIONS).toContain('up');
      expect(SHIFT_DIRECTIONS).toContain('down');
    });
  });

  describe('ZOOM_DIRECTIONS', () => {
    it('is non-empty and has no duplicates', () => {
      expect(ZOOM_DIRECTIONS.length).toBeGreaterThan(0);
      expect(noDuplicateEntries(ZOOM_DIRECTIONS)).toBe(true);
    });
    it('contains height, width, depth', () => {
      expect(ZOOM_DIRECTIONS).toContain('height');
      expect(ZOOM_DIRECTIONS).toContain('width');
      expect(ZOOM_DIRECTIONS).toContain('depth');
    });
  });

  describe('ZOOM_TYPES', () => {
    it('is non-empty and has no duplicates', () => {
      expect(ZOOM_TYPES.length).toBeGreaterThan(0);
      expect(noDuplicateEntries(ZOOM_TYPES)).toBe(true);
    });
    it('contains expand and shrink', () => {
      expect(ZOOM_TYPES).toContain('expand');
      expect(ZOOM_TYPES).toContain('shrink');
    });
  });
});
