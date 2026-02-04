import { SORT_DEFAULT } from '@pages/_dev/work/config/constants';
import {
  TUpworkParams,
  TContractorTierValue,
  THourlyValue,
  TUpworkFilterConfig,
} from '@pages/_dev/work/config/types';

const DEFAULTS = {
  t: '0',
  ...SORT_DEFAULT,
  nbs: '1',
} as const;

type TConfig = TUpworkFilterConfig;
export const resolveUpworkParams = (config: TConfig) => {
  const { isExpert, isIntermediate, hourly, ...rest } =
    config;
  const tiers = [null, null, isIntermediate, isExpert]
    .map((isActive, index) => isActive && index.toString())
    .filter(Boolean);
  const params: TUpworkParams = {
    ...DEFAULTS,
    ...rest,
    ...(tiers.length > 0
      ? {
          contractor_tier:
            tiers.join(',') as TContractorTierValue,
        }
      : {}),
    ...(typeof hourly === 'undefined'
      ? {}
      : {
          hourly_rate: `${hourly.min ?? ''}-${
            hourly.max ?? ''
          }` as THourlyValue,
        }),
  };

  return params;
};
