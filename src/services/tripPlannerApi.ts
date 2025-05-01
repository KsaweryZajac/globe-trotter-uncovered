
import axios from 'axios';

// Define types for Wikipedia API responses
export interface WikipediaResponse {
  title: string;
  extract: string;
  extract_html: string;
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
  content_urls: {
    desktop: {
      page: string;
    };
  };
}

// Define types for Point of Interest
export interface PointOfInterest {
  id: string;
  name: string;
  description: string;
  image?: string;
  link?: string;
  location?: {
    lat: number;
    lng: number;
  };
  wikipediaData?: WikipediaResponse;
}

// Define Cost Estimation types
export interface CostEstimate {
  flights: number;
  lodging: number;
  food: number;
  activities: number;
  total: number;
  currency: string;
}

// Define mock travel costs data
const travelCostByRegion = {
  europe: {
    flightsBase: 400,
    lodgingPerNight: 100,
    foodPerDay: 50,
    activitiesPerDay: 30
  },
  northAmerica: {
    flightsBase: 500,
    lodgingPerNight: 120,
    foodPerDay: 60,
    activitiesPerDay: 40
  },
  southAmerica: {
    flightsBase: 600,
    lodgingPerNight: 80,
    foodPerDay: 40,
    activitiesPerDay: 25
  },
  asia: {
    flightsBase: 800,
    lodgingPerNight: 70,
    foodPerDay: 30,
    activitiesPerDay: 20
  },
  africa: {
    flightsBase: 700,
    lodgingPerNight: 60,
    foodPerDay: 25,
    activitiesPerDay: 15
  },
  oceania: {
    flightsBase: 900,
    lodgingPerNight: 110,
    foodPerDay: 55,
    activitiesPerDay: 35
  },
  default: {
    flightsBase: 600,
    lodgingPerNight: 100,
    foodPerDay: 50,
    activitiesPerDay: 30
  }
};

// Map country to region for cost estimation
const countryToRegion = (countryName: string): keyof typeof travelCostByRegion => {
  const europeCountries = ['France', 'Germany', 'Italy', 'Spain', 'United Kingdom', 'Greece', 'Portugal', 'Switzerland', 'Sweden', 'Norway'];
  const asiaCountries = ['Japan', 'China', 'India', 'Thailand', 'Vietnam', 'Singapore', 'South Korea', 'Malaysia', 'Indonesia', 'Philippines'];
  const northAmericaCountries = ['United States', 'Canada', 'Mexico', 'Cuba', 'Jamaica', 'Costa Rica', 'Panama'];
  const southAmericaCountries = ['Brazil', 'Argentina', 'Chile', 'Peru', 'Colombia', 'Venezuela', 'Ecuador'];
  const africaCountries = ['Egypt', 'South Africa', 'Morocco', 'Kenya', 'Tanzania', 'Nigeria', 'Ghana', 'Ethiopia'];
  const oceaniaCountries = ['Australia', 'New Zealand', 'Fiji', 'Papua New Guinea', 'Solomon Islands'];

  if (europeCountries.some(country => countryName.includes(country))) return 'europe';
  if (asiaCountries.some(country => countryName.includes(country))) return 'asia';
  if (northAmericaCountries.some(country => countryName.includes(country))) return 'northAmerica';
  if (southAmericaCountries.some(country => countryName.includes(country))) return 'southAmerica';
  if (africaCountries.some(country => countryName.includes(country))) return 'africa';
  if (oceaniaCountries.some(country => countryName.includes(country))) return 'oceania';

  return 'default';
};

// Trip Planner API Service
const tripPlannerApi = {
  /**
   * Fetch Wikipedia information about a point of interest
   */
  async getPointOfInterest(title: string): Promise<WikipediaResponse> {
    try {
      const response = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching Wikipedia data:', error);
      throw new Error('Failed to fetch information about this point of interest.');
    }
  },

  /**
   * Calculate estimated costs for a trip
   */
  calculateTripCost(country: string, days: number, peopleCount: number = 1): CostEstimate {
    const region = countryToRegion(country);
    const costs = travelCostByRegion[region];
    
    const flights = costs.flightsBase * peopleCount;
    const lodging = costs.lodgingPerNight * days * peopleCount;
    const food = costs.foodPerDay * days * peopleCount;
    const activities = costs.activitiesPerDay * days * peopleCount;
    const total = flights + lodging + food + activities;
    
    return {
      flights,
      lodging,
      food,
      activities,
      total,
      currency: 'USD'
    };
  },
  
  /**
   * Generate mock points of interest for a given city
   */
  getMockPointsOfInterest(city: string, country: string): PointOfInterest[] {
    // This is a mock function that returns some predefined POIs based on city/country
    const mockPOIs: Record<string, PointOfInterest[]> = {
      'Paris': [
        { id: 'eiffel-tower', name: 'Eiffel Tower', description: 'Iconic iron tower on the Champ de Mars', location: { lat: 48.8584, lng: 2.2945 } },
        { id: 'louvre-museum', name: 'The Louvre', description: 'World\'s largest art museum and historic monument', location: { lat: 48.8606, lng: 2.3376 } },
        { id: 'notre-dame', name: 'Notre-Dame Cathedral', description: 'Medieval Catholic cathedral', location: { lat: 48.8530, lng: 2.3499 } }
      ],
      'London': [
        { id: 'big-ben', name: 'Big Ben', description: 'Great bell of the striking clock at the Palace of Westminster', location: { lat: 51.5007, lng: -0.1246 } },
        { id: 'london-eye', name: 'London Eye', description: 'Giant Ferris wheel on the South Bank of the Thames', location: { lat: 51.5033, lng: -0.1195 } },
        { id: 'tower-bridge', name: 'Tower Bridge', description: 'Combined bascule and suspension bridge crossing the River Thames', location: { lat: 51.5055, lng: -0.0754 } }
      ],
      'Tokyo': [
        { id: 'tokyo-skytree', name: 'Tokyo Skytree', description: 'Broadcasting and observation tower', location: { lat: 35.7101, lng: 139.8107 } },
        { id: 'meiji-jingu', name: 'Meiji Shrine', description: 'Shinto shrine dedicated to Emperor Meiji and Empress Shōken', location: { lat: 35.6763, lng: 139.6993 } },
        { id: 'senso-ji', name: 'Sensō-ji', description: 'Ancient Buddhist temple', location: { lat: 35.7147, lng: 139.7966 } }
      ],
      'New York': [
        { id: 'statue-of-liberty', name: 'Statue of Liberty', description: 'Neoclassical sculpture on Liberty Island', location: { lat: 40.6892, lng: -74.0445 } },
        { id: 'empire-state', name: 'Empire State Building', description: 'Art Deco skyscraper in Midtown Manhattan', location: { lat: 40.7484, lng: -73.9857 } },
        { id: 'times-square', name: 'Times Square', description: 'Major commercial intersection and neighborhood', location: { lat: 40.7580, lng: -73.9855 } }
      ]
    };
    
    // Return city POIs if available, otherwise create generic ones
    const cityPOIs = mockPOIs[city];
    if (cityPOIs) {
      return cityPOIs;
    }
    
    // Generate generic POIs for cities we don't have mock data for
    return [
      { id: `${city.toLowerCase()}-landmark-1`, name: `${city} Main Landmark`, description: `The most famous landmark in ${city}`, location: { lat: 0, lng: 0 } },
      { id: `${city.toLowerCase()}-museum`, name: `${city} National Museum`, description: `The national museum of ${country}`, location: { lat: 0, lng: 0 } },
      { id: `${city.toLowerCase()}-park`, name: `${city} Central Park`, description: `The main park in ${city}`, location: { lat: 0, lng: 0 } }
    ];
  }
};

export default tripPlannerApi;
