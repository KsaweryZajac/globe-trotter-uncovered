
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
  }
};

export default api;
