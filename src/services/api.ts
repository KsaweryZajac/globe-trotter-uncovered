export interface Country {
  name: {
    common: string;
    official: string;
  };
  cca2: string;
  cca3: string;
  currencies: {
    [key: string]: {
      name: string;
      symbol: string;
    };
  };
  capital: string[];
  region: string;
  subregion: string;
  languages: {
    [key: string]: string;
  };
  population: number;
  flags: {
    svg: string;
    png: string;
  };
  latlng: number[];
  borders?: string[];
}

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
  source: {
    name: string;
  };
}

export interface Weather {
  location: {
    name: string;
    country: string;
  };
  current: {
    temp_c: number;
    condition: {
      text: string;
      icon: string;
    };
    wind_kph: number;
    humidity: number;
  };
}

const getAllCountries = async (): Promise<Country[]> => {
  const response = await fetch('https://restcountries.com/v3.1/all');
  const data = await response.json();
  return data;
};

const getCountryByName = async (name: string): Promise<Country | null> => {
  try {
    const response = await fetch(`https://restcountries.com/v3.1/name/${name}?fullText=true`);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data[0];
  } catch (error) {
    console.error("Error fetching country:", error);
    return null;
  }
};

const getRandomCountry = async (): Promise<Country | null> => {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all');
    const data = await response.json();
    const randomIndex = Math.floor(Math.random() * data.length);
    return data[randomIndex];
  } catch (error) {
    console.error("Error fetching random country:", error);
    return null;
  }
};

const getNewsByCountry = async (countryName: string): Promise<NewsArticle[]> => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;
    const response = await fetch(`https://newsapi.org/v2/everything?q=${countryName}&apiKey=${apiKey}`);
    const data = await response.json();
    return data.articles;
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
};

const getWeatherForCity = async (city: string): Promise<Weather | null> => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
    const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`);
    if (!response.ok) {
      console.error("Error fetching weather:", response.statusText);
      return null;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching weather:", error);
    return null;
  }
};

const translateText = async (text: string, targetLang: string): Promise<string | null> => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_TRANSLATE_API_KEY;
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        target: targetLang
      }),
    });

    if (!response.ok) {
      console.error("Error translating text:", response.statusText);
      return null;
    }

    const data = await response.json();
    return data.data.translations[0].translatedText;
  } catch (error) {
    console.error("Error translating text:", error);
    return null;
  }
};

// Add this function to the api object
const searchCountries = async (query: string): Promise<Country[]> => {
  try {
    // Filter countries that match the query
    const response = await fetch(`https://restcountries.com/v3.1/name/${query}`);
    
    if (!response.ok) {
      // If no exact matches, return empty array
      return [];
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error searching countries:", error);
    return [];
  }
};

const api = {
  getAllCountries,
  getCountryByName,
  getRandomCountry,
  getNewsByCountry,
  getWeatherForCity,
  translateText,
  searchCountries,
};

export default api;
