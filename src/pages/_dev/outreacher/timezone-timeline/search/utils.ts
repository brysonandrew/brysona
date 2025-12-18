import { NEARBY_TOWNS, CITY_COORDS, GOOGLE_MAPS_API_KEY } from "@pages/_dev/outreacher/timezone-timeline/constants";
import { TOutreachCountry, TSearchTown, TGooglePlacesResult } from "@pages/_dev/outreacher/timezone-timeline/types";
import { pickRandomSubset } from "@pages/_dev/outreacher/timezone-timeline/utils";

export const getNearbyTownsFallback = (city: string): string[] => {
  const config = NEARBY_TOWNS.find(
    (entry) => entry.city === city,
  );
  return config ? config.nearbyTowns : [];
};

export const getRadiusForPopulationLevel = (
  populationLevel: number,
): number => {
  if (populationLevel <= 1) return 15000;
  if (populationLevel === 2) return 30000;
  return 50000;
};

export const fetchNearbyTowns = async (
  city: TOutreachCountry,
  populationLevel: number,
  maxPerCity: number,
): Promise<TSearchTown[]> => {
  const coords = CITY_COORDS[city.city];

  // No coords or missing API key → fallback mode
  if (!coords || !GOOGLE_MAPS_API_KEY) {
    const fallback = pickRandomSubset(
      getNearbyTownsFallback(city.city),
      maxPerCity,
    );

    return fallback.map((name) => ({
      name,
      placeId: '',
      lat: coords ? coords.lat : 0,
      lng: coords ? coords.lng : 0,
      baseCity: city.city,
    }));
  }

  const radius = getRadiusForPopulationLevel(populationLevel);
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${coords.lat},${coords.lng}&radius=${radius}&type=locality&key=${GOOGLE_MAPS_API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed Places request');

    const data = (await response.json()) as {
      results?: TGooglePlacesResult[];
    };

    const results = data.results || [];

    // Deduplicate by name
    const uniqueByName = new Map<string, TGooglePlacesResult>();
    for (const r of results) {
      if (!r.name) continue;
      if (!uniqueByName.has(r.name)) uniqueByName.set(r.name, r);
    }

    const limited = Array.from(uniqueByName.values()).slice(
      0,
      maxPerCity,
    );

    return limited.map((r) => ({
      name: r.name,
      placeId: r.place_id,
      lat: r.geometry?.location?.lat ?? coords.lat,
      lng: r.geometry?.location?.lng ?? coords.lng,
      baseCity: city.city,
    }));
  } catch {
    // Fully offline or quota exceeded → fallback again
    const fallback = pickRandomSubset(
      getNearbyTownsFallback(city.city),
      maxPerCity,
    );

    return fallback.map((name) => ({
      name,
      placeId: '',
      lat: coords.lat,
      lng: coords.lng,
      baseCity: city.city,
    }));
  }
};