
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import api, { Country, NewsArticle, Quote } from '@/services/api';
import ThemeToggle from '@/components/ThemeToggle';
import SearchBar from '@/components/SearchBar';
import CountryCard from '@/components/CountryCard';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { GlobeIcon, HeartIcon, ShuffleIcon } from 'lucide-react';

const Search = () => {
  // State management
  const [searchedCountry, setSearchedCountry] = useState<Country | null>(null);
  const [favorites, setFavorites] = useLocalStorage<Country[]>('favorites', []);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [translation, setTranslation] = useState<string | null>(null);
  
  // Loading states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [newsLoading, setNewsLoading] = useState<boolean>(false);
  const [quoteLoading, setQuoteLoading] = useState<boolean>(false);
  const [translationLoading, setTranslationLoading] = useState<boolean>(false);
  
  // Error states
  const [countryError, setCountryError] = useState<string | null>(null);
  const [newsError, setNewsError] = useState<string | null>(null);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [translationError, setTranslationError] = useState<string | null>(null);

  const { toast } = useToast();

  // Check if a country is in favorites
  const isCountryInFavorites = (country: Country | null) => {
    if (!country) return false;
    return favorites.some(fav => fav.cca3 === country.cca3);
  };

  // Handle search functionality
  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setCountryError(null);
    setSearchedCountry(null);

    try {
      const countries = await api.getCountryByName(query);
      if (countries && countries.length > 0) {
        setSearchedCountry(countries[0]);
        
        // Fetch related data
        fetchNews(countries[0].name.common);
        fetchQuote();
      } else {
        setCountryError('No country found with that name.');
        toast({
          title: 'Country not found',
          description: 'Please check the spelling and try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      setCountryError(error instanceof Error ? error.message : 'An error occurred.');
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch a random country
  const fetchRandomCountry = async () => {
    setIsLoading(true);
    setCountryError(null);
    setSearchedCountry(null);

    try {
      const randomCountry = await api.getRandomCountry();
      if (randomCountry) {
        setSearchedCountry(randomCountry);
        
        // Fetch related data
        fetchNews(randomCountry.name.common);
        fetchQuote();
      } else {
        setCountryError('Failed to get a random country.');
        toast({
          title: 'Error',
          description: 'Failed to get a random country. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      setCountryError(error instanceof Error ? error.message : 'An error occurred.');
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch news for a country
  const fetchNews = async (countryName: string) => {
    setNewsLoading(true);
    setNewsError(null);

    try {
      const articles = await api.getNewsByCountry(countryName);
      setNews(articles);
    } catch (error) {
      setNewsError(error instanceof Error ? error.message : 'Failed to load news.');
    } finally {
      setNewsLoading(false);
    }
  };

  // Fetch a random quote
  const fetchQuote = async () => {
    setQuoteLoading(true);
    setQuoteError(null);

    try {
      const randomQuote = await api.getRandomQuote();
      setQuote(randomQuote);
    } catch (error) {
      setQuoteError(error instanceof Error ? error.message : 'Failed to load quote.');
    } finally {
      setQuoteLoading(false);
    }
  };

  // Translate country name
  const translateText = async (text: string, targetLang: string) => {
    if (!text) return;
    
    setTranslationLoading(true);
    setTranslationError(null);
    setTranslation(null);

    try {
      const translated = await api.translateText(text, targetLang);
      setTranslation(translated);
    } catch (error) {
      setTranslationError(error instanceof Error ? error.message : 'Translation failed.');
      toast({
        title: 'Translation Error',
        description: error instanceof Error ? error.message : 'Translation failed.',
        variant: 'destructive',
      });
    } finally {
      setTranslationLoading(false);
    }
  };

  // Toggle favorite status
  const toggleFavorite = (country: Country) => {
    if (isCountryInFavorites(country)) {
      setFavorites(favorites.filter(fav => fav.cca3 !== country.cca3));
      toast({
        title: 'Removed from favorites',
        description: `${country.name.common} has been removed from your favorites.`,
      });
    } else {
      setFavorites([...favorites, country]);
      toast({
        title: 'Added to favorites',
        description: `${country.name.common} has been added to your favorites.`,
      });
    }
  };

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-lg bg-background/90 border-b border-border">
        <div className="container py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <span className="animate-float">🌍</span>
              <h1 className="text-2xl font-bold">Culture Explorer</h1>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/favorites">
              <Button variant="outline" className="flex items-center gap-2">
                <HeartIcon size={16} />
                <span className="hidden sm:inline">Favorites</span>
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mt-8">
        {/* Search Section */}
        <section className="mb-8">
          <div className="flex flex-col items-center text-center mb-6">
            <h2 className="text-3xl font-bold mb-2">Search Countries</h2>
            <p className="text-muted-foreground max-w-2xl">
              Search for a country to discover its details, latest news, and get inspired with a random quote.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-4">
            <SearchBar onSearch={handleSearch} isLoading={isLoading} />
            <Button 
              variant="secondary"
              onClick={fetchRandomCountry}
              disabled={isLoading}
              className="w-full md:w-auto"
            >
              <ShuffleIcon className="h-4 w-4 mr-2" />
              Random Country
            </Button>
          </div>
          
          {countryError && (
            <div className="text-center text-destructive">
              {countryError}
            </div>
          )}
        </section>

        {/* Country Results Section */}
        <section>
          {searchedCountry ? (
            <div className="mb-4">
              <CountryCard 
                country={searchedCountry}
                news={news}
                quote={quote}
                translation={translation}
                onAddToFavorites={toggleFavorite}
                onTranslate={translateText}
                isFavorite={isCountryInFavorites(searchedCountry)}
                isLoading={isLoading}
                newsLoading={newsLoading}
                quoteLoading={quoteLoading}
                translationLoading={translationLoading}
                newsError={newsError}
                quoteError={quoteError}
                translationError={translationError}
              />
            </div>
          ) : !isLoading && !countryError ? (
            <div className="bg-card text-center p-10 rounded-lg border border-border shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Start Exploring!</h3>
              <p className="text-muted-foreground mb-6">
                Search for a country above or click "Random Country" to discover a new culture.
              </p>
              <div className="text-5xl animate-float">🗺️</div>
            </div>
          ) : null}
        </section>
      </main>

      {/* Footer */}
      <footer className="container mt-12 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Culture Explorer - A school project</p>
      </footer>
    </div>
  );
};

export default Search;
