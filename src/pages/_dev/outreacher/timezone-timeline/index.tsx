import { TimezoneTimelineCurrent } from '@pages/_dev/outreacher/timezone-timeline/current';
import { TimezoneTimelineGraph } from '@pages/_dev/outreacher/timezone-timeline/graph';
import { TimezoneTimelineHeader } from '@pages/_dev/outreacher/timezone-timeline/header';
import { TimezoneTimelineSearch } from '@pages/_dev/outreacher/timezone-timeline/search';
import {
  buildOffsetRows,
  formatTimeInZone,
  getOffsetHours,
  getOffsetLabel,
  getViewerTimeZone,
} from '@pages/_dev/outreacher/timezone-timeline/utils';
import { useMemo, useEffect } from 'react';
import { useOutreacher } from '../context';

export const TimezoneTimeline = () => {
  const { selectedTimezones, setSelectedTimezones } = useOutreacher();
  const now = new Date();
  const viewerTimeZone = getViewerTimeZone();
  const viewerOffset = getOffsetHours(viewerTimeZone);
  const viewerOffsetLabel = getOffsetLabel(viewerOffset);
  const viewerTime = formatTimeInZone(now, viewerTimeZone);

  const utcHour = now.getUTCHours();
  const utcMinutes = now.getUTCMinutes();

  const rows = buildOffsetRows(now);
  const maxCountries =
    rows.reduce(
      (max, row) =>
        row.countryCount > max ? row.countryCount : max,
      0,
    ) || 1;

  // Get unique timezones from rows that have cities
  const availableTimezones = useMemo(() => {
    return rows
      .filter((row) => row.countryCount > 0)
      .map((row) => row.offsetHours);
  }, [rows]);

  // Initialize selected timezones with those that have office hours now
  const initialSelectedTimezones = useMemo(() => {
    return rows
      .filter((row) => row.hasOfficeNow && row.countryCount > 0)
      .map((row) => row.offsetHours);
  }, [rows]);

  // Initialize selected timezones if empty
  useEffect(() => {
    if (selectedTimezones.size === 0 && initialSelectedTimezones.length > 0) {
      setSelectedTimezones(new Set(initialSelectedTimezones));
    }
  }, [selectedTimezones.size, initialSelectedTimezones, setSelectedTimezones]);

  const handleTimezoneToggle = (offsetHours: number) => {
    setSelectedTimezones((prev) => {
      const next = new Set(prev);
      if (next.has(offsetHours)) {
        next.delete(offsetHours);
      } else {
        next.add(offsetHours);
      }
      return next;
    });
  };

  return (
    <section className="w-full rounded-t-2xl border border-white-02 border-b-0 bg-dark-07 shadow-[0_18px_60px_rgba(0,0,0,0.7)] backdrop-blur-2xl p-4 md:p-6 flex flex-col gap-4">
      <div className="flex items-start gap-6 w-full">
        <div className='grow flex flex-col items-stretch gap-2'>
          <TimezoneTimelineHeader />
          <TimezoneTimelineGraph
            rows={rows}
            viewerOffset={viewerOffset}
            utcHour={utcHour}
            utcMinutes={utcMinutes}
            maxCountries={maxCountries}
            selectedTimezones={selectedTimezones}
            onRowClick={handleTimezoneToggle}
          />
        </div>
        <div className='flex flex-col gap-2 max-w-[200px]'>
          <TimezoneTimelineCurrent
            viewerTimeZone={viewerTimeZone}
            viewerTime={viewerTime}
            viewerOffsetLabel={viewerOffsetLabel}
          />
          <TimezoneTimelineSearch
            rows={rows}
            availableTimezones={availableTimezones}
            selectedTimezones={selectedTimezones}
            onTimezoneToggle={handleTimezoneToggle}
          />
        </div>
      </div>
    </section>
  );
};
