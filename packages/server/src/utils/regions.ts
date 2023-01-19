export const CURRENTLY_SUPPORTED_REGIONS: RegionData = {
  tx: {
    name: "Texas",
    lat: 31.9686,
    lng: -99.9018,
    cities: ["Austin", "Dallas", "Houston", "San Antonio"],
  },
  ca: {
    name: "California",
    lat: 36.7783,
    lng: -119.4179,
    cities: ["Los Angeles", "San Diego", "San Francisco", "San Jose"],
  },
  fl: {
    name: "Florida",
    lat: 27.6648,
    lng: -81.5158,
    cities: ["Jacksonville", "Miami", "Orlando", "Tampa"],
  },
  ny: {
    name: "New York",
    lat: 42.1497,
    lng: -74.9384,
    cities: ["Buffalo", "New York", "Rochester"],
  },
  il: {
    name: "Illinois",
    lat: 40.6331,
    lng: -89.3985,
    cities: ["Chicago", "Springfield"],
  },
  wa: {
    name: "Washington",
    lat: 47.7511,
    lng: -120.7401,
    cities: ["Seattle"],
  },
};

const states = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
};

export type Region = {
  state: string;
  city: string;
};

type RegionData = {
  [state: string]: {
    name: string;
    lat: number;
    lng: number;
    cities: string[];
  };
};

type FindNearestRegionParams = {
  state?: string;
  city?: string;
};

export const findNearestRegion = ({ city, state }: FindNearestRegionParams): Region | undefined => {
  [city, state] = [city?.toLowerCase(), state?.toLowerCase()];
  if (state && city) {
    const region = CURRENTLY_SUPPORTED_REGIONS[state];
    if (region) {
      if (region.cities.reduce((acc, curr) => acc || curr.toLowerCase() === city, false)) {
        return { state, city };
      }
    }
  }
  return undefined;
};

/**
 * @description Finds the state name or abbreviation from a string
 * @param {string} state State name or abbreviation
 * @returns {string[] | undefined} [state abbreviation, state name] or undefined if not found
 */
export const findStateNameOrAbbreviation = (state: string): string[] => {
  state = state.toLowerCase();
  for (const [key, value] of Object.entries(states)) {
    if (value.toLowerCase() === state || key.toLowerCase() === state) {
      return [key, value];
    }
  }
  return [];
};
