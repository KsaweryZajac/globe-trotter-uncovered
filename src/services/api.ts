
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
  
  // Real news API implementation
  getNewsByCountry: async (countryName: string): Promise<NewsArticle[]> => {
    try {
      // Using NewsAPI.org or a similar service (free tier with limitations)
      const response = await axios.get(`https://newsapi.org/v2/everything`, {
        params: {
          q: countryName,
          sortBy: 'publishedAt',
          language: 'en',
          pageSize: 5,
          apiKey: process.env.VITE_NEWS_API_KEY || 'demo-key' // Use environment variable
        }
      });
      
      // Handle response based on NewsAPI structure
      if (response.data.status === 'ok') {
        return response.data.articles.map((article: any) => ({
          title: article.title || `News about ${countryName}`,
          description: article.description || 'No description available',
          url: article.url || '#',
          source: { name: article.source?.name || 'News Source' },
          publishedAt: article.publishedAt || new Date().toISOString(),
          urlToImage: article.urlToImage
        }));
      } else {
        throw new Error(response.data.message || 'Failed to fetch news');
      }
    } catch (error) {
      console.error(`Error fetching news for ${countryName}:`, error);
      
      // Fallback to mock data when API fails or limits are reached
      return [
        {
          title: `Latest developments in ${countryName}`,
          description: `This is a fallback news article about ${countryName} when the API is unavailable.`,
          url: '#',
          source: { name: 'Fallback News' },
          publishedAt: new Date().toISOString()
        },
        {
          title: `Economic updates for ${countryName}`,
          description: `Economic situation and forecasts for ${countryName}.`,
          url: '#',
          source: { name: 'Fallback News' },
          publishedAt: new Date().toISOString()
        }
      ];
    }
  },
  
  // Real weather API implementation
  getWeatherForCity: async (cityName: string): Promise<Weather | null> => {
    try {
      // Using a free weather API - wttr.in which doesn't require API key
      const response = await axios.get(`https://wttr.in/${encodeURIComponent(cityName)}?format=j1`);
      
      // Transform the response to match our Weather interface
      return {
        current_condition: response.data.current_condition,
        weather: response.data.weather
      };
    } catch (error) {
      console.error(`Error fetching weather for ${cityName}:`, error);
      
      // Fallback to mock data
      return {
        current_condition: [
          {
            temp_C: '25',
            humidity: '70',
            weatherDesc: [{ value: 'Partly Cloudy' }]
          }
        ],
        weather: [
          {
            avgtempC: '25',
            hourly: [
              {
                weatherDesc: [{ value: 'Partly Cloudy' }]
              }
            ]
          }
        ]
      };
    }
  },
  
  // Improved translation service using MyMemory API (free tier)
  translateText: async (text: string, target: string): Promise<string> => {
    try {
      // Using MyMemory Translation API which has a free tier
      const response = await axios.get('https://api.mymemory.translated.net/get', {
        params: {
          q: text,
          langpair: `en|${target}`
        }
      });
      
      if (response.data.responseStatus === 200 && response.data.responseData?.translatedText) {
        return response.data.responseData.translatedText;
      }
      
      // Fallback to mock translations if API fails
      throw new Error('Translation API response invalid');
    } catch (error) {
      console.error(`Error translating text to ${target}:`, error);
      
      // Use mock translations if available
      if (mockTranslations[text]?.[target]) {
        return mockTranslations[text][target];
      }
      
      // Generate a fallback translation
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
    }
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
