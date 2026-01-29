/**
 * @vitest-environment jsdom
 * NotFound uses useLocation() and Link; needs router context and DOM.
 * Mock 'react-router' to re-export from 'react-router-dom' so useLocation
 * and Link share the same router context (MemoryRouter from react-router-dom).
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { NotFound } from './index';

vi.mock('react-router', () => vi.importActual('react-router-dom'));

const renderAtPath = (path: string, homePath?: string) => {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="*" element={<NotFound homePath={homePath} />} />
      </Routes>
    </MemoryRouter>,
  );
};

describe('NotFound', () => {
  beforeEach(() => {
    cleanup();
  });

  it('renders 404 heading and requested pathname', () => {
    renderAtPath('/missing-page');
    expect(screen.getByRole('heading', { name: '404 Not Found' })).toBeDefined();
    expect(screen.getByText('/missing-page')).toBeDefined();
  });

  it('renders home link with homePath when provided', () => {
    const homePath = '/home';
    renderAtPath('/any', homePath);
    const link = screen.getByRole('link', { name: /go home/i });
    expect(link.getAttribute('href')).toBe(homePath);
  });

  it('does not render home link when homePath is omitted', () => {
    renderAtPath('/any');
    expect(screen.queryByRole('link', { name: /go home/i })).toBeNull();
  });
});
