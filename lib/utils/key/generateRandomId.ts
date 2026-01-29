const dec2hex = (dec: number) =>
  dec.toString(16).padStart(2, '0');

export const generateId = (len = 20): string => {
  if (
    typeof window === 'undefined' ||
    typeof window.crypto?.getRandomValues !== 'function'
  ) {
    throw new Error('generateId requires window.crypto.getRandomValues');
  }
  const arr = new Uint8Array(len / 2);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, dec2hex).join('');
};
