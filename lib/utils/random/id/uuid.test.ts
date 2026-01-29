import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { keysUuid, keysUuid1 } from './uuid';

describe('random/id/uuid', () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  describe('keysUuid', () => {
    describe('branch: NODE_ENV === "test"', () => {
      beforeEach(() => {
        process.env.NODE_ENV = 'test';
      });

      it('returns fixed string for deterministic tests', () => {
        expect(keysUuid()).toBe('test-uuid');
        expect(keysUuid()).toBe('test-uuid');
      });
    });

    describe('branch: NODE_ENV !== "test"', () => {
      beforeEach(() => {
        process.env.NODE_ENV = 'development';
      });

      it('returns 6-char base36 string', () => {
        const id = keysUuid();
        expect(id).toMatch(/^[0-9a-z]{6}$/);
        expect(id.length).toBe(6);
      });

      it('returns different values on successive calls', () => {
        const a = keysUuid();
        const b = keysUuid();
        expect(a).not.toBe(b);
      });
    });

    describe('failure mode: NODE_ENV unset', () => {
      beforeEach(() => {
        delete process.env.NODE_ENV;
      });

      it('uses random path (not fixed)', () => {
        const id = keysUuid();
        expect(id).toMatch(/^[0-9a-z]{6}$/);
        expect(id).not.toBe('test-uuid');
      });
    });
  });

  describe('keysUuid1', () => {
    it('returns fixed base36 string (no env branch)', () => {
      expect(keysUuid1()).toBe((2100000000).toString(36));
      expect(keysUuid1()).toBe((2100000000).toString(36));
    });
  });
});
