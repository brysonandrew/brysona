import { OUTREACH_COUNTRIES } from '@pages/_dev/outreacher/timezone-timeline/constants';
import { TOffsetRow, TRegion } from '@pages/_dev/outreacher/timezone-timeline/types';

export const isOfficeHour = (
  date: Date,
  timeZone: string,
): boolean => {
  const hour = Number(
    new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      hour12: false,
      timeZone,
    }).format(date),
  );
  return hour >= 9 && hour < 17;
};

export function pickRandomSubset<T>(
  items: T[],
  max: number,
): T[] {
  if (items.length <= max) return items;
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = copy[i];
    copy[i] = copy[j];
    copy[j] = tmp;
  }
  return copy.slice(0, max);
}

export const getViewerTimeZone = () => {
  try {
    return (
      Intl.DateTimeFormat().resolvedOptions().timeZone ||
      'UTC'
    );
  } catch {
    return 'UTC';
  }
};

export const getOffsetHours = (
  timeZone: string,
): number => {
  const now = new Date();
  const tzString = now.toLocaleString('en-US', {
    timeZone,
  });
  const tzDate = new Date(tzString);
  const diffMs = tzDate.getTime() - now.getTime();
  return Math.round(diffMs / 36e5);
};

export const getOffsetLabel = (
  offsetHours: number,
): string => {
  if (offsetHours === 0) return 'UTC';
  const sign = offsetHours > 0 ? '+' : '-';
  const abs = Math.abs(offsetHours);
  return `UTC${sign}${abs}`;
};

export const formatTimeInZone = (
  date: Date,
  timeZone: string,
): string =>
  new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone,
  }).format(date);

export const buildOffsetRows = (
  now: Date,
): TOffsetRow[] => {
  const byOffset = new Map<
    number,
    {
      cities: Set<string>;
      countries: Set<string>;
      timeZones: Set<string>;
      regions: Set<string>;
      hasOfficeNow: boolean;
    }
  >();

  for (const entry of OUTREACH_COUNTRIES) {
    const offsetHours = getOffsetHours(entry.timeZone);
    const officeNow = isOfficeHour(now, entry.timeZone);
    const existing = byOffset.get(offsetHours);

    if (existing) {
      existing.cities.add(entry.city);
      existing.countries.add(entry.country);
      existing.timeZones.add(entry.timeZone);
      existing.regions.add(entry.region);
      if (officeNow) existing.hasOfficeNow = true;
    } else {
      byOffset.set(offsetHours, {
        cities: new Set([entry.city]),
        countries: new Set([entry.country]),
        timeZones: new Set([entry.timeZone]),
        regions: new Set([entry.region]),
        hasOfficeNow: officeNow,
      });
    }
  }

  const rows: TOffsetRow[] = [];

  for (let offset = -12; offset <= 11; offset += 1) {
    const bucket = byOffset.get(offset);

    if (bucket) {
      rows.push({
        offsetHours: offset,
        offsetLabel: getOffsetLabel(offset),
        countryCount: bucket.countries.size,
        sampleCities: Array.from(bucket.cities).slice(0, 4),
        hasOfficeNow: bucket.hasOfficeNow,
        regions: Array.from(bucket.regions) as TRegion[],
      });
    } else {
      rows.push({
        offsetHours: offset,
        offsetLabel: getOffsetLabel(offset),
        countryCount: 0,
        sampleCities: [],
        hasOfficeNow: false,
        regions: [],
      });
    }
  }

  return rows;
};
