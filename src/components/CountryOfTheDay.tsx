import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { GlobeIcon } from 'lucide-react';
import api, { Country } from '@/services/api';

interface CountryOfTheDayProps {
  onExploreClick?: (countryName: string) => void;
}

const CountryOfTheDay: React.FC<CountryOfTheDayProps> = ({ onExploreClick }) => {
  const [country, setCountry] = useState<Country | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCountryOfTheDay = async () => {
      // Use sessionStorage to keep the same country throughout the session
      const storedCountry = sessionStorage.getItem('countryOfTheDay');
      const storedDate = sessionStorage.getItem('countryOfTheDayDate');
      const today = new Date().toDateString();

      // Check if we have stored a country and if it's from today
      if (storedCountry && storedDate === today) {
        setCountry(JSON.parse(storedCountry));
        setLoading(false);
      } else {
        try {
          const randomCountry = await api.getRandomCountry();
          
          if (randomCountry) {
            setCountry(randomCountry);
            // Store in session storage
            sessionStorage.setItem('countryOfTheDay', JSON.stringify(randomCountry));
            sessionStorage.setItem('countryOfTheDayDate', today);
          }
        } catch (error) {
          console.error('Error fetching country of the day:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    getCountryOfTheDay();
  }, []);

  // Handle the explore button click
  const handleExploreClick = () => {
    if (country && onExploreClick) {
      onExploreClick(country.name.common);
    }
  };

  if (loading) {
    return (
      <Card className="overflow-hidden shadow-md">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="p-6">
              <Skeleton className="h-10 w-3/4 mb-4" />
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-4 w-2/3 mb-2" />
              <Skeleton className="h-4 w-3/4 mb-4" />
              <Skeleton className="h-9 w-32" />
            </div>
            <div className="bg-muted h-60 md:h-auto" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!country) {
    return (
      <Card className="overflow-hidden shadow-md">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Unable to load country information.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden shadow-lg">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2">{country.name.common}</h3>
              <p className="text-muted-foreground mb-1">Region: {country.region}</p>
              <p className="text-muted-foreground mb-1">Capital: {country.capital?.[0] || 'N/A'}</p>
              <p className="text-muted-foreground mb-4">Population: {country.population.toLocaleString()}</p>
              
              {onExploreClick ? (
                <Button onClick={handleExploreClick} className="mt-2">
                  <GlobeIcon className="mr-2 h-4 w-4" />
                  Explore Country
                </Button>
              ) : (
                <Link to="/search">
                  <Button className="mt-2">
                    <GlobeIcon className="mr-2 h-4 w-4" />
                    Explore Countries
                  </Button>
                </Link>
              )}
            </div>
            <div className="relative h-60 md:h-auto overflow-hidden bg-muted">
              {country.flags?.svg && (
                <img 
                  src={country.flags.svg} 
                  alt={country.flags.alt || `Flag of ${country.name.common}`}
                  className="w-full h-full object-cover object-center"
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CountryOfTheDay;
