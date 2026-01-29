import { describe, it, expect } from 'vitest';
import { arrToRecord } from './arrToRecord';

describe('arrToRecord', () => {
  it('happy path: builds record keyed by string property', () => {
    const items = [
      { id: 'a', name: 'Alice' },
      { id: 'b', name: 'Bob' },
    ];
    expect(arrToRecord(items, 'id')).toEqual({
      a: { id: 'a', name: 'Alice' },
      b: { id: 'b', name: 'Bob' },
    });
  });
  it('edge case: single item and empty array', () => {
    expect(arrToRecord([{ k: 'x' }], 'k')).toEqual({ x: { k: 'x' } });
    expect(arrToRecord([], 'id')).toEqual({});
  });
  it('failure mode: non-string key values are skipped', () => {
    const items = [
      { id: 'a', name: 'Alice' },
      { id: 1 as unknown as string, name: 'Bad' },
    ];
    const out = arrToRecord(items, 'id');
    expect(out).toHaveProperty('a');
    expect(Object.keys(out)).not.toContain('1');
  });
});
