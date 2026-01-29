import { describe, it, expect } from 'vitest';
import { resolveRouteRecords } from './index';

describe('resolveRouteRecords', () => {
  it('builds record, routes, and menuItems from page titles and directory', () => {
    const PageDirectory = {
      Index: null,
      About: null,
    } as const;
    const result = resolveRouteRecords(
      ['Index', 'About'] as const,
      PageDirectory,
      '/',
    );
    expect(result.record.index.path).toBe('/');
    expect(result.record.index.title).toBe('Index');
    expect(result.record.about.path).toBe('/about');
    expect(result.record.about.title).toBe('About');
    expect(result.routes).toHaveLength(2);
    expect(result.routes[0]).toMatchObject({ index: true, path: '/' });
    expect(result.routes[1]).toMatchObject({ index: false, path: '/about' });
    expect(result.menuItems).toEqual([
      { to: '/', title: 'Index' },
      { to: '/about', title: 'About' },
    ]);
  });
});
