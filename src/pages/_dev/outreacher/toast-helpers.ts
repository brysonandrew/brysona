// toastHelpers.ts
import type { TToastType } from './types';

export const getToastIcon = (type: TToastType) => {
  if (type === 'success') return '✅';
  if (type === 'error') return '⚠️';
  return '💡';
};

export const getToastClasses = (type: TToastType) => {
  if (type === 'success') return 'bg-emerald-500/90 border-emerald-300/60';
  if (type === 'error') return 'bg-red-500/90 border-red-300/60';
  return 'bg-slate-900/95 border-slate-600/60';
};