
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
import { Button } from "@/components/ui/button";
import { GlobeIcon, RefreshCcw } from "lucide-react";
import api, { Country } from "@/services/api";
import { toast } from "sonner";

const Search = () => {
  const [country, setCountry] = useState<Country | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if there's a preselected country when the component mounts
  useEffect(() => {
    const preselectedCountry = sessionStorage.getItem('preselectedCountry');
    if (preselectedCountry) {
      handleSearch(preselectedCountry);
      // Clear the preselected country after using it
      sessionStorage.removeItem('preselectedCountry');
    }
  }, []);

  const handleSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      toast.error("Please enter a country name");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await api.getCountryByName(searchTerm);
      if (result) {
        setCountry(result);
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/90">
      <Header />
      
      <div className="container max-w-7xl mx-auto py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Explore Countries Around the World
          </h1>
          <p className="text-center text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Search for any country to learn about its culture, geography, and interesting facts
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
                <GlobeIcon className="h-4 w-4 mr-2" />
              )}
              Random Country
            </Button>
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-red-500 my-8"
          >
            {error}
          </motion.div>
        )}

        {country && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <CountryCard country={country} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CountryBorderMap country={country} />
              <WeatherDisplay countryName={country.name.common} capital={country.capital?.[0]} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <HistoricalEvents countryName={country.name.common} />
              <CelebritiesSection countryName={country.name.common} />
              <CulinarySection countryName={country.name.common} />
            </div>

            <TranslationSection countryName={country.name.common} />
            <NewsSection countryName={country.name.common} />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Search;
