/**
 * @vitest-environment jsdom
 * Uses jsdom: useDelay is a React hook; testing it requires React render (document,
 * DOM, and React's useEffect/setTimeout). Fake timers make the delay deterministic.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, act } from '@testing-library/react';
import { useDelay } from './useDelay';

const TestComponent = ({ ms = 200 }: { ms?: number }) => {
  const isReady = useDelay(ms);
  return <span data-testid="ready">{isReady ? 'ready' : 'waiting'}</span>;
};

describe('useDelay', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    cleanup();
  });

  it('happy path: starts false then becomes true after delay', () => {
    render(<TestComponent ms={500} />);
    expect(screen.getByTestId('ready').textContent).toBe('waiting');
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(screen.getByTestId('ready').textContent).toBe('ready');
  });

  it('edge case: default ms (200) applies', () => {
    render(<TestComponent />);
    expect(screen.getByTestId('ready').textContent).toBe('waiting');
    act(() => {
      vi.advanceTimersByTime(199);
    });
    expect(screen.getByTestId('ready').textContent).toBe('waiting');
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.getByTestId('ready').textContent).toBe('ready');
  });

  it('edge case: zero ms becomes true after next tick', () => {
    render(<TestComponent ms={0} />);
    expect(screen.getByTestId('ready').textContent).toBe('waiting');
    act(() => {
      vi.advanceTimersByTime(0);
    });
    expect(screen.getByTestId('ready').textContent).toBe('ready');
  });

  it('failure mode: unmount before timeout does not throw', () => {
    const { unmount } = render(<TestComponent ms={1000} />);
    unmount();
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    // useTimeoutRef cleanup clears the timeout; no assertion needed beyond no throw
  });
});
