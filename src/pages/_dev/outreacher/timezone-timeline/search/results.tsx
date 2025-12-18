import { GOOGLE_MAPS_API_KEY } from '@pages/_dev/outreacher/timezone-timeline/constants';

type TSearchTown = {
  name: string;
  placeId: string;
  lat: number;
  lng: number;
  baseCity: string;
};

type TTimezoneTimelineSearchResultsProps = {
  towns: TSearchTown[];
  isLoading: boolean;
  statusMessage: string | null;
  onSelectTown: (town: TSearchTown) => void;
};

/* ---------------- RESULTS COMPONENT ---------------- */

export const TimezoneTimelineSearchResults = ({
  towns,
  isLoading,
  statusMessage,
  onSelectTown,
}: TTimezoneTimelineSearchResultsProps) => {
  if (isLoading) {
    return (
      <div className="min-h-[1.5rem]">
        <p className="text-white-06 text-xs">
          Searching nearby towns via Google Maps…
        </p>
      </div>
    );
  }

  if (statusMessage) {
    return (
      <div className="min-h-[1.5rem]">
        <p className="text-white-06 text-xs">
          {statusMessage}
        </p>
      </div>
    );
  }

  if (!towns.length) {
    return null
    // return <div className="mt-1 min-h-[1.5rem]" />;
  }

  // Group towns by baseCity (location)
  const grouped = towns.reduce<
    Record<string, TSearchTown[]>
  >((acc, town) => {
    if (!acc[town.baseCity]) acc[town.baseCity] = [];
    acc[town.baseCity].push(town);
    return acc;
  }, {});

  const sortedBaseCities = Object.keys(grouped).sort(
    (a, b) => a.localeCompare(b),
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 min-h-[1.5rem]">
      {sortedBaseCities.map((baseCity) => (
        <div
          key={baseCity}
          className="rounded-xl border border-white-02 bg-black-2 px-3 py-2 flex flex-col gap-1.5"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-white-09 font-semibold">
              {baseCity}
            </span>
            <span className="text-[0.65rem] text-white-06">
              {grouped[baseCity].length} town
              {grouped[baseCity].length > 1 ? 's' : ''}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            {grouped[baseCity]
              .slice()
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((t) => {
                const encodedName = encodeURIComponent(
                  t.name,
                );
                const mapUrl =
                  t.placeId && GOOGLE_MAPS_API_KEY
                    ? `https://www.google.com/maps/search/?api=1&query_place_id=${t.placeId}`
                    : `https://www.google.com/maps/search/?api=1&query=${encodedName}`;

                return (
                  <div
                    key={`${t.name}-${t.placeId || 'noid'}`}
                    className="flex items-center justify-between gap-2 rounded-lg bg-black-3 border border-white-02 px-2 py-1"
                  >
                    <div className="flex flex-col">
                      <span className="text-xs text-white-09 font-medium">
                        {t.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <a
                        href={mapUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[0.65rem] px-2 py-0.5 rounded-lg border border-white-02 bg-black-2 hover:bg-primary-03 hover:text-black transition-colors"
                      >
                        Map
                      </a>

                      <button
                        type="button"
                        onClick={() => onSelectTown(t)}
                        className="text-[0.65rem] px-2 py-0.5 rounded-lg bg-primary text-black font-semibold hover:bg-primary-08 transition-colors"
                      >
                        Use
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
};
