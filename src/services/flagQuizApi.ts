
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
        // For hard difficulty, prioritize countries with similar flags
        const confusingCountries = allCountries.filter(country => 
          confusingFlags.includes(country.name.common)
        );
        
        // Ensure we have enough countries even if some confusing ones aren't found
        const remainingCount = Math.max(0, 30 - confusingCountries.length);
        const otherHardCountries = allCountries
          .filter(country => !confusingFlags.includes(country.name.common))
          .sort(() => Math.random() - 0.5)
          .slice(0, remainingCount);
        
        filteredCountries = [...confusingCountries, ...otherHardCountries];
        break;
      
      default:
        filteredCountries = allCountries;
    }
    
    // Ensure we have enough countries to create a quiz
    if (filteredCountries.length < numQuestions + 3) {
      // If we don't have enough countries for the chosen difficulty, use more countries
      filteredCountries = allCountries;
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
        c.cca3 !== correctCountry.cca3 && !incorrectOptions.some(o => o.cca3 === c.cca3)
      );
      
      // For hard level, try to find similar flags when possible
      if (difficulty === 'hard') {
        // Get countries with similar colors in flag
        // This is a simple approach - in a real app, you might use image analysis
        const correctColors = extractFlagColors(correctCountry.name.common);
        const similarCountries = remainingCountries
          .filter(c => {
            const colors = extractFlagColors(c.name.common);
            return hasCommonElements(correctColors, colors);
          })
          .slice(0, 3);
        
        incorrectOptions.push(...similarCountries);
      }
      
      // If we don't have enough similar options, add random ones
      while (incorrectOptions.length < 3 && remainingCountries.length > 0) {
        const randomIndex = Math.floor(Math.random() * remainingCountries.length);
        incorrectOptions.push(remainingCountries.splice(randomIndex, 1)[0]);
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

// Helper function to extract flag colors (simplified approach)
const extractFlagColors = (countryName: string): string[] => {
  // This is a simplified approach - in reality would need image processing
  // Just returning some common colors based on country names for demonstration
  const colorMap: Record<string, string[]> = {
    'Chad': ['blue', 'yellow', 'red'],
    'Romania': ['blue', 'yellow', 'red'],
    'Belgium': ['black', 'yellow', 'red'],
    'Germany': ['black', 'red', 'yellow'],
    'Russia': ['white', 'blue', 'red'],
    'France': ['blue', 'white', 'red'],
    'Netherlands': ['red', 'white', 'blue'],
    'Italy': ['green', 'white', 'red'],
    'Ireland': ['green', 'white', 'orange'],
    'Ivory Coast': ['orange', 'white', 'green'],
    'Hungary': ['red', 'white', 'green'],
    'Bulgaria': ['white', 'green', 'red'],
    // Add more as needed
  };
  
  return colorMap[countryName] || [];
};

// Helper function to check if two arrays have at least one common element
const hasCommonElements = (array1: string[], array2: string[]): boolean => {
  return array1.some(item => array2.includes(item));
};

const flagQuizApi = {
  generateQuiz,
  getHighScores,
  saveScore
};

export default flagQuizApi;
