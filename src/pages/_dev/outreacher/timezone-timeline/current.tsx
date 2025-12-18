import type { FC } from 'react';

type THeaderProps = {
  viewerTimeZone: string;
  viewerTime: string;
  viewerOffsetLabel: string;
};

export const TimezoneTimelineCurrent: FC<THeaderProps> = ({
  viewerTimeZone,
  viewerTime,
  viewerOffsetLabel,
}) => {
  return (
    <div className='flex justify-end'>
      <div className="px-3 py-2 rounded-xl bg-black-2 border border-white-02 text-xs inline-flex flex-col items-start md:items-end gap-0.5">
        <span className="text-white-08">
          Your timezone:{' '}
          <span className="font-semibold text-primary">
            {viewerTimeZone}
          </span>
        </span>

        <span className="text-white-08">
          Local time:{' '}
          <span className="font-mono text-primary-08">
            {viewerTime}
          </span>
        </span>

        <span className="text-white-06 text-[0.7rem]">
          Offset:{' '}
          <span className="font-medium text-primary-06">
            {viewerOffsetLabel}
          </span>
        </span>
      </div>
    </div>
  );
};
