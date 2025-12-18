import {
  TOutreachCountry,
  TCityCoords,
  TNearbyTownConfig,
} from '@pages/_dev/outreacher/timezone-timeline/types';

export const OUTREACH_COUNTRIES: TOutreachCountry[] = [
  {
    country: 'Canada',
    city: 'Toronto',
    timeZone: 'America/Toronto',
    region: 'NA',
  },
  {
    country: 'Canada',
    city: 'Vancouver',
    timeZone: 'America/Vancouver',
    region: 'NA',
  },
  {
    country: 'Canada',
    city: 'Calgary',
    timeZone: 'America/Edmonton',
    region: 'NA',
  },
  {
    country: 'Canada',
    city: 'Winnipeg',
    timeZone: 'America/Winnipeg',
    region: 'NA',
  },
  {
    country: 'Canada',
    city: 'Halifax',
    timeZone: 'America/Halifax',
    region: 'NA',
  },
  {
    country: 'USA',
    city: 'New York',
    timeZone: 'America/New_York',
    region: 'NA',
  },
  {
    country: 'USA',
    city: 'Los Angeles',
    timeZone: 'America/Los_Angeles',
    region: 'NA',
  },
  {
    country: 'Australia',
    city: 'Perth',
    timeZone: 'Australia/Perth',
    region: 'AU',
  },
  {
    country: 'Australia',
    city: 'Sydney',
    timeZone: 'Australia/Sydney',
    region: 'AU',
  },
  {
    country: 'Australia',
    city: 'Brisbane',
    timeZone: 'Australia/Brisbane',
    region: 'AU',
  },
  {
    country: 'Australia',
    city: 'Darwin',
    timeZone: 'Australia/Darwin',
    region: 'AU',
  },
  {
    country: 'Australia',
    city: 'Canberra',
    timeZone: 'Australia/Canberra',
    region: 'AU',
  },
  {
    country: 'New Zealand',
    city: 'Auckland',
    timeZone: 'Pacific/Auckland',
    region: 'AU',
  },
  {
    country: 'Sweden',
    city: 'Stockholm',
    timeZone: 'Europe/Stockholm',
    region: 'EU',
  },
  {
    country: 'Netherlands',
    city: 'Amsterdam',
    timeZone: 'Europe/Amsterdam',
    region: 'EU',
  },
  {
    country: 'United Kingdom',
    city: 'London',
    timeZone: 'Europe/London',
    region: 'EU',
  },
  {
    country: 'Germany',
    city: 'Berlin',
    timeZone: 'Europe/Berlin',
    region: 'EU',
  },
];

export const CITY_COORDS: Record<string, TCityCoords> = {
  Toronto: { lat: 43.65107, lng: -79.347015 },
  Vancouver: { lat: 49.282729, lng: -123.120738 },
  Halifax: { lat: 44.648764, lng: -63.575239 },
  'New York': { lat: 40.712776, lng: -74.005974 },
  'Los Angeles': { lat: 34.052235, lng: -118.243683 },
  Perth: { lat: -31.952312, lng: 115.861309 },
  Sydney: { lat: -33.86882, lng: 151.209296 },
  Auckland: { lat: -36.848461, lng: 174.763336 },
  Stockholm: { lat: 59.329323, lng: 18.068581 },
  Amsterdam: { lat: 52.367573, lng: 4.904138 },
  London: { lat: 51.507351, lng: -0.127758 },
  Berlin: { lat: 52.520008, lng: 13.404954 },
};

export const NEARBY_TOWNS: TNearbyTownConfig[] = [
  {
    city: 'Toronto',
    nearbyTowns: [
      'Mississauga',
      'Brampton',
      'Oakville',
      'Scarborough',
      'Markham',
    ],
  },
  {
    city: 'Vancouver',
    nearbyTowns: [
      'Burnaby',
      'Richmond',
      'Surrey',
      'Coquitlam',
      'North Vancouver',
    ],
  },
  {
    city: 'Halifax',
    nearbyTowns: [
      'Dartmouth',
      'Bedford',
      'Sackville',
      'Cole Harbour',
    ],
  },
  {
    city: 'New York',
    nearbyTowns: [
      'Jersey City',
      'Brooklyn',
      'Queens',
      'Newark',
      'Hoboken',
    ],
  },
  {
    city: 'Los Angeles',
    nearbyTowns: [
      'Santa Monica',
      'Burbank',
      'Pasadena',
      'Long Beach',
      'Glendale',
    ],
  },
  {
    city: 'Perth',
    nearbyTowns: [
      'Fremantle',
      'Mandurah',
      'Joondalup',
      'Rockingham',
    ],
  },
  {
    city: 'Sydney',
    nearbyTowns: [
      'Parramatta',
      'Bondi',
      'Manly',
      'Newtown',
      'Surry Hills',
    ],
  },
  {
    city: 'Auckland',
    nearbyTowns: [
      'Manukau',
      'Takapuna',
      'Albany',
      'Henderson',
    ],
  },
  {
    city: 'Stockholm',
    nearbyTowns: ['Solna', 'Sundbyberg', 'Nacka', 'Täby'],
  },
  {
    city: 'Amsterdam',
    nearbyTowns: [
      'Haarlem',
      'Zaandam',
      'Amstelveen',
      'Hoofddorp',
    ],
  },
  {
    city: 'London',
    nearbyTowns: [
      'Croydon',
      'Wembley',
      'Harrow',
      'Ilford',
      'Watford',
    ],
  },
  {
    city: 'Berlin',
    nearbyTowns: [
      'Potsdam',
      'Bernau',
      'Oranienburg',
      'Kleinmachnow',
    ],
  },
];

export const GOOGLE_MAPS_API_KEY = import.meta.env
  .VITE_GOOGLE_MAPS_API_KEY as string | undefined;

// Simple map from UTC offset → human timezone name(s)
export const OFFSET_TIMEZONE_NAMES: Record<string, string> =
  {
    '0': 'UTC',
    '1': 'CET / CEST',
    '2': 'EET / EEST',
    '-5': 'EST / EDT',
    '-4': 'AST / ADT',
    '-8': 'PST / PDT',
    '8': 'AWST',
    '10': 'AEST / AEDT',
    '12': 'NZST / NZDT',
  };
