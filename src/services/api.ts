
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
  latlng?: number[];
}

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

// Mock translations for demo purposes
const mockTranslations: Record<string, Record<string, string>> = {
  "Spain": {
    "es": "España",
    "fr": "Espagne",
    "de": "Spanien",
    "it": "Spagna",
    "pt": "Espanha",
    "ru": "Испания",
    "zh": "西班牙",
    "ja": "スペイン",
    "ar": "إسبانيا",
    "hi": "स्पेन"
  },
  "France": {
    "es": "Francia",
    "fr": "France",
    "de": "Frankreich",
    "it": "Francia",
    "pt": "França",
    "ru": "Франция",
    "zh": "法国",
    "ja": "フランス",
    "ar": "فرنسا",
    "hi": "फ्रांस"
  },
  "Germany": {
    "es": "Alemania",
    "fr": "Allemagne",
    "de": "Deutschland",
    "it": "Germania",
    "pt": "Alemanha",
    "ru": "Германия",
    "zh": "德国",
    "ja": "ドイツ",
    "ar": "ألمانيا",
    "hi": "जर्मनी"
  },
  "United States": {
    "es": "Estados Unidos",
    "fr": "États-Unis",
    "de": "Vereinigte Staaten",
    "it": "Stati Uniti",
    "pt": "Estados Unidos",
    "ru": "Соединенные Штаты",
    "zh": "美国",
    "ja": "米国",
    "ar": "الولايات المتحدة",
    "hi": "संयुक्त राज्य अमेरिका"
  }
};

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
    return [
      {
        title: `Latest news about ${countryName}`,
        description: `This is a mock news article about ${countryName}`,
        url: '#',
        source: { name: 'Mock News' },
        publishedAt: new Date().toISOString()
      }
    ];
  },
  
  getWeatherForCity: async (cityName: string): Promise<Weather | null> => {
    console.log(`Stub method called: getWeatherForCity for ${cityName}`);
    return {
      current_condition: [
        {
          temp_C: '25',
          humidity: '70',
          weatherDesc: [{ value: 'Sunny' }]
        }
      ],
      weather: [
        {
          avgtempC: '25',
          hourly: [
            {
              weatherDesc: [{ value: 'Sunny' }]
            }
          ]
        }
      ]
    };
  },
  
  translateText: async (text: string, target: string): Promise<string> => {
    console.log(`Translating: "${text}" to ${target}`);
    
    // Use mock translations if available, otherwise return a mock translation
    if (mockTranslations[text]?.[target]) {
      return mockTranslations[text][target];
    }
    
    // Generate a mock translation
    const translations: Record<string, (t: string) => string> = {
      es: (t) => `${t} (Spanish)`,
      fr: (t) => `${t} (French)`,
      de: (t) => `${t} (German)`,
      it: (t) => `${t} (Italian)`,
      pt: (t) => `${t} (Portuguese)`,
      ru: (t) => `${t} (Russian)`,
      zh: (t) => `${t} (Chinese)`,
      ja: (t) => `${t} (Japanese)`,
      ar: (t) => `${t} (Arabic)`,
      hi: (t) => `${t} (Hindi)`,
    };
    
    return translations[target] ? translations[target](text) : text;
  },
  
  getCountryByName: async (name: string): Promise<Country | null> => {
    const countries = await api.searchCountries(name);
    return countries.length > 0 ? countries[0] : null;
  },
  
  getRandomCountry: async (): Promise<Country | null> => {
    const countries = await api.getAllCountries();
    if (countries.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * countries.length);
    return countries[randomIndex];
  }
};

export default api;
