import { keysUuid } from '@brysonandrew/utils';
import {
  TInitIdItem,
  TInitIdItems,
  TInitItem,
} from './types';

export const HOURLY_MAX = 120;

export const PROPOSALS_DEFAULT = {
  proposals: '0-4',
};

export const HOURLY_DEFAULT = {
  min: 40,
  max: HOURLY_MAX,
} as const;

export const SORT_DEFAULT = {
  // &sort=recency&t=0
  sort: 'recency',
} as const;

export const RANGE_WIDTH = 120;

export const UPWORK_BASE =
  'https://www.upwork.com/nx/search/jobs/';

const applyDefaults = (
  values: readonly TInitItem[],
): TInitIdItem[] =>
  values.reduce((a: TInitIdItem[], value: TInitItem) => {
    const next = {
      id: keysUuid(),
      ...value,
    } as TInitIdItem;

    return [...a, next];
  }, []);

const INIT_ITEMS = [
  {
    q: 'React and Typescript Gatsby SEO',
  },
  {
    q: 'React and Typescript SEO',
  },
  {
    q: 'React and Typescript',
  },
  {
    q: 'React',
  },
  {
    q: 'Typescript',
  },
  {
    q: 'Stable Diffusion',
  },
  {
    q: 'three.js',
  },
  {
    q: 'web developer',
  },
  {
    q: 'web designer',
  },
] as const;

export const ITEMS: TInitIdItems =
  applyDefaults(INIT_ITEMS);

// href: 'https://www.upwork.com/nx/search/jobs/?contractor_tier=2,3&hourly_rate=-100&location=Australia%20and%20New%20Zealand&nbs=1&q=react%20typescript&sort=recency&t=0',
