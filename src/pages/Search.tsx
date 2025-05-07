import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from '@/components/Header';
import SearchBar from "@/components/SearchBar";
import CountryCard from "@/components/CountryCard";
import TranslationSection from "@/components/TranslationSection";
import NewsSection from "@/components/NewsSection";
import WeatherDisplay from "@/components/WeatherDisplay";
import CountryBorderMap from "@/components/CountryBorderMap";
import HistoricalEvents from "@/components/CountryEnrichment/HistoricalEvents";
import CelebritiesSection from "@/components/CountryEnrichment/CelebritiesSection";
import CulinarySection from "@/components/CountryEnrichment/CulinarySection";
import ImageGallery from "@/components/ImageGallery";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Globe, RefreshCcw, MapPin, Users, Landmark, Flag } from "lucide-react";
import api, { Country, NewsArticle, Weather } from "@/services/api";
import { toast } from "sonner";

const Search = () => {
  const [country, setCountry] = useState<Country | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Additional state for components
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [translation, setTranslation] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Country[]>([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [translationLoading, setTranslationLoading] = useState(false);
  const [newsError, setNewsError] = useState<string | null>(null);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [translationError, setTranslationError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Load favorites from localStorage
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favoriteCountries');
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (e) {
        console.error("Failed to parse favorites from localStorage", e);
      }
    }
  }, []);

  // Check if there's a preselected country when the component mounts
  useEffect(() => {
    const preselectedCountry = sessionStorage.getItem('preselectedCountry');
    if (preselectedCountry) {
      handleSearch(preselectedCountry);
      // Clear the preselected country after using it
      sessionStorage.removeItem('preselectedCountry');
    }
  }, []);

  // Fetch additional data when a country is selected
  useEffect(() => {
    if (country) {
      fetchCountryNews(country.name.common);
      if (country.capital && country.capital[0]) {
        fetchWeather(country.capital[0]);
      }
    }
  }, [country]);

  const fetchCountryNews = async (countryName: string) => {
    setNewsLoading(true);
    setNewsError(null);
    try {
      const newsData = await api.getNewsByCountry(countryName);
      setNews(newsData);
    } catch (err) {
      console.error("Error fetching news:", err);
      setNewsError("Failed to load news");
    } finally {
      setNewsLoading(false);
    }
  };

  const fetchWeather = async (city: string) => {
    setWeatherLoading(true);
    setWeatherError(null);
    try {
      const weatherData = await api.getWeatherForCity(city);
      setWeather(weatherData);
    } catch (err) {
      console.error("Error fetching weather:", err);
      setWeatherError("Failed to load weather information");
    } finally {
      setWeatherLoading(false);
    }
  };

  const handleTranslate = async (text: string, targetLang: string) => {
    setTranslationLoading(true);
    setTranslationError(null);
    try {
      const translatedText = await api.translateText(text, targetLang);
      setTranslation(translatedText);
    } catch (err) {
      console.error("Error translating text:", err);
      setTranslationError("Translation failed");
    } finally {
      setTranslationLoading(false);
    }
  };

  const handleSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      toast.error("Please enter a country name");
      return;
    }

    setLoading(true);
    setError(null);
    setNews([]);
    setWeather(null);
    setTranslation(null);
    setActiveTab("overview");

    try {
      const result = await api.getCountryByName(searchTerm);
      if (result) {
        setCountry(result);
        toast.success(`Found information about ${result.name.common}`);
      } else {
        setError(`No country found matching "${searchTerm}"`);
        toast.error(`No country found matching "${searchTerm}"`);
      }
    } catch (err) {
      console.error("Error searching country:", err);
      setError("Failed to search for country. Please try again.");
      toast.error("Failed to search for country. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRandomCountry = async () => {
    setLoading(true);
    setError(null);
    setNews([]);
    setWeather(null);
    setTranslation(null);
    setActiveTab("overview");

    try {
      const randomCountry = await api.getRandomCountry();
      if (randomCountry) {
        setCountry(randomCountry);
        toast.success(`Showing ${randomCountry.name.common}`);
      } else {
        setError("Failed to load a random country");
        toast.error("Failed to load a random country");
      }
    } catch (err) {
      console.error("Error fetching random country:", err);
      setError("Failed to load a random country");
      toast.error("Failed to load a random country");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToFavorites = () => {
    if (!country) return;
    
    // Check if country is already in favorites
    const isFavorite = favorites.some(fav => fav.cca3 === country.cca3);
    
    let updatedFavorites;
    if (isFavorite) {
      // Remove from favorites
      updatedFavorites = favorites.filter(fav => fav.cca3 !== country.cca3);
      toast.success(`Removed ${country.name.common} from favorites`);
    } else {
      // Add to favorites
      updatedFavorites = [...favorites, country];
      toast.success(`Added ${country.name.common} to favorites`);
    }
    
    setFavorites(updatedFavorites);
    localStorage.setItem('favoriteCountries', JSON.stringify(updatedFavorites));
  };

  const isFavorite = country ? favorites.some(fav => fav.cca3 === country.cca3) : false;

  // Animation variants
  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Format population with commas
  const formattedPopulation = country?.population?.toLocaleString() || 'N/A';
  
  // Get area if available - using optional chaining and hasOwnProperty for safety
  const area = country && 'area' in country ? `${country.area.toLocaleString()} km²` : 'N/A';

  // Calculate languages
  const languages = country?.languages 
    ? Object.values(country.languages).join(', ')
    : 'N/A';

  // Get currency info
  let currencyInfo = 'N/A';
  if (country?.currencies) {
    const currencyCodes = Object.keys(country.currencies);
    if (currencyCodes.length > 0) {
      currencyInfo = currencyCodes.map(code => {
        const curr = country.currencies[code];
        return `${curr.name} (${curr.symbol || code})`;
      }).join(', ');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      <Header />
      
      <div className="container max-w-7xl mx-auto py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Explore Countries Around the World
          </h1>
          <p className="text-center text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Search for any country to discover its culture, geography, and fascinating details
          </p>

          <div className="flex flex-col md:flex-row gap-4 max-w-3xl mx-auto">
            <div className="flex-grow">
              <SearchBar onSearch={handleSearch} isLoading={loading} />
            </div>
            <Button
              onClick={handleRandomCountry}
              className="flex items-center"
              variant="outline"
              disabled={loading}
            >
              {loading ? (
                <RefreshCcw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Globe className="h-4 w-4 mr-2" />
              )}
              Random Country
            </Button>
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-red-500 my-8 p-4 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/10"
          >
            {error}
          </motion.div>
        )}

        {country && (
          <motion.div
            variants={containerAnimation}
            initial="hidden"
            animate="show"
            className="space-y-8"
          >
            {/* Country Overview Section */}
            <motion.div variants={itemAnimation} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Flag and Basic Info */}
              <Card className="col-span-1 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <Flag className="h-5 w-5 text-primary" />
                    {country.name.common}
                  </CardTitle>
                  <CardDescription>{country.name.official}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Flag and Coat of Arms */}
                  <div className="flex justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground mb-1">Flag</p>
                      <img
                        src={country.flags.svg || country.flags.png}
                        alt={`Flag of ${country.name.common}`}
                        className="rounded-md w-full h-auto shadow-sm"
                        style={{ maxHeight: "100px" }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://via.placeholder.com/320x180?text=${encodeURIComponent(country.name.common)}+Flag`;
                        }}
                      />
                    </div>
                    {country.coatOfArms && (
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground mb-1">Coat of Arms</p>
                        <img
                          src={country.coatOfArms.svg || country.coatOfArms.png}
                          alt={`Coat of Arms of ${country.name.common}`}
                          className="rounded-md w-full h-auto shadow-sm"
                          style={{ maxHeight: "100px" }}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://via.placeholder.com/320x180?text=${encodeURIComponent(country.name.common)}+Coat+of+Arms`;
                          }}
                        />
                      </div>
                    )}
                  </div>
                  
                  {/* Quick Facts */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">Capital</span>
                      <span className="font-medium">{country.capital?.join(', ') || 'N/A'}</span>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">Region</span>
                      <span className="font-medium">{country.region}</span>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">Population</span>
                      <span className="font-medium">{formattedPopulation}</span>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">Area</span>
                      <span className="font-medium">{area}</span>
                    </div>
                    
                    <div className="flex flex-col col-span-2">
                      <span className="text-xs text-muted-foreground">Languages</span>
                      <span className="font-medium">{languages}</span>
                    </div>
                    
                    <div className="flex flex-col col-span-2">
                      <span className="text-xs text-muted-foreground">Currency</span>
                      <span className="font-medium">{currencyInfo}</span>
                    </div>
                  </div>
                  
                  {/* Add to Favorites */}
                  <div className="flex justify-end mt-4">
                    <Button
                      variant={isFavorite ? "destructive" : "outline"}
                      size="sm"
                      onClick={handleAddToFavorites}
                      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                      {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Map and Location */}
              <Card className="col-span-1 lg:col-span-2 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Geographic Location
                  </CardTitle>
                  <CardDescription>
                    {country.subregion ? `${country.subregion}, ${country.region}` : country.region}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CountryBorderMap 
                    countryName={country.name.common} 
                    countryCode={country.cca3} 
                    latlng={country.latlng}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Translation Component */}
            <motion.div variants={itemAnimation}>
              <TranslationSection 
                countryName={country.name.common} 
                translation={translation}
                onTranslate={handleTranslate}
                isLoading={translationLoading}
                error={translationError}
              />
            </motion.div>

            {/* Image Gallery */}
            <motion.div variants={itemAnimation}>
              <Card className="shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Photos of {country.name.common}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ImageGallery country={country.name.common} numberOfImages={6} />
                </CardContent>
              </Card>
            </motion.div>

            {/* Tabbed Content for Secondary Information */}
            <motion.div variants={itemAnimation}>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full grid grid-cols-2 md:grid-cols-5 gap-2">
                  <TabsTrigger value="history" className="flex items-center gap-1">
                    <Landmark className="h-4 w-4" />
                    <span className="hidden md:inline">History</span>
                  </TabsTrigger>
                  <TabsTrigger value="news" className="flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                    <span className="hidden md:inline">Nice to Know</span>
                  </TabsTrigger>
                  <TabsTrigger value="weather" className="flex items-center gap-1">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 001.5-9.5A5 5 0 0012 5.5a4.5 4.5 0 00-4.4 3.6A5 5 0 003 15z" />
                    </svg>
                    <span className="hidden md:inline">Weather</span>
                  </TabsTrigger>
                  <TabsTrigger value="cuisine" className="flex items-center gap-1">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="hidden md:inline">Cuisine</span>
                  </TabsTrigger>
                  <TabsTrigger value="people" className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span className="hidden md:inline">Notable People</span>
                  </TabsTrigger>
                </TabsList>

                <div className="mt-6">
                  <TabsContent value="history" className="mt-0">
                    <HistoricalEvents countryName={country.name.common} />
                  </TabsContent>
                  
                  <TabsContent value="news" className="mt-0">
                    <NewsSection 
                      countryName={country.name.common}
                      news={news}
                      isLoading={newsLoading}
                      error={newsError}
                    />
                  </TabsContent>
                  
                  <TabsContent value="weather" className="mt-0">
                    <WeatherDisplay countryName={country.name.common} capital={country.capital?.[0]} />
                  </TabsContent>
                  
                  <TabsContent value="cuisine" className="mt-0">
                    <CulinarySection countryName={country.name.common} />
                  </TabsContent>
                  
                  <TabsContent value="people" className="mt-0">
                    <CelebritiesSection countryName={country.name.common} />
                  </TabsContent>
                </div>
              </Tabs>
            </motion.div>
          </motion.div>
        )}

        {!country && !error && !loading && (
          <div className="text-center py-16">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-md mx-auto"
            >
              <Globe className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-medium mb-2">Search for a country</h2>
              <p className="text-muted-foreground">
                Enter a country name above to discover information about it, or try the random country button to explore somewhere new.
              </p>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
