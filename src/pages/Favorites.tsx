import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Country, NewsArticle, Weather } from '@/services/api';
import ThemeToggle from '@/components/ThemeToggle';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GlobeIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CountryCard from '@/components/CountryCard';
import api from '@/services/api';
import { useToast } from '@/components/ui/use-toast';

const Favorites = () => {
  // State management
  const [favorites, setFavorites] = useLocalStorage<Country[]>('favorites', []);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [weather, setWeather] = useState<Weather | null>(null);
  
  // Loading states
  const [newsLoading, setNewsLoading] = useState<boolean>(false);
  const [weatherLoading, setWeatherLoading] = useState<boolean>(false);
  
  // Error states
  const [newsError, setNewsError] = useState<string | null>(null);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  
  const { toast } = useToast();

  // Remove a country from favorites
  const removeFavorite = (countryCode: string) => {
    setFavorites(favorites.filter(fav => fav.cca3 !== countryCode));
    if (selectedCountry && selectedCountry.cca3 === countryCode) {
      setSelectedCountry(null);
    }
  };

  // View a favorite country in detail
  const viewCountryDetails = async (country: Country) => {
    setSelectedCountry(country);
    
    // Fetch related data
    setNewsLoading(true);
    setWeatherLoading(true);
    
    try {
      const articles = await api.getNewsByCountry(country.name.common);
      setNews(articles);
    } catch (error) {
      setNewsError(error instanceof Error ? error.message : 'Failed to load news.');
    } finally {
      setNewsLoading(false);
    }
    
    try {
      if (country.capital && country.capital.length > 0) {
        const weatherData = await api.getWeatherForCity(country.capital[0]);
        setWeather(weatherData);
      }
    } catch (error) {
      setWeatherError(error instanceof Error ? error.message : 'Failed to load weather.');
    } finally {
      setWeatherLoading(false);
    }
  };

  // Fetch weather for a specific city
  const fetchWeatherForCity = async (city: string) => {
    setWeatherLoading(true);
    setWeatherError(null);

    try {
      const weatherData = await api.getWeatherForCity(city);
      setWeather(weatherData);
      
      toast({
        title: 'Weather Updated',
        description: `Weather information for ${city} has been loaded.`,
      });
    } catch (error) {
      setWeatherError(error instanceof Error ? error.message : 'Failed to load weather.');
      toast({
        title: 'Weather Error',
        description: error instanceof Error ? error.message : 'Failed to load weather data.',
        variant: 'destructive',
      });
    } finally {
      setWeatherLoading(false);
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
            <Link to="/search">
              <Button variant="outline" className="flex items-center gap-2">
                <GlobeIcon size={16} />
                <span className="hidden sm:inline">Search</span>
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mt-8">
        <div className="flex flex-col items-center text-center mb-6">
          <h2 className="text-3xl font-bold mb-2">Your Favorite Countries</h2>
          <p className="text-muted-foreground max-w-2xl">
            View and manage your collection of favorite countries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Favorites List */}
          <aside className="md:col-span-1">
            <Card className="w-full shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">
                  Favorite Countries ({favorites.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {favorites.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground mb-4">You haven't added any favorites yet.</p>
                    <Link to="/search">
                      <Button>Start Exploring</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {favorites.map((country) => (
                      <div key={country.cca3} className="flex items-center justify-between">
                        <div 
                          className="flex items-center gap-3 flex-grow cursor-pointer hover:bg-secondary p-2 rounded-md transition-colors"
                          onClick={() => viewCountryDetails(country)}
                        >
                          <img 
                            src={country.flags.svg} 
                            alt={`Flag of ${country.name.common}`}
                            className="h-6 w-10 object-cover shadow-sm rounded"
                          />
                          <div className="flex-grow">
                            <h3 className="font-medium text-sm">{country.name.common}</h3>
                            <p className="text-xs text-muted-foreground">{country.capital?.[0] || 'N/A'}</p>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeFavorite(country.cca3)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </aside>

          {/* Selected Country Details */}
          <section className="md:col-span-2">
            {selectedCountry ? (
              <CountryCard 
                country={selectedCountry}
                news={news}
                weather={weather}
                onAddToFavorites={() => removeFavorite(selectedCountry.cca3)}
                onCitySearch={fetchWeatherForCity}
                isFavorite={true}
                isLoading={false}
                newsLoading={newsLoading}
                weatherLoading={weatherLoading}
                newsError={newsError}
                weatherError={weatherError}
              />
            ) : (
              <div className="bg-card text-center p-10 rounded-lg border border-border shadow-sm h-full flex flex-col justify-center items-center">
                <h3 className="text-xl font-semibold mb-4">Select a country</h3>
                <p className="text-muted-foreground mb-6">
                  Click on any country from your favorites list to view its details.
                </p>
                <div className="text-5xl animate-float">🗺️</div>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mt-12 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Culture Explorer - A school project</p>
      </footer>
    </div>
  );
};

export default Favorites;
