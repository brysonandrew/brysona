const isTestEnv = () =>
  process.env.NODE_ENV === 'test';

export const keysUuid = (): string =>
  isTestEnv()
    ? 'test-uuid'
    : Math.random().toString(36).slice(-6);

export const keysUuid1 = (): string =>
  (2100000000).toString(36);
