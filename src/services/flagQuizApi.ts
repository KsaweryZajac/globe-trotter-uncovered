
import api from './api';
import { Country } from './api';

export type DifficultyLevel = 'beginner' | 'easy' | 'medium' | 'hard';

export interface QuizQuestion {
  correctCountry: Country;
  options: Country[];
}

export interface QuizResult {
  playerName: string;
  score: number;
  maxScore: number;
  timeInSeconds: number;
  date: string;
  difficulty: DifficultyLevel;
}

// List of common/well-known countries for beginner level
const commonCountries = [
  'United States', 'Canada', 'Mexico', 'Brazil', 'United Kingdom', 
  'France', 'Germany', 'Italy', 'Spain', 'Russia', 'China', 
  'Japan', 'India', 'Australia', 'Egypt', 'South Africa'
];

// List of moderately known countries for easy level
const moderateCountries = [
  ...commonCountries,
  'Argentina', 'Sweden', 'Norway', 'Finland', 'Denmark', 
  'Netherlands', 'Belgium', 'Switzerland', 'Austria', 'Greece', 
  'Turkey', 'Thailand', 'Vietnam', 'South Korea', 'New Zealand'
];

// Countries with similar flags that often confuse people for hard level
const confusingFlags = [
  'Chad', 'Romania', 'Indonesia', 'Monaco', 'Poland', 'Ukraine', 
  'Lithuania', 'Colombia', 'Venezuela', 'Ecuador', 'Slovenia', 
  'Slovakia', 'Russia', 'Serbia', 'Bulgaria', 'Hungary', 'Iran', 'Italy',
  'Ireland', 'Ivory Coast', 'Mali', 'Senegal', 'Guinea'
];

const generateQuiz = async (numQuestions: number = 10, difficulty: DifficultyLevel = 'easy'): Promise<QuizQuestion[]> => {
  try {
    // Fetch all countries first
    const allCountries = await api.getAllCountries();
    
    if (!allCountries || allCountries.length === 0) {
      throw new Error('Failed to fetch countries');
    }
    
    // Filter countries based on difficulty level
    let filteredCountries: Country[];
    
    switch (difficulty) {
      case 'beginner':
        // Only use common countries
        filteredCountries = allCountries.filter(country => 
          commonCountries.includes(country.name.common)
        );
        break;
      
      case 'easy':
        // Use moderately known countries
        filteredCountries = allCountries.filter(country => 
          moderateCountries.includes(country.name.common)
        );
        break;
      
      case 'medium':
        // Use all countries except the most obscure ones
        filteredCountries = allCountries.filter(country => 
          country.population > 1000000 || moderateCountries.includes(country.name.common)
        );
        break;
      
      case 'hard':
        // Include countries with similar flags and some lesser-known countries
        // First, get countries with confusing/similar flags
        const confusingCountriesArray = allCountries.filter(country => 
          confusingFlags.includes(country.name.common)
        );
        
        // Then add some lesser-known countries
        const lesserKnownCountries = allCountries.filter(country => 
          country.population < 5000000 && 
          !moderateCountries.includes(country.name.common) &&
          !confusingFlags.includes(country.name.common)
        );
        
        // Combine and shuffle
        filteredCountries = [...confusingCountriesArray, ...lesserKnownCountries];
        break;
      
      default:
        filteredCountries = allCountries;
    }
    
    // Ensure we have enough countries to create a quiz
    if (filteredCountries.length < numQuestions * 4) { // Need at least 4x questions for options
      // If we don't have enough countries for the chosen difficulty, use more countries
      const additionalCountries = allCountries.filter(
        country => !filteredCountries.some(c => c.cca3 === country.cca3)
      );
      
      filteredCountries = [...filteredCountries, ...additionalCountries];
    }
    
    // Shuffle the filtered countries
    const shuffledCountries = [...filteredCountries].sort(() => Math.random() - 0.5);
    
    // Create quiz questions
    const quiz: QuizQuestion[] = [];
    const usedCountries = new Set<string>(); // Track used countries to avoid duplicates
    
    for (let i = 0; i < numQuestions && i < shuffledCountries.length; i++) {
      const correctCountry = shuffledCountries[i];
      
      // Skip if we've already used this country
      if (usedCountries.has(correctCountry.cca3)) {
        continue;
      }
      usedCountries.add(correctCountry.cca3);
      
      // Generate incorrect options
      const incorrectOptions: Country[] = [];
      const remainingCountries = shuffledCountries.filter(c => 
        c.cca3 !== correctCountry.cca3 && !usedCountries.has(c.cca3)
      );
      
      // For hard level, try to find similar flags when possible
      if (difficulty === 'hard') {
        // Get countries with similar colors in flag
        const similarFlags = remainingCountries
          .filter(c => {
            // Check for region similarity (countries in same region often have similar flags)
            const sameRegion = c.region === correctCountry.region;
            
            // Check for similar flag colors (simplified implementation)
            const flagSimilarity = hasColorSimilarities(correctCountry, c);
            
            return sameRegion || flagSimilarity;
          })
          .slice(0, 3);
        
        incorrectOptions.push(...similarFlags);
        
        // Mark these countries as used
        similarFlags.forEach(country => usedCountries.add(country.cca3));
      }
      
      // If we don't have enough similar options, add random ones
      while (incorrectOptions.length < 3 && remainingCountries.length > 0) {
        const randomIndex = Math.floor(Math.random() * remainingCountries.length);
        const randomCountry = remainingCountries.splice(randomIndex, 1)[0];
        
        if (!usedCountries.has(randomCountry.cca3)) {
          incorrectOptions.push(randomCountry);
          usedCountries.add(randomCountry.cca3);
        }
      }
      
      // Create options array with correct and incorrect options
      const options = [correctCountry, ...incorrectOptions].sort(() => Math.random() - 0.5);
      
      quiz.push({
        correctCountry,
        options
      });
    }
    
    return quiz;
    
  } catch (error) {
    console.error('Failed to generate quiz:', error);
    throw new Error('Failed to generate quiz');
  }
};

// Helper function to check if two countries' flags might be similar
const hasColorSimilarities = (country1: Country, country2: Country): boolean => {
  // This is a very simplified approach - in reality would need image processing
  // Check for geographic proximity as it often correlates with flag similarities
  if (country1.region === country2.region) return true;
  
  // Check specific known confusing flag pairs
  const confusingPairs: Record<string, string[]> = {
    'Chad': ['Romania', 'Belgium'],
    'Romania': ['Chad', 'Moldova'],
    'Indonesia': ['Monaco', 'Poland'],
    'Monaco': ['Indonesia', 'Poland'],
    'Netherlands': ['Luxembourg', 'France'],
    'Luxembourg': ['Netherlands'],
    'Russia': ['Slovakia', 'Slovenia'],
    'Slovakia': ['Slovenia', 'Russia'],
    'Slovenia': ['Slovakia', 'Russia'],
    'Ireland': ['Ivory Coast'],
    'Ivory Coast': ['Ireland'],
    'Mali': ['Senegal', 'Guinea'],
    'Senegal': ['Mali', 'Guinea'],
    'Guinea': ['Mali', 'Senegal']
  };
  
  if (confusingPairs[country1.name.common] && 
      confusingPairs[country1.name.common].includes(country2.name.common)) {
    return true;
  }
  
  return false;
};

// Helper function to get high scores from local storage
const getHighScores = (): QuizResult[] => {
  try {
    const storedScores = localStorage.getItem('flagQuizHighScores');
    return storedScores ? JSON.parse(storedScores) : [];
  } catch (error) {
    console.error('Failed to get high scores:', error);
    return [];
  }
};

// Helper function to save a new score
const saveScore = (result: QuizResult): void => {
  try {
    const highScores = getHighScores();
    highScores.push(result);
    localStorage.setItem('flagQuizHighScores', JSON.stringify(highScores));
  } catch (error) {
    console.error('Failed to save score:', error);
  }
};

const flagQuizApi = {
  generateQuiz,
  getHighScores,
  saveScore
};

export default flagQuizApi;
