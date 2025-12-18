  // generateEmail.ts

import type { TGenerateEmailResponse } from './types';

export const generateEmail = async (
  url: string,
): Promise<TGenerateEmailResponse> => {
  const res = await fetch('http://localhost:4000/generate-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });

  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }

  const data = (await res.json()) as TGenerateEmailResponse;
  return data;
};