import { OFFSET_TIMEZONE_NAMES } from '@pages/_dev/outreacher/timezone-timeline/constants';
import { TOffsetRow } from '@pages/_dev/outreacher/timezone-timeline/types';
import { cx } from 'class-variance-authority';

type TTimelineProps = {
  rows: TOffsetRow[];
  viewerOffset: number;
  utcHour: number;
  utcMinutes: number;
  maxCountries: number;
  selectedTimezones: Set<number>;
  onRowClick: (offsetHours: number) => void;
};

export const TimezoneTimelineGraph = ({
  rows,
  viewerOffset,
  utcHour,
  utcMinutes,
  selectedTimezones,
  onRowClick,
}: TTimelineProps) => {
  return (
    <div className="flex flex-col gap-1">
      {rows.map((row, index) => {
        const isViewerOffset =
          row.offsetHours === viewerOffset;
        const isIdealNow = row.hasOfficeNow;
        const isSelected = selectedTimezones.has(
          row.offsetHours,
        );
        const isClickable = row.countryCount > 0;

        const localHour =
          (utcHour + row.offsetHours + 24) % 24;
        const localTime = `${localHour.toString().padStart(2, '0')}:${utcMinutes
          .toString()
          .padStart(2, '0')}`;

        const timezoneName =
          OFFSET_TIMEZONE_NAMES[String(row.offsetHours)] ??
          '';

        // Highlight left-side text if ideal
        const timeClass = isIdealNow
          ? 'text-primary-03'
          : 'text-white-07';

        const offsetClass = isIdealNow
          ? 'text-primary'
          : isViewerOffset
            ? 'text-primary'
            : 'text-white-08';

        const tzNameClass = isIdealNow
          ? 'text-primary-04'
          : 'text-white-05';

        const regionClass = isIdealNow
          ? 'text-primary-05'
          : 'text-white-04';

        // Zebra background
        const zebraBg =
          index % 2 === 0
            ? 'bg-black-1/40'
            : 'bg-black-2/40';

        const rowBg = isSelected
          ? 'bg-primary-01/20 border-primary-04/40'
          : isClickable
            ? 'hover:bg-black-3/40 cursor-pointer border-transparent'
            : 'border-transparent';

        return (
          <div
            key={row.offsetLabel}
            onClick={() =>
              isClickable && onRowClick(row.offsetHours)
            }
            className={cx(
              `flex items-center gap-2 text-xs rounded-lg px-2 py-0.5 transition-colors`,
              'border border-white-02',
              zebraBg,
              rowBg,
            )}
          >
            {/* Left: region + time + UTC + tz name */}
            <div className="flex items-baseline gap-2 min-w-0">
              <span className={`font-mono ${timeClass}`}>
                {localTime}
              </span>

              <span
                className={`font-semibold ${offsetClass}`}
              >
                {row.offsetLabel}
              </span>

              {timezoneName && (
                <span className={tzNameClass}>
                  {timezoneName}
                </span>
              )}

              {row.regions.length > 0 && (
                <span
                  className={`font-semibold uppercase ${regionClass}`}
                >
                  {row.regions.join(', ')}
                </span>
              )}
            </div>

            {/* Cluster (cities) */}
            {row.sampleCities.length > 0 && (
              <div
                className={cx(
                  `flex flex-wrap gap-1 ml-auto`,
                )}
              >
                {row.sampleCities.map((city) => (
                  <span
                    key={city}
                    className={cx(
                      'border border-white-02',
                      isIdealNow
                        ? // Highlighted cluster: white text
                          'px-1.5 py-0.5 rounded-md bg-primary-01/40 text-white-09 text-xs'
                        : // Normal cluster
                          'px-1.5 py-0.5 rounded-md bg-black-2 text-white-06 text-xs',
                    )}
                  >
                    {city}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
