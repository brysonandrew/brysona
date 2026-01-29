import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { resolveErrorMessage } from './resolveErrorMessage';

describe('resolveErrorMessage', () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    vi.restoreAllMocks();
  });

  describe('branch: NODE_ENV !== "test"', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'development';
    });

    it('calls console.log and returns string error message', () => {
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const out = resolveErrorMessage('fail', 'src');
      expect(out).toBe('fail src');
      expect(logSpy).toHaveBeenCalledWith('fail');
      logSpy.mockRestore();
    });

    it('calls console.error for object error with message', () => {
      const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      resolveErrorMessage(new Error('oops'), 'api');
      expect(errSpy).toHaveBeenCalled();
      errSpy.mockRestore();
    });
  });

  describe('branch: NODE_ENV === "test"', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'test';
    });

    it('does not call console.log', () => {
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      resolveErrorMessage('silent', 'src');
      expect(logSpy).not.toHaveBeenCalled();
      logSpy.mockRestore();
    });

    it('does not call console.error', () => {
      const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      resolveErrorMessage(new Error('silent'), 'api');
      expect(errSpy).not.toHaveBeenCalled();
      errSpy.mockRestore();
    });

    it('still returns resolved message for string error', () => {
      expect(resolveErrorMessage('msg', 'src')).toBe('msg src');
    });

    it('still returns resolved message for Error object', () => {
      expect(resolveErrorMessage(new Error('err'), '')).toBe('err');
    });
  });

  describe('failure mode: invalid or missing message', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'test';
    });

    it('returns stringified content for object without message property', () => {
      const obj = { code: 500 };
      expect(resolveErrorMessage(obj as unknown as Error, '')).toBe(
        '[object Object]'
      );
    });

    it('returns outer-trimmed message with source (inner spaces preserved)', () => {
      expect(resolveErrorMessage('  x  ', '  y  ')).toBe('x     y');
    });
  });

  describe('regression: defensive extraction (null and non-string message)', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'test';
    });

    it('null error returns string "null" not undefined', () => {
      expect(resolveErrorMessage(null as unknown as Error, '')).toBe('null');
    });

    it('object with non-string message uses String(error) not message property', () => {
      const obj = { message: 123 };
      expect(resolveErrorMessage(obj as unknown as Error, '')).toBe(
        '[object Object]'
      );
    });
  });
});
