import { useEffect, useMemo, useState } from 'react';
import { GOOGLE_MAPS_API_KEY } from '@pages/_dev/outreacher/timezone-timeline/constants';

declare global {
  interface Window {
    __googleMapsInit?: () => void;
  }
}

let scriptLoadingPromise: Promise<void> | null = null;

export const useGoogleMapsLoader = (libraries: string[] = ['places']) => {
  const [loaded, setLoaded] = useState(false);

  // stable key so the effect doesn't re-run just because array identity changed
  const librariesKey = useMemo(() => libraries.slice().sort().join(','), [libraries]);

  useEffect(() => {
    if (loaded) return;

    // Already available
    if (window.google?.maps) {
      setLoaded(true);
      return;
    }

    if (!scriptLoadingPromise) {
      scriptLoadingPromise = new Promise<void>((resolve, reject) => {
        const key = GOOGLE_MAPS_API_KEY;

        if (!key) {
          reject(new Error('Missing Google Maps key'));
          return;
        }

        const existing = document.getElementById('google-maps-js') as HTMLScriptElement | null;

        // If script exists and google is ready, resolve immediately
        if (existing && window.google?.maps) {
          resolve();
          return;
        }

        // If script exists but google isn't ready yet, attach listeners once
        if (existing) {
          existing.addEventListener('load', () => resolve(), { once: true });
          existing.addEventListener('error', () => reject(new Error('Google Maps failed to load')), { once: true });
          return;
        }

        // Callback is the most reliable "done" signal
        window.__googleMapsInit = () => resolve();

        const script = document.createElement('script');
        script.id = 'google-maps-js';
        script.async = true;

        // IMPORTANT: include callback + loading=async
        script.src =
          `https://maps.googleapis.com/maps/api/js` +
          `?key=${encodeURIComponent(key)}` +
          `&libraries=${encodeURIComponent(librariesKey)}` +
          `&loading=async` +
          `&callback=__googleMapsInit`;

        script.onerror = () => reject(new Error('Failed to load Google Maps script'));
        document.head.appendChild(script);
      });
    }

    scriptLoadingPromise
      .then(() => setLoaded(true))
      .catch((err) => console.error(err));
  }, [loaded, librariesKey]);

  return loaded;
};