
import axios from 'axios';

// Define types
export interface Country {
  name: {
    common: string;
    official: string;
    nativeName?: Record<string, { official: string; common: string }>;
  };
  cca2: string;
  cca3: string;
  capital?: string[];
  region: string;
  subregion?: string;
  languages?: Record<string, string>;
  currencies?: Record<string, { name: string; symbol: string }>;
  population: number;
  area?: number;
  flags: {
    png: string;
    svg: string;
    alt?: string;
  };
  latlng?: number[];  // Add this for country coordinates
}

// Add missing types that were referenced in the error messages
export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  source: {
    name: string;
  };
  publishedAt: string;
  urlToImage?: string;
}

export interface Weather {
  current_condition: Array<{
    temp_C: string;
    humidity: string;
    weatherDesc: Array<{ value: string }>;
  }>;
  weather?: Array<{
    date?: string;
    avgtempC: string;
    hourly: Array<{
      weatherDesc: Array<{ value: string }>;
    }>;
  }>;
}

// API client
const api = {
  // Get all countries
  getAllCountries: async (): Promise<Country[]> => {
    try {
      const response = await axios.get('https://restcountries.com/v3.1/all');
      return response.data;
    } catch (error) {
      console.error('Error fetching all countries:', error);
      return [];
    }
  },

  // Search countries by name
  searchCountries: async (name: string): Promise<Country[]> => {
    try {
      const response = await axios.get(`https://restcountries.com/v3.1/name/${encodeURIComponent(name)}`);
      return response.data;
    } catch (error) {
      console.error(`Error searching for country ${name}:`, error);
      return [];
    }
  },

  // Get country by code
  getCountryByCode: async (code: string): Promise<Country | null> => {
    try {
      const response = await axios.get(`https://restcountries.com/v3.1/alpha/${encodeURIComponent(code)}`);
      return response.data[0] || null;
    } catch (error) {
      console.error(`Error fetching country ${code}:`, error);
      return null;
    }
  },

  // Get countries by region
  getCountriesByRegion: async (region: string): Promise<Country[]> => {
    try {
      const response = await axios.get(`https://restcountries.com/v3.1/region/${encodeURIComponent(region)}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching countries in region ${region}:`, error);
      return [];
    }
  },
  
  // Adding stub methods for the missing functions
  getNewsByCountry: async (countryName: string): Promise<NewsArticle[]> => {
    console.log(`Stub method called: getNewsByCountry for ${countryName}`);
    return [];
  },
  
  getWeatherForCity: async (cityName: string): Promise<Weather | null> => {
    console.log(`Stub method called: getWeatherForCity for ${cityName}`);
    return null;
  },
  
  translateText: async (text: string, target: string): Promise<string> => {
    console.log(`Stub method called: translateText for ${text} to ${target}`);
    return text;
  },
  
  getCountryByName: async (name: string): Promise<Country | null> => {
    return api.searchCountries(name).then(countries => countries[0] || null);
  },
  
  getRandomCountry: async (): Promise<Country | null> => {
    return api.getAllCountries().then(countries => {
      if (countries.length === 0) return null;
      const randomIndex = Math.floor(Math.random() * countries.length);
      return countries[randomIndex];
    });
  }
};

export default api;
