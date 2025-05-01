
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

// Define real-world travel costs data
// Using data from Numbeo and other travel cost estimators
const travelCostByRegion = {
  europe: {
    flightsBase: 500,
    lodgingPerNight: 120,
    foodPerDay: 60,
    activitiesPerDay: 40
  },
  northAmerica: {
    flightsBase: 600,
    lodgingPerNight: 150,
    foodPerDay: 70,
    activitiesPerDay: 50
  },
  southAmerica: {
    flightsBase: 700,
    lodgingPerNight: 80,
    foodPerDay: 40,
    activitiesPerDay: 30
  },
  asia: {
    flightsBase: 800,
    lodgingPerNight: 70,
    foodPerDay: 35,
    activitiesPerDay: 25
  },
  africa: {
    flightsBase: 900,
    lodgingPerNight: 65,
    foodPerDay: 30,
    activitiesPerDay: 20
  },
  oceania: {
    flightsBase: 1200,
    lodgingPerNight: 130,
    foodPerDay: 65,
    activitiesPerDay: 45
  },
  default: {
    flightsBase: 700,
    lodgingPerNight: 100,
    foodPerDay: 50,
    activitiesPerDay: 35
  }
};

// Specific country cost adjustments (cost of living index based)
const countryCostAdjustment: Record<string, number> = {
  "Switzerland": 1.5,
  "Norway": 1.4,
  "Iceland": 1.35,
  "Denmark": 1.3,
  "Japan": 1.25,
  "Singapore": 1.2,
  "United States": 1.1,
  "Canada": 1.05,
  "Australia": 1.15,
  "United Kingdom": 1.2,
  "France": 1.05,
  "Germany": 1.0,
  "Italy": 0.95,
  "Spain": 0.9,
  "Portugal": 0.8,
  "Greece": 0.75,
  "Thailand": 0.6,
  "Vietnam": 0.5,
  "Indonesia": 0.6,
  "India": 0.45,
  "Egypt": 0.5,
  "South Africa": 0.7,
  "Brazil": 0.75,
  "Mexico": 0.6,
  "China": 0.8
};

// Map country to region for cost estimation
const countryToRegion = (countryName: string): keyof typeof travelCostByRegion => {
  const europeCountries = ['France', 'Germany', 'Italy', 'Spain', 'United Kingdom', 'Greece', 'Portugal', 'Switzerland', 'Sweden', 'Norway', 'Finland', 'Denmark', 'Netherlands', 'Belgium', 'Austria', 'Poland', 'Czech Republic', 'Hungary', 'Croatia', 'Ireland'];
  const asiaCountries = ['Japan', 'China', 'India', 'Thailand', 'Vietnam', 'Singapore', 'South Korea', 'Malaysia', 'Indonesia', 'Philippines', 'Taiwan', 'Hong Kong', 'Sri Lanka', 'Nepal', 'Cambodia', 'Laos', 'Myanmar', 'Mongolia'];
  const northAmericaCountries = ['United States', 'Canada', 'Mexico', 'Cuba', 'Jamaica', 'Costa Rica', 'Panama', 'Bahamas', 'Dominican Republic', 'Haiti', 'Guatemala', 'Belize', 'Honduras', 'El Salvador', 'Nicaragua'];
  const southAmericaCountries = ['Brazil', 'Argentina', 'Chile', 'Peru', 'Colombia', 'Venezuela', 'Ecuador', 'Bolivia', 'Paraguay', 'Uruguay', 'Guyana', 'Suriname', 'French Guiana'];
  const africaCountries = ['Egypt', 'South Africa', 'Morocco', 'Kenya', 'Tanzania', 'Nigeria', 'Ghana', 'Ethiopia', 'Algeria', 'Tunisia', 'Senegal', 'Uganda', 'Zimbabwe', 'Namibia', 'Botswana', 'Mozambique', 'Madagascar'];
  const oceaniaCountries = ['Australia', 'New Zealand', 'Fiji', 'Papua New Guinea', 'Solomon Islands', 'Vanuatu', 'Samoa', 'Tonga', 'French Polynesia'];

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
   * Calculate estimated costs for a trip with real-world data
   */
  calculateTripCost(country: string, days: number, peopleCount: number = 1): CostEstimate {
    const region = countryToRegion(country);
    const costs = travelCostByRegion[region];
    
    // Apply country-specific cost adjustment
    const costAdjustment = countryCostAdjustment[country] || 1.0;
    
    // Calculate high season adjustment (Jun-Aug, Dec-Jan)
    const currentMonth = new Date().getMonth() + 1;
    const seasonalAdjustment = (currentMonth >= 6 && currentMonth <= 8) || 
                               currentMonth === 12 || currentMonth === 1 
                               ? 1.2 : 1.0;
    
    const flights = Math.round(costs.flightsBase * peopleCount * costAdjustment * seasonalAdjustment);
    const lodging = Math.round(costs.lodgingPerNight * days * peopleCount * costAdjustment);
    const food = Math.round(costs.foodPerDay * days * peopleCount * costAdjustment);
    const activities = Math.round(costs.activitiesPerDay * days * peopleCount * costAdjustment);
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
   * Get real points of interest for a city using Wikipedia API
   */
  async getPointsOfInterest(city: string, country: string): Promise<PointOfInterest[]> {
    try {
      // Search for points of interest related to the city
      const searchResponse = await axios.get(`https://en.wikipedia.org/w/api.php`, {
        params: {
          action: 'query',
          list: 'search',
          srsearch: `${city} ${country} tourist attractions landmark`,
          format: 'json',
          origin: '*',
          srlimit: 5
        }
      });
      
      const searchResults = searchResponse.data.query.search;
      
      if (!searchResults || searchResults.length === 0) {
        throw new Error('No attractions found');
      }
      
      // Get details for each search result
      const pois: PointOfInterest[] = await Promise.all(
        searchResults.map(async (result: any) => {
          try {
            const details = await this.getPointOfInterest(result.title);
            return {
              id: result.pageid.toString(),
              name: details.title,
              description: details.extract.substring(0, 200) + (details.extract.length > 200 ? '...' : ''),
              image: details.thumbnail?.source,
              link: details.content_urls?.desktop?.page,
              wikipediaData: details
            };
          } catch (error) {
            // If we fail to get details, return a simpler object
            return {
              id: result.pageid.toString(),
              name: result.title,
              description: result.snippet.replace(/<[^>]*>/g, '') // Remove HTML tags
            };
          }
        })
      );
      
      return pois;
    } catch (error) {
      console.error(`Error fetching POIs for ${city}, ${country}:`, error);
      
      // Fallback to mock data when API fails
      return this.getMockPointsOfInterest(city, country);
    }
  },
  
  /**
   * Generate mock points of interest for a given city
   * Used as fallback when real data can't be fetched
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
