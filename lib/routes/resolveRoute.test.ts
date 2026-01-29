import { describe, it, expect } from 'vitest';
import { resolveRoute } from './resolveRoute';

describe('resolveRoute', () => {
  it('happy path: non-index title gets kebab key and path under base', () => {
    const page = resolveRoute('About', '/');
    expect(page.key).toBe('about');
    expect(page.title).toBe('About');
    expect(page.path).toBe('/about');
  });

  it('Index title gets path equal to base (root)', () => {
    const page = resolveRoute('Index', '/');
    expect(page.key).toBe('index');
    expect(page.path).toBe('/');
  });

  it('Home title gets path equal to base (root)', () => {
    const page = resolveRoute('Home', '/');
    expect(page.key).toBe('home');
    expect(page.path).toBe('/');
  });

  it('base with segment: non-index path is base + key (no extra slash)', () => {
    const page = resolveRoute('Projects', '/app');
    expect(page.key).toBe('projects');
    expect(page.path).toBe('/appprojects');
  });

  it('base with segment: Index still gets base only', () => {
    const page = resolveRoute('Index', '/app');
    expect(page.key).toBe('index');
    expect(page.path).toBe('/app');
  });
});
