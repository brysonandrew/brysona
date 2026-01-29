import { describe, it, expect } from 'vitest';
import { formatUrl } from './url';

describe('formatUrl', () => {
  it('happy path: normalizes URL to www. prefix without protocol/slashes', () => {
    expect(formatUrl('https://example.com')).toBe('www.example.com');
    expect(formatUrl('https://example.com/')).toBe('www.example.com');
    expect(formatUrl('www.example.com')).toBe('www.example.com');
  });

  it('edge case: strips multiple protocol/slash occurrences', () => {
    expect(formatUrl('https://www.example.com/path')).toBe('www.example.compath');
    expect(formatUrl('https://www.example.com/')).toBe('www.example.com');
  });

  it('failure mode: empty or protocol-only still returns string', () => {
    expect(formatUrl('')).toBe('www.');
    expect(formatUrl('https://')).toBe('www.');
  });
});
