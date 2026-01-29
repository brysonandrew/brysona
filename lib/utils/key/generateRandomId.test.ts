import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateId } from './generateRandomId';

describe('generateId', () => {
  const originalWindow = globalThis.window;

  afterEach(() => {
    vi.restoreAllMocks();
    Object.defineProperty(globalThis, 'window', {
      value: originalWindow,
      writable: true,
      configurable: true,
    });
  });

  describe('happy path: window.crypto.getRandomValues available', () => {
    beforeEach(() => {
      const mockGetRandomValues = vi.fn((arr: Uint8Array) => {
        for (let i = 0; i < arr.length; i++) arr[i] = 0xab;
      });
      Object.defineProperty(globalThis, 'window', {
        value: {
          crypto: { getRandomValues: mockGetRandomValues },
        },
        writable: true,
        configurable: true,
      });
    });

    it('returns hex string of requested length', () => {
      const id = generateId(20);
      expect(id).toMatch(/^[0-9a-f]{20}$/);
      expect(id.length).toBe(20);
    });

    it('uses custom length when provided', () => {
      const id = generateId(8);
      expect(id.length).toBe(8);
    });
  });

  describe('branch: no window', () => {
    beforeEach(() => {
      Object.defineProperty(globalThis, 'window', {
        value: undefined,
        writable: true,
        configurable: true,
      });
    });

    it('throws with clear message', () => {
      expect(() => generateId()).toThrow(
        'generateId requires window.crypto.getRandomValues'
      );
    });
  });

  describe('branch: window without crypto', () => {
    beforeEach(() => {
      Object.defineProperty(globalThis, 'window', {
        value: {},
        writable: true,
        configurable: true,
      });
    });

    it('throws when crypto is missing', () => {
      expect(() => generateId()).toThrow(
        'generateId requires window.crypto.getRandomValues'
      );
    });
  });

  describe('failure mode: getRandomValues throws', () => {
    beforeEach(() => {
      const mockGetRandomValues = vi.fn(() => {
        throw new Error('crypto unavailable');
      });
      Object.defineProperty(globalThis, 'window', {
        value: {
          crypto: { getRandomValues: mockGetRandomValues },
        },
        writable: true,
        configurable: true,
      });
    });

    it('propagates error', () => {
      expect(() => generateId()).toThrow('crypto unavailable');
    });
  });
});
