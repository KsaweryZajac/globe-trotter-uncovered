
import axios from 'axios';

export interface HistoricalEvent {
  year: string;
  event: string;
}

export interface Celebrity {
  name: string;
  profession: string;
  description: string;
  image?: string;
}

export interface CulinaryInfo {
  dish: string;
  description: string;
  ingredients?: string[];
  image?: string;
}

interface WikiSearchResult {
  title: string;
  snippet: string;
  pageid: number;
}

/**
 * Country Enrichment API Service
 * 
 * This service provides additional cultural and historical information about countries.
 * It uses Wikipedia's free API to fetch dynamic content without requiring API keys.
 */
const countryEnrichmentApi = {
  /**
   * Get historical events for a country
   */
  async getHistoricalEvents(countryName: string): Promise<HistoricalEvent[]> {
    try {
      // Use Wikipedia API to get historical events
      const response = await axios.get('https://en.wikipedia.org/w/api.php', {
        params: {
          action: 'query',
          list: 'search',
          srsearch: `${countryName} history timeline important events`,
          format: 'json',
          origin: '*',
          srlimit: 8
        }
      });

      // Process the data to create historical events
      return response.data.query.search.map((item: WikiSearchResult) => {
        // Extract year from title or snippet if possible
        const yearMatch = item.title.match(/\b\d{3,4}\b/) || item.snippet.match(/\b\d{3,4}\b/);
        const year = yearMatch ? yearMatch[0] : 'Unknown';
        
        // Clean up the snippet (remove HTML tags)
        const event = item.snippet.replace(/<\/?[^>]+(>|$)/g, '');
        
        return { year, event };
      });
    } catch (error) {
      console.error('Error fetching historical events:', error);
      // Return generic historical events if API fails
      return [
        { year: "Ancient times", event: `Early civilization in ${countryName}` },
        { year: "Middle Ages", event: `Development of feudal systems in ${countryName}` },
        { year: "Modern Era", event: `Formation of modern ${countryName}` }
      ];
    }
  },

  /**
   * Get celebrities from a country
   */
  async getCelebrities(countryName: string): Promise<Celebrity[]> {
    try {
      // Use Wikipedia API to get famous people
      const response = await axios.get('https://en.wikipedia.org/w/api.php', {
        params: {
          action: 'query',
          list: 'search',
          srsearch: `famous people from ${countryName}`,
          format: 'json',
          origin: '*',
          srlimit: 6
        }
      });

      // Process the data to create celebrities
      return response.data.query.search.map((item: WikiSearchResult) => {
        // Extract profession if possible
        const professionMatch = item.snippet.match(/\b(actor|actress|writer|politician|scientist|artist|musician|athlete|singer|director)\b/i);
        const profession = professionMatch ? professionMatch[0] : 'Notable Person';
        
        // Clean up the snippet (remove HTML tags)
        const description = item.snippet.replace(/<\/?[^>]+(>|$)/g, '');
        
        return { 
          name: item.title, 
          profession: profession.charAt(0).toUpperCase() + profession.slice(1), 
          description 
        };
      });
    } catch (error) {
      console.error('Error fetching celebrities:', error);
      
      // Fetch from a different API endpoint as fallback
      try {
        const fallbackResponse = await axios.get('https://en.wikipedia.org/w/api.php', {
          params: {
            action: 'query',
            list: 'search',
            srsearch: `${countryName} celebrities notable people`,
            format: 'json',
            origin: '*',
            srlimit: 5
          }
        });
        
        return fallbackResponse.data.query.search.map((item: WikiSearchResult) => {
          const description = item.snippet.replace(/<\/?[^>]+(>|$)/g, '');
          return { 
            name: item.title, 
            profession: "Notable Person", 
            description 
          };
        });
      } catch (fallbackError) {
        // If both attempts fail, return generic celebrities
        return [
          { name: `Famous Person from ${countryName}`, profession: "Historical Figure", description: `A notable person from ${countryName}'s history` },
          { name: `Contemporary Celebrity from ${countryName}`, profession: "Artist", description: `A well-known artist from ${countryName}` }
        ];
      }
    }
  },

  /**
   * Get culinary information for a country
   */
  async getCulinaryInfo(countryName: string): Promise<CulinaryInfo[]> {
    try {
      // Use Wikipedia API to get culinary information
      const response = await axios.get('https://en.wikipedia.org/w/api.php', {
        params: {
          action: 'query',
          list: 'search',
          srsearch: `${countryName} cuisine traditional food dishes`,
          format: 'json',
          origin: '*',
          srlimit: 5
        }
      });

      // Process the data to create culinary information
      return response.data.query.search.map((item: WikiSearchResult) => {
        // Clean up the snippet (remove HTML tags)
        const description = item.snippet.replace(/<\/?[^>]+(>|$)/g, '');
        
        // Extract potential ingredients from description
        const possibleIngredients = description.match(/\b(chicken|beef|rice|fish|vegetable|potato|tomato|onion|garlic|cheese|egg|flour|sugar|salt|spice|herb)\w*\b/gi);
        const ingredients = possibleIngredients ? [...new Set(possibleIngredients)].slice(0, 5) : undefined;
        
        return { 
          dish: item.title, 
          description: description,
          ingredients
        };
      });
    } catch (error) {
      console.error('Error fetching culinary information:', error);
      
      // Try another search query as fallback
      try {
        const fallbackResponse = await axios.get('https://en.wikipedia.org/w/api.php', {
          params: {
            action: 'query',
            list: 'search',
            srsearch: `${countryName} food popular dishes`,
            format: 'json',
            origin: '*',
            srlimit: 5
          }
        });
        
        return fallbackResponse.data.query.search.map((item: WikiSearchResult) => {
          const description = item.snippet.replace(/<\/?[^>]+(>|$)/g, '');
          return { 
            dish: item.title, 
            description
          };
        });
      } catch (fallbackError) {
        // Return generic culinary information if all attempts fail
        return [
          { dish: `Traditional Dish from ${countryName}`, description: `A popular local dish from ${countryName}` },
          { dish: `Famous Dessert from ${countryName}`, description: `A well-known sweet treat from ${countryName}` }
        ];
      }
    }
  }
};

export default countryEnrichmentApi;
