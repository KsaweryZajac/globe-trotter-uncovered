
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { GlobeIcon, MapPinIcon } from 'lucide-react';
import api, { Country } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';

const CountryOfTheDay: React.FC = () => {
  const { toast } = useToast();
  
  // Check if we need to update the country of the day
  const shouldUpdateCountry = () => {
    const lastUpdated = localStorage.getItem('countryOfTheDay_lastUpdated');
    const currentDate = new Date().toDateString();
    
    return !lastUpdated || lastUpdated !== currentDate;
  };
  
  // Get stored country or fetch a new one
  const getInitialCountry = () => {
    if (shouldUpdateCountry()) {
      return null; // Will trigger fetch of new country
    }
    
    const storedCountry = localStorage.getItem('countryOfTheDay');
    return storedCountry ? JSON.parse(storedCountry) : null;
  };

  const [country, setCountry] = useState<Country | null>(getInitialCountry());
  const [imageLoaded, setImageLoaded] = useState(false);

  // Fetch random country if needed
  const { isLoading, error } = useQuery({
    queryKey: ['countryOfTheDay'],
    queryFn: async () => {
      if (!shouldUpdateCountry() && country) {
        return country; // Use cached country
      }
      
      const newCountry = await api.getRandomCountry();
      
      // Store in localStorage
      if (newCountry) {
        localStorage.setItem('countryOfTheDay', JSON.stringify(newCountry));
        localStorage.setItem('countryOfTheDay_lastUpdated', new Date().toDateString());
        setCountry(newCountry);
      }
      
      return newCountry;
    },
    onError: (err) => {
      console.error("Error fetching country of the day:", err);
      toast({
        title: "Error",
        description: "Could not load country of the day",
        variant: "destructive"
      });
    }
  });

  // Format population with commas
  const formattedPopulation = country ? new Intl.NumberFormat().format(country.population) : '';

  // Load image when country changes
  useEffect(() => {
    if (country?.flags?.svg) {
      setImageLoaded(false);
      const img = new Image();
      img.src = country.flags.svg;
      img.onload = () => setImageLoaded(true);
    }
  }, [country]);

  if (isLoading || !country) {
    return (
      <Card className="w-full shadow-md">
        <CardHeader>
          <CardTitle>Country of the Day</CardTitle>
          <CardDescription>Loading today's featured country...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="w-full h-40" />
          <div className="space-y-2">
            <Skeleton className="w-1/2 h-4" />
            <Skeleton className="w-2/3 h-4" />
            <Skeleton className="w-1/3 h-4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !country) {
    return (
      <Card className="w-full shadow-md">
        <CardHeader>
          <CardTitle>Country of the Day</CardTitle>
          <CardDescription>Could not load country information</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">Failed to load the country of the day. Please try again later.</p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Country of the Day</CardTitle>
            <CardDescription>Discover something new about {country.name.common}</CardDescription>
          </div>
          <GlobeIcon className="h-6 w-6 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative aspect-video w-full overflow-hidden rounded-md border">
          {!imageLoaded && <Skeleton className="absolute inset-0" />}
          <img
            src={country.flags.svg}
            alt={country.flags.alt || `Flag of ${country.name.common}`}
            className="object-cover w-full h-full"
            onLoad={() => setImageLoaded(true)}
          />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold">{country.name.common}</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-sm">
            <div className="text-muted-foreground">Capital:</div>
            <div>{country.capital?.[0] || 'N/A'}</div>
            
            <div className="text-muted-foreground">Region:</div>
            <div>{country.region}</div>
            
            <div className="text-muted-foreground">Population:</div>
            <div>{formattedPopulation}</div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link to={`/search?query=${encodeURIComponent(country.name.common)}`} className="w-full">
          <Button variant="default" className="w-full">
            <MapPinIcon className="h-4 w-4 mr-2" />
            Explore {country.name.common}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CountryOfTheDay;
