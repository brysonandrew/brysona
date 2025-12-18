import { OUTREACH_COUNTRIES } from '@pages/_dev/outreacher/timezone-timeline/constants';
import { fetchNearbyTowns } from '@pages/_dev/outreacher/timezone-timeline/search/utils';
import {
  TSearchTown,
  TOffsetRow,
} from '@pages/_dev/outreacher/timezone-timeline/types';
import {
  isOfficeHour,
  pickRandomSubset,
  getOffsetLabel,
  getOffsetHours,
} from '@pages/_dev/outreacher/timezone-timeline/utils';
import { useState, useEffect, useCallback } from 'react';
import { useOutreacher } from '@pages/_dev/outreacher/context';

type TTimezoneTimelineSearchProps = {
  rows: TOffsetRow[];
  availableTimezones: number[];
  selectedTimezones: Set<number>;
  onTimezoneToggle: (offsetHours: number) => void;
};

export const TimezoneTimelineSearch = ({
  rows,
  availableTimezones,
  selectedTimezones,
  onTimezoneToggle,
}: TTimezoneTimelineSearchProps) => {
  const {
    setTownSearchResults,
    setTimezoneGenerateButtonProps,
    setBusinessFinderLocation,
  } = useOutreacher();
  const [results, setResults] = useState<TSearchTown[]>([]);
  const [statusMessage, setStatusMessage] = useState<
    string | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);

  const now = new Date();

  // For checkboxes / labels that should be highlighted
  const isActiveTimezone = (offsetHours: number) => {
    const row = rows.find(
      (r) => r.offsetHours === offsetHours,
    );
    return row?.hasOfficeNow ?? false;
  };

  const timezoneLabelClass = (offsetHours: number) => {
    const isActive = isActiveTimezone(offsetHours);
    const isSelected = selectedTimezones.has(offsetHours);
    return isActive || isSelected
      ? 'text-primary-05 font-semibold'
      : 'text-white-07';
  };

  const checkboxClass = (offsetHours: number) => {
    const isActive = isActiveTimezone(offsetHours);
    const isSelected = selectedTimezones.has(offsetHours);
    return [
      'h-4 w-4 rounded-md border border-white-02 bg-black-4/60 backdrop-blur-sm appearance-none transition-colors shadow-[0_0_0_1px_rgba(255,255,255,0.05)]',
      'checked:bg-primary-04 checked:border-primary-08 checked:shadow-[0_0_12px_rgba(56,189,248,0.7)]',
      isActive || isSelected
        ? 'bg-primary-03/30 border-primary-04 shadow-[0_0_12px_rgba(56,189,248,0.55)]'
        : '',
    ].join(' ');
  };

  const handleSelectTown = (town: TSearchTown) => {
    // Find the country for the baseCity
    const countryEntry = OUTREACH_COUNTRIES.find(
      (c) => c.city === town.baseCity,
    );
    const country = countryEntry?.country || '';

    // Format as "town, city, country"
    const location = `${town.name}, ${town.baseCity}${
      country ? `, ${country}` : ''
    }`;
    setBusinessFinderLocation(location);
  };

  const handleGenerate = useCallback(async () => {
    const populationSlider = document.getElementById(
      'population-slider',
    ) as HTMLInputElement | null;
    const resultsSlider = document.getElementById(
      'results-slider',
    ) as HTMLInputElement | null;

    const populationLevel = populationSlider
      ? Number(populationSlider.value)
      : 2;
    const totalResults = resultsSlider
      ? Number(resultsSlider.value)
      : 10;

    if (selectedTimezones.size === 0) {
      setResults([]);
      setStatusMessage('Select at least one timezone.');
      return;
    }

    setIsLoading(true);
    setStatusMessage(
      'Searching nearby towns via Google Maps…',
    );
    setResults([]);

    try {
      const nowSearch = new Date();

      // Filter cities by selected timezones
      const officeCities = OUTREACH_COUNTRIES.filter(
        (entry) => {
          const entryOffset = getOffsetHours(
            entry.timeZone,
          );
          return (
            selectedTimezones.has(entryOffset) &&
            isOfficeHour(nowSearch, entry.timeZone)
          );
        },
      );

      if (officeCities.length === 0) {
        setResults([]);
        setStatusMessage(
          'No office-hours cities in the selected timezones right now.',
        );
        return;
      }

      const maxPerCity = Math.max(
        1,
        Math.ceil(totalResults / officeCities.length),
      );

      const allResults: TSearchTown[] = [];

      for (const city of officeCities) {
        const towns = await fetchNearbyTowns(
          city,
          populationLevel,
          maxPerCity,
        );
        allResults.push(...towns);
      }

      const uniqueMap = new Map<string, TSearchTown>();
      for (const t of allResults) {
        const key = `${t.name}-${t.baseCity}`;
        if (!uniqueMap.has(key)) uniqueMap.set(key, t);
      }

      let unique = Array.from(uniqueMap.values());

      if (unique.length === 0) {
        setResults([]);
        setStatusMessage(
          'No nearby towns found. Try a larger population range or different regions.',
        );
        return;
      }

      if (unique.length > totalResults) {
        unique = pickRandomSubset(unique, totalResults);
      }

      setResults(unique);
      setStatusMessage(null);
      setTownSearchResults({
        towns: unique,
        isLoading: false,
        statusMessage: null,
      });
    } catch {
      setResults([]);
      setStatusMessage(
        'Error while searching towns. Try again in a moment.',
      );
      setTownSearchResults({
        towns: [],
        isLoading: false,
        statusMessage:
          'Error while searching towns. Try again in a moment.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [selectedTimezones, setTownSearchResults]);

  // Expose button props to context
  useEffect(() => {
    setTimezoneGenerateButtonProps({
      handleGenerate,
      isLoading,
      disabled: selectedTimezones.size === 0,
    });
  }, [
    setTimezoneGenerateButtonProps,
    handleGenerate,
    isLoading,
    selectedTimezones,
  ]);

  // Expose search results to context
  useEffect(() => {
    setTownSearchResults({
      towns: results,
      isLoading,
      statusMessage,
    });
  }, [setTownSearchResults, results, isLoading, statusMessage]);

  return (
    <div className="pt-3 border-t border-white-02 mt-1 flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-col gap-1">
          <span className="text-white-09 text-xs font-semibold">
            Nearby towns (current office hours)
          </span>
          <span className="text-white-06 text-[0.7rem]">
            Choose timezones, town size, and results.
          </span>
        </div>
      </div>

      {/* Timezone toggles */}
      <div className="flex flex-col items-stretch gap-1">
        <span className="text-xs font-medium uppercase tracking-[0.16em] text-white-06">
          Timezones
        </span>
        <div className="flex flex-wrap gap-2 text-[0.7rem] text-white-07">
          {availableTimezones.map((offsetHours) => {
            const row = rows.find(
              (r) => r.offsetHours === offsetHours,
            );
            const isChecked =
              selectedTimezones.has(offsetHours);
            const label = getOffsetLabel(offsetHours);

            return (
              <label
                key={offsetHours}
                className="inline-flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() =>
                    onTimezoneToggle(offsetHours)
                  }
                  className={checkboxClass(offsetHours)}
                />
                <span
                  className={timezoneLabelClass(
                    offsetHours,
                  )}
                >
                  {label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Sliders */}
      <div className="text-[0.7rem] text-white-07 flex flex-col gap-3">
        <div className="flex flex-col items-stretch gap-1">
          <label
            htmlFor="population-slider"
            className="text-xs font-medium uppercase tracking-[0.16em] text-white-06"
          >
            Approx. population / town size
          </label>
          <input
            id="population-slider"
            type="range"
            min={1}
            max={3}
            defaultValue={2}
            className="w-full accent-primary"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="results-slider"
            className="text-xs font-medium uppercase tracking-[0.16em] text-white-06"
          >
            Number of results / result count
          </label>
          <input
            id="results-slider"
            type="range"
            min={3}
            max={48}
            defaultValue={48}
            className="w-full accent-primary"
          />
        </div>
      </div>
    </div>
  );
};
