// copyHelpers.ts
import type { TShowToastFn } from './types';

export type TCopyFn = (
  label: string,
  text?: string | null,
  via?: string,
) => Promise<void>;

export const createCopy = (showToast: TShowToastFn): TCopyFn => {
  const copy: TCopyFn = async (
    label: string,
    text?: string | null,
    via: string = 'button',
  ) => {
    if (!text) {
      showToast(`No ${label.toLowerCase()} to copy`, 'info', via);
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      showToast(`${label} copied to clipboard`, 'success', via);
    } catch {
      showToast(`Failed to copy ${label.toLowerCase()}`, 'error', via);
    }
  };

  return copy;
};