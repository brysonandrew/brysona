export type TRegion = 'NA' | 'EU' | 'AU';

export type TOutreachCountry = {
  country: string;
  city: string;
  timeZone: string;
  region: TRegion;
};

export type TOffsetRow = {
  offsetHours: number;
  offsetLabel: string;
  countryCount: number;
  sampleCities: string[];
  hasOfficeNow: boolean;
  regions: TRegion[];
};

export type TCityCoords = {
  lat: number;
  lng: number;
};

export type TGooglePlacesResult = {
  name: string;
  place_id: string;
  geometry?: {
    location?: {
      lat: number;
      lng: number;
    };
  };
};

export type TNearbyTownConfig = {
  city: string;
  nearbyTowns: string[];
};

export type TSearchTown = {
  name: string;
  placeId: string;
  lat: number;
  lng: number;
  baseCity: string;
};

export type TTimelineProps = {
  rows: TOffsetRow[];
  viewerOffset: number;
  utcHour: number;
  utcMinutes: number;
  maxCountries: number;
};
