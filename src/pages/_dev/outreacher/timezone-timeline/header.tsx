import type { FC } from 'react';

export const TimezoneTimelineHeader: FC = () => {
  return (
    <div className="flex flex-col gap-1">
      <h2 className="text-white-09 text-sm font-semibold">
        Office-Hour Radar
      </h2>
      <p className="text-white-06 text-xs">
        24 UTC offsets stacked vertically. Line length = how
        many countries.
      </p>
    </div>
  );
};
