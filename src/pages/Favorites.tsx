
import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Country, NewsArticle, Weather } from '@/services/api';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CountryCard from '@/components/CountryCard'; 
import api from '@/services/api';
import { useToast } from '@/components/ui/use-toast';
import FavoritesList from '@/components/FavoritesList';

const Favorites = () => {
  // State management
  const [favorites, setFavorites] = useLocalStorage<Country[]>('favoriteCountries', []);
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      <Header />

      {/* Main Content */}
      <div className="container max-w-7xl mx-auto py-8 px-4">
        <div className="flex flex-col items-center text-center mb-6">
          <h2 className="text-3xl font-bold mb-2">Your Favorite Countries</h2>
          <p className="text-muted-foreground max-w-2xl">
            View and manage your collection of favorite countries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Favorites List */}
          <aside className="md:col-span-1">
            <FavoritesList 
              favorites={favorites} 
              onRemoveFavorite={removeFavorite} 
              onSelectFavorite={viewCountryDetails} 
            />
          </aside>

          {/* Selected Country Details */}
          <section className="md:col-span-2">
            {selectedCountry ? (
              <CountryCard 
                country={selectedCountry}
                loading={false}
                error={null}
                onExploreClick={() => {}}
                onAddToFavorites={() => removeFavorite(selectedCountry.cca3)}
                isFavorite={true}
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
      </div>

      {/* Footer */}
      <footer className="container mt-12 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Culture Explorer - A school project</p>
      </footer>
    </div>
  );
};

export default Favorites;
