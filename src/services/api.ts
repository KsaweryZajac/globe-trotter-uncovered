
import axios from 'axios';

// Define types for our API responses
export interface Country {
  name: {
    common: string;
    official: string;
  };
  capital?: string[];
  population: number;
  flags: {
    png: string;
    svg: string;
    alt?: string;
  };
  languages?: Record<string, string>;
  cca3: string;
}

export interface NewsArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string;
}

export interface Quote {
  _id: string;
  content: string;
  author: string;
  tags: string[];
  authorSlug: string;
  length: number;
  dateAdded: string;
  dateModified: string;
}

// Create API service with error handling
const api = {
  /**
   * Fetch country information by name
   * @param name Country name to search for
   */
  async getCountryByName(name: string): Promise<Country[]> {
    try {
      const response = await axios.get(`https://restcountries.com/v3.1/name/${name}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching country:', error);
      throw new Error('Failed to fetch country information. Please try again.');
    }
  },

  /**
   * Fetch news articles related to a country
   * Note: In a real project, you'd use an environment variable for the API key
   * @param country Country name to get news about
   */
  async getNewsByCountry(country: string): Promise<NewsArticle[]> {
    try {
      // For demo purposes, we'll use a mock response since the actual API requires a key
      // In a real project, you would use: 
      // const response = await axios.get(`https://newsapi.org/v2/everything?q=${country}&apiKey=${import.meta.env.VITE_NEWS_API_KEY}`);
      
      // Mock response for demo purposes
      const mockArticles: NewsArticle[] = [
        {
          source: { id: 'bbc-news', name: 'BBC News' },
          author: 'BBC News',
          title: `Latest developments in ${country}`,
          description: `A comprehensive overview of the current situation in ${country}.`,
          url: 'https://www.bbc.com/news',
          urlToImage: 'https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?w=800&auto=format&fit=crop',
          publishedAt: new Date().toISOString(),
          content: `Learn about the latest developments in ${country}'s economy, politics, and culture.`
        },
        {
          source: { id: 'cnn', name: 'CNN' },
          author: 'CNN Reporter',
          title: `Cultural heritage of ${country} celebrated at international festival`,
          description: `${country}'s cultural heritage was showcased at an international festival this week.`,
          url: 'https://www.cnn.com',
          urlToImage: 'https://images.unsplash.com/photo-1493606278519-11aa9f86e40a?w=800&auto=format&fit=crop',
          publishedAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
          content: `The festival included traditional music, dance, and cuisine from ${country}.`
        },
        {
          source: { id: 'reuters', name: 'Reuters' },
          author: 'Reuters Staff',
          title: `${country} announces new environmental initiatives`,
          description: `Government officials in ${country} have announced new environmental protection measures.`,
          url: 'https://www.reuters.com',
          urlToImage: 'https://images.unsplash.com/photo-1552799446-159ba9523315?w=800&auto=format&fit=crop',
          publishedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          content: `The new initiatives aim to reduce carbon emissions and protect natural resources in ${country}.`
        }
      ];
      
      return mockArticles;
      
      // In a real implementation with an API key:
      // return response.data.articles;
    } catch (error) {
      console.error('Error fetching news:', error);
      throw new Error('Failed to fetch news articles. Please try again.');
    }
  },

  /**
   * Fetch a random inspirational quote
   */
  async getRandomQuote(): Promise<Quote> {
    try {
      const response = await axios.get('https://api.quotable.io/random');
      return response.data;
    } catch (error) {
      console.error('Error fetching quote:', error);
      throw new Error('Failed to fetch inspirational quote. Please try again.');
    }
  }
};

export default api;
