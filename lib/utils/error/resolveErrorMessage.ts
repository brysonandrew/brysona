import { TError } from '@brysonandrew/config-types/dom';

const toMessage = (
  content: string,
  source: string,
) => `${content} ${source}`.trim();

const isTestEnv = () =>
  process.env.NODE_ENV === 'test';

export const resolveErrorMessage = (
  error: TError,
  source = '',
): string | undefined => {
  if (!isTestEnv()) console.log(error);
  if (typeof error === 'string') return toMessage(error, source);
  const content =
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof error.message === 'string'
      ? toMessage(error.message, source)
      : toMessage(String(error), source);
  if (content && !isTestEnv()) console.error(content);
  return content;
};
