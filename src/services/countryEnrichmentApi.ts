
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

const countryCulinaryData: Record<string, CulinaryInfo[]> = {
  "France": [
    { 
      dish: "Coq au Vin", 
      description: "A classic French dish of chicken braised with wine, lardons, mushrooms, and garlic.",
      ingredients: ["Chicken", "Red wine", "Bacon", "Mushrooms", "Pearl onions"]
    },
    { 
      dish: "Boeuf Bourguignon", 
      description: "A beef stew braised in red wine, often red Burgundy, and beef stock, flavored with carrots, onions, garlic, and bouquet garni.",
      ingredients: ["Beef", "Red wine", "Carrots", "Onions", "Garlic"]
    },
    { 
      dish: "Crème Brûlée", 
      description: "A rich custard base topped with a layer of hardened caramelized sugar.",
      ingredients: ["Cream", "Vanilla", "Sugar", "Egg yolks"]
    }
  ],
  "Italy": [
    { 
      dish: "Pasta Carbonara", 
      description: "An Italian pasta dish made with eggs, cheese, cured pork, and black pepper.",
      ingredients: ["Spaghetti", "Eggs", "Pecorino Romano", "Guanciale", "Black pepper"]
    },
    { 
      dish: "Risotto alla Milanese", 
      description: "A creamy rice dish cooked with beef stock and saffron.",
      ingredients: ["Arborio rice", "Beef stock", "Saffron", "Onions", "Parmesan cheese"]
    },
    { 
      dish: "Tiramisu", 
      description: "A coffee-flavoured Italian dessert made of ladyfingers dipped in coffee, layered with a whipped mixture of eggs, sugar, and mascarpone cheese.",
      ingredients: ["Ladyfingers", "Coffee", "Eggs", "Sugar", "Mascarpone"]
    }
  ],
  "Japan": [
    { 
      dish: "Sushi", 
      description: "A Japanese dish of vinegared rice prepared with various ingredients, usually including seafood and vegetables.",
      ingredients: ["Rice", "Vinegar", "Nori", "Fish", "Vegetables"]
    },
    { 
      dish: "Ramen", 
      description: "A Japanese noodle soup dish with Chinese-style wheat noodles served in a meat or fish-based broth.",
      ingredients: ["Noodles", "Broth", "Meat", "Green onions", "Bamboo shoots"]
    },
    { 
      dish: "Tempura", 
      description: "A Japanese dish of battered and deep-fried seafood and vegetables.",
      ingredients: ["Shrimp", "Vegetables", "Flour", "Eggs", "Ice water"]
    }
  ]
};

const countryHistoricalData: Record<string, HistoricalEvent[]> = {
  "United States": [
    { year: "1776", event: "Declaration of Independence" },
    { year: "1865", event: "End of Civil War and Abolishment of Slavery" },
    { year: "1945", event: "End of World War II" },
    { year: "1969", event: "First Moon Landing" }
  ],
  "United Kingdom": [
    { year: "1066", event: "Norman Conquest of England" },
    { year: "1215", event: "Magna Carta Signed" },
    { year: "1666", event: "Great Fire of London" },
    { year: "1945", event: "End of World War II" }
  ],
  "China": [
    { year: "221 BC", event: "Qin Dynasty Unifies China" },
    { year: "1271", event: "Founding of Yuan Dynasty by Kublai Khan" },
    { year: "1912", event: "End of Imperial Rule" },
    { year: "1949", event: "Foundation of People's Republic of China" }
  ]
};

const countryCelebrityData: Record<string, Celebrity[]> = {
  "United Kingdom": [
    { name: "William Shakespeare", profession: "Playwright", description: "Considered the greatest writer in the English language." },
    { name: "Queen Elizabeth II", profession: "Monarch", description: "The longest-reigning current monarch and the longest-serving female head of state." },
    { name: "Sir Isaac Newton", profession: "Scientist", description: "Mathematician, physicist, and one of the most influential scientists of all time." }
  ],
  "United States": [
    { name: "Martin Luther King Jr.", profession: "Civil Rights Leader", description: "American minister and activist who became the most visible spokesperson and leader in the civil rights movement." },
    { name: "Oprah Winfrey", profession: "Media Executive", description: "Talk show host, television producer, actress, author, and philanthropist." },
    { name: "Steve Jobs", profession: "Entrepreneur", description: "Co-founder of Apple Inc. and a pioneer of the personal computer revolution." }
  ],
  "India": [
    { name: "Mahatma Gandhi", profession: "Freedom Fighter", description: "Leader of the Indian independence movement against British rule." },
    { name: "Amitabh Bachchan", profession: "Actor", description: "One of the greatest and most influential actors in the history of Indian cinema." },
    { name: "Mother Teresa", profession: "Humanitarian", description: "Catholic nun and missionary who founded the Missionaries of Charity." }
  ]
};

const countryEnrichmentApi = {
  /**
   * Get historical events for a country
   */
  async getHistoricalEvents(countryName: string): Promise<HistoricalEvent[]> {
    try {
      // First check if we have predefined data
      if (countryHistoricalData[countryName]) {
        return countryHistoricalData[countryName];
      }

      // Use Wikipedia API to get historical events
      const response = await axios.get('https://en.wikipedia.org/w/api.php', {
        params: {
          action: 'query',
          list: 'search',
          srsearch: `${countryName} history timeline important events`,
          format: 'json',
          origin: '*',
          srlimit: 5
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
      // Return generic historical events
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
      // First check if we have predefined data
      if (countryCelebrityData[countryName]) {
        return countryCelebrityData[countryName];
      }

      // Use Wikipedia API to get famous people
      const response = await axios.get('https://en.wikipedia.org/w/api.php', {
        params: {
          action: 'query',
          list: 'search',
          srsearch: `famous people from ${countryName}`,
          format: 'json',
          origin: '*',
          srlimit: 5
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
      // Return generic celebrities
      return [
        { name: `Famous Person from ${countryName}`, profession: "Historical Figure", description: `A notable person from ${countryName}'s history` },
        { name: `Contemporary Celebrity from ${countryName}`, profession: "Artist", description: `A well-known artist from ${countryName}` }
      ];
    }
  },

  /**
   * Get culinary information for a country
   */
  async getCulinaryInfo(countryName: string): Promise<CulinaryInfo[]> {
    try {
      // First check if we have predefined data
      if (countryCulinaryData[countryName]) {
        return countryCulinaryData[countryName];
      }

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
        
        return { 
          dish: item.title, 
          description: description
        };
      });
    } catch (error) {
      console.error('Error fetching culinary information:', error);
      // Return generic culinary information
      return [
        { dish: `Traditional Dish from ${countryName}`, description: `A popular local dish from ${countryName}` },
        { dish: `Famous Dessert from ${countryName}`, description: `A well-known sweet treat from ${countryName}` }
      ];
    }
  }
};

export default countryEnrichmentApi;
