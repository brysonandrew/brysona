import type { FC, FormEvent } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { GOOGLE_MAPS_API_KEY as IMPORTED_KEY } from '@pages/_dev/outreacher/timezone-timeline/constants';
import { useOutreacher } from './context';

declare global {
  interface Window {
    __gmapsPlacesPromise?: Promise<void>;
    __initPlaces?: () => void;
    google?: any;
    __locTypingTimer?: number;
  }
}

export type TBusiness = {
  id: string;
  name: string;
  address: string;
  website?: string;
  googleMapsUrl?: string;
  lat?: number;
  lng?: number;
  rawTypes?: string[];
};

const loadGooglePlacesOnce = (apiKey: string): Promise<void> => {
  if (window.google?.maps?.places) return Promise.resolve();

  if (!window.__gmapsPlacesPromise) {
    window.__gmapsPlacesPromise = new Promise<void>((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>('script[data-gmaps="places"]');

      window.__initPlaces = () => {
        if (window.google?.maps?.places) resolve();
        else reject(new Error('Google script loaded but places is missing'));
      };

      const attachHandlers = (script: HTMLScriptElement) => {
        script.addEventListener('error', () => {
          reject(new Error('Failed to load Google Maps script (network/CSP?)'));
        });
      };

      if (existing) {
        if (window.google?.maps?.places) {
          resolve();
          return;
        }
        attachHandlers(existing);
        return;
      }

      const script = document.createElement('script');
      script.dataset.gmaps = 'places';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=__initPlaces`;
      script.async = true;
      script.defer = true;

      attachHandlers(script);
      document.head.appendChild(script);
    });
  }

  return window.__gmapsPlacesPromise;
};

type LocationInputProps = {
  index: number;
  value: string;
  onChange: (value: string) => void;
  onRemove: () => void;
  canRemove: boolean;
  apiKey: string;
};

const LocationInput: FC<LocationInputProps> = ({
  index,
  value,
  onChange,
  onRemove,
  canRemove,
  apiKey,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const isSelectingFromAutocompleteRef = useRef(false);
  const isUserTypingRef = useRef(false);
  const didInitAutocompleteRef = useRef(false);
  const lastValueRef = useRef(value);

  // Initialize Google Places Autocomplete for this input
  useEffect(() => {
    const input = inputRef.current;
    if (!input || didInitAutocompleteRef.current) return;

    didInitAutocompleteRef.current = true;
    input.setAttribute('autocomplete', 'new-password');
    input.setAttribute('spellcheck', 'false');

    const init = async () => {
      try {
        await loadGooglePlacesOnce(apiKey);

        if (!window.google?.maps?.places) {
          console.error('[Places] places library missing after load');
          return;
        }

        if (autocompleteRef.current) {
          window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
          autocompleteRef.current = null;
        }

        const ac = new window.google.maps.places.Autocomplete(input, {
          types: ['(cities)'],
          fields: ['formatted_address', 'name', 'geometry'],
        });

        ac.addListener('place_changed', () => {
          const place = ac.getPlace();
          const address = place?.formatted_address || place?.name;
          if (!address) return;

          isSelectingFromAutocompleteRef.current = true;
          isUserTypingRef.current = false;
          lastValueRef.current = address;

          if (inputRef.current) inputRef.current.value = address;
          onChange(address);

          window.setTimeout(() => {
            isSelectingFromAutocompleteRef.current = false;
          }, 250);
        });

        autocompleteRef.current = ac;
      } catch (err) {
        console.error('[Places] init failed:', err);
      }
    };

    void init();

    return () => {
      if (autocompleteRef.current && window.google?.maps?.event) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
        autocompleteRef.current = null;
      }
    };
  }, [apiKey, onChange]);

  // Detect selecting from dropdown
  useEffect(() => {
    const onPointerDown = (event: Event) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (target.closest?.('.pac-container')) {
        isSelectingFromAutocompleteRef.current = true;
        isUserTypingRef.current = false;
      }
    };

    const onPointerUp = () => {
      window.setTimeout(() => {
        isSelectingFromAutocompleteRef.current = false;
      }, 400);
    };

    document.addEventListener('mousedown', onPointerDown, true);
    document.addEventListener('touchstart', onPointerDown, true);
    document.addEventListener('mouseup', onPointerUp, true);
    document.addEventListener('touchend', onPointerUp, true);

    return () => {
      document.removeEventListener('mousedown', onPointerDown, true);
      document.removeEventListener('touchstart', onPointerDown, true);
      document.removeEventListener('mouseup', onPointerUp, true);
      document.removeEventListener('touchend', onPointerUp, true);
    };
  }, []);

  const showRemoveButton = value.trim().length > 0;

  return (
    <div className="relative flex items-center gap-2">
      <input
        ref={inputRef}
        id={`location-input-${index}`}
        className="h-9 flex-1 rounded-xl border border-white-02 bg-black-2 px-3.5 py-2.5 pr-10 text-sm text-white-9 placeholder:text-white-06 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary-06"
        placeholder="e.g. Stockholm, Sweden"
        value={value}
        onChange={(e) => {
          if (isSelectingFromAutocompleteRef.current) return;

          const newValue = e.target.value;
          isUserTypingRef.current = true;
          lastValueRef.current = newValue;
          onChange(newValue);

          if (window.__locTypingTimer) window.clearTimeout(window.__locTypingTimer);
          window.__locTypingTimer = window.setTimeout(() => {
            isUserTypingRef.current = false;
          }, 150);
        }}
        onBlur={() => {
          isUserTypingRef.current = false;
        }}
      />
      {showRemoveButton && (
        <button
          type="button"
          onClick={() => {
            if (canRemove) {
              onRemove();
            } else {
              onChange('');
            }
          }}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 rounded text-white-06 hover:text-white-09 hover:bg-black-3 transition-colors"
          title={canRemove ? 'Remove location' : 'Clear location'}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
        </button>
      )}
    </div>
  );
};

export const BusinessSearchPanel: FC = () => {
  const {
    businessIndustry,
    setBusinessIndustry,
    businessLocations,
    setBusinessLocations,
    businessFinderLocation,
    handleBusinessSearch,
    businessError,
    businessLastQuerySummary,
  } = useOutreacher();

  const [industry, setIndustry] = useState(businessIndustry);
  const [locations, setLocations] = useState<string[]>(
    businessLocations.length > 0 ? businessLocations : ['']
  );

  const keyFromEnv = (import.meta as any)?.env?.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
  const apiKey = (IMPORTED_KEY || keyFromEnv || '').trim();

  // Sync local industry state from context
  useEffect(() => {
    if (businessIndustry !== industry) {
      setIndustry(businessIndustry);
    }
  }, [businessIndustry]);

  // Sync local locations state from context
  useEffect(() => {
    if (businessLocations.length > 0 && JSON.stringify(businessLocations) !== JSON.stringify(locations)) {
      setLocations(businessLocations);
    }
  }, [businessLocations]);

  // Add location from finder
  useEffect(() => {
    if (businessFinderLocation && !locations.includes(businessFinderLocation)) {
      setLocations((prev) => {
        // If first location is empty, replace it; otherwise add
        if (prev.length === 1 && !prev[0].trim()) {
          return [businessFinderLocation];
        }
        return [...prev, businessFinderLocation];
      });
    }
  }, [businessFinderLocation, locations]);

  // CSS fix: ensure dropdown is above overlays
  useEffect(() => {
    const styleId = 'gmaps-pac-zindex-fix';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .pac-container { z-index: 999999 !important; }
      body { position: relative; }
    `;
    document.head.appendChild(style);

    return () => style.remove();
  }, []);

  const handleLocationChange = useCallback((index: number, value: string) => {
    setLocations((prev) => {
      const newLocations = [...prev];
      newLocations[index] = value;
      return newLocations;
    });
  }, []);

  const handleLocationRemove = useCallback((index: number) => {
    setLocations((prev) => {
      const newLocations = prev.filter((_, i) => i !== index);
      // Ensure at least one empty field remains
      return newLocations.length === 0 ? [''] : newLocations;
    });
  }, []);

  const handleAddLocation = useCallback(() => {
    setLocations((prev) => [...prev, '']);
  }, []);

  const handleSubmit = useCallback(
    async (event?: FormEvent) => {
      event?.preventDefault();

      // Commit latest local values right before searching
      setBusinessIndustry(industry);
      setBusinessLocations(locations);

      await handleBusinessSearch(industry, locations);
    },
    [handleBusinessSearch, industry, locations, setBusinessIndustry, setBusinessLocations],
  );

  if (!apiKey) {
    console.warn(
      '[Places] No API key found. If you use Vite, define VITE_GOOGLE_MAPS_API_KEY in .env and restart dev server.',
    );
  }

  return (
    <section className="w-full rounded-t-2xl border-t border-l border-r border-white-02 bg-dark-07 shadow-[0_18px_60px_rgba(0,0,0,0.7)] backdrop-blur-2xl flex flex-col gap-4 p-4 md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white-09">Lead Finder</h2>
          <p className="mt-1 text-xs text-white-06">
            Discover businesses by industry + location and feed them into Outreacher.
          </p>
        </div>

        {businessLastQuerySummary && (
          <div className="flex max-w-xs flex-col items-start md:items-end">
            <span className="text-[10px] uppercase tracking-[0.08em] text-white-06">Last search</span>
            <span className="mt-0.5 text-[11px] text-white-08 text-left md:text-right">
              {businessLastQuerySummary}
            </span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid gap-3 md:grid-cols-[minmax(0,2fr)_minmax(0,2fr)] md:items-start">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="industry-input" className="text-xs font-medium text-white-06">
              Industry
            </label>
            <input
              id="industry-input"
              className="h-9 rounded-xl border border-white-02 bg-black-2 px-3.5 py-2.5 text-sm text-white-9 placeholder:text-white-06 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary-06"
              placeholder="e.g. bakery, tattoo studio, SaaS agency"
              value={industry}
              onChange={(e) => {
                const value = e.target.value;
                setIndustry(value);
                setBusinessIndustry(value);
              }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="location-input-0" className="text-xs font-medium text-white-06">
                Location{locations.length > 1 ? 's' : ''}
              </label>
              <button
                type="button"
                onClick={handleAddLocation}
                className="text-[11px] text-primary hover:text-primary-08 transition-colors"
              >
                + Add location
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {locations.map((location, index) => (
                <LocationInput
                  key={index}
                  index={index}
                  value={location}
                  onChange={(value) => handleLocationChange(index, value)}
                  onRemove={() => handleLocationRemove(index)}
                  canRemove={locations.length > 1}
                  apiKey={apiKey}
                />
              ))}
            </div>
          </div>
        </div>
      </form>

      {businessError && (
        <div className="rounded-xl border border-red/40 bg-red/10 px-3.5 py-2.5 text-sm text-white">
          {businessError}
        </div>
      )}
    </section>
  );
};
