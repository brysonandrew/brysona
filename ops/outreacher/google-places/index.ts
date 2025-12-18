// src/services/google-places.ts
import axios from 'axios';

const GOOGLE_PLACES_URL = 'https://places.googleapis.com/v1/places:searchText';

const GOOGLE_PLACES_FIELD_MASK = [
  'places.id',
  'places.displayName',
  'places.formattedAddress',
  'places.websiteUri',
  'places.location',
  'places.types',
  'places.googleMapsUri',
].join(',');

export type TBusinessSearchParams = {
  businessType: string;
  location: string;
  limit?: number;
};

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

// ---- Simple in-memory cache ----

type TCacheEntry = {
  expiresAt: number;
  data: TBusiness[];
};

const businessSearchCache = new Map<string, TCacheEntry>();

const getCacheTtlMs = (): number => {
  const hoursFromEnv = Number(process.env.BUSINESS_SEARCH_CACHE_TTL_HOURS);
  const hours = Number.isFinite(hoursFromEnv) && hoursFromEnv > 0 ? hoursFromEnv : 6;
  return hours * 60 * 60 * 1000;
};

const buildCacheKey = (params: TBusinessSearchParams & { limit: number }): string => {
  const { businessType, location, limit } = params;
  return [
    businessType.trim().toLowerCase(),
    location.trim().toLowerCase(),
    limit,
  ].join('|');
};

const getFromCache = (key: string): TBusiness[] | null => {
  const now = Date.now();
  const entry = businessSearchCache.get(key);

  if (!entry) return null;
  if (entry.expiresAt <= now) {
    businessSearchCache.delete(key);
    return null;
  }

  return entry.data;
};

const setCache = (key: string, data: TBusiness[]): void => {
  const ttlMs = getCacheTtlMs();
  businessSearchCache.set(key, {
    data,
    expiresAt: Date.now() + ttlMs,
  });
};

// ---- Main function ----

export const searchBusinessesViaPlaces = async (
  params: TBusinessSearchParams,
): Promise<TBusiness[]> => {
  const { businessType, location } = params;
  const limit = params.limit ?? 20;

  const apiKey = process.env.GOOGLE_PLACES_SERVER_KEY;
  if (!apiKey) {
    throw new Error('Missing GOOGLE_PLACES_SERVER_KEY env var');
  }

  const normalizedParams = {
    businessType: businessType.trim(),
    location: location.trim(),
    limit: Math.min(Math.max(limit, 1), 50),
  };

  const cacheKey = buildCacheKey(normalizedParams);
  const cached = getFromCache(cacheKey);
  if (cached) {
    return cached;
  }

  const textQuery = `${normalizedParams.businessType} in ${normalizedParams.location}`;

  const response = await axios.post(
    GOOGLE_PLACES_URL,
    {
      textQuery,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': GOOGLE_PLACES_FIELD_MASK,
      },
    },
  );

  const places = response.data?.places ?? [];

  // Optional: only keep results that actually have a website
  const filtered = places.filter((p: any) => p.websiteUri);

  const businesses: TBusiness[] = filtered
    .slice(0, normalizedParams.limit)
    .map((p: any) => ({
      id: p.id,
      name: p.displayName?.text ?? '',
      address: p.formattedAddress ?? '',
      website: p.websiteUri ?? undefined,
      googleMapsUrl: p.googleMapsUri ?? undefined,
      lat: p.location?.latitude,
      lng: p.location?.longitude,
      rawTypes: p.types ?? [],
    }));

  setCache(cacheKey, businesses);

  return businesses;
};
