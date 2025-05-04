import React from 'react';
import { Country } from '@/services/api';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPinIcon, GlobeIcon, PlaneIcon } from 'lucide-react';

interface CountryOfTheDayProps {
  country: Country | null;
  loading: boolean;
  error: string | null;
  onExploreClick: (countryName: string) => void;
}

const CountryOfTheDay: React.FC<CountryOfTheDayProps> = ({ country, loading, error, onExploreClick }) => {
  if (loading) {
    return (
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle><Skeleton className="h-5 w-40" /></CardTitle>
          <CardDescription><Skeleton className="h-4 w-24" /></CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-5/6 mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-20" />
        </CardFooter>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">Failed to load country of the day.</p>
        </CardContent>
      </Card>
    );
  }

  if (!country) {
    return (
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>No Country Today</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">No country of the day available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GlobeIcon className="h-5 w-5 text-primary" />
          Country of the Day
        </CardTitle>
        <CardDescription>Discover a new country each day</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">{country.name.common}</h3>
          <p className="text-muted-foreground">{country.name.official}</p>
        </div>
        <div className="flex items-center gap-2">
          <MapPinIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{country.capital?.[0] || 'N/A'}, {country.region}</span>
        </div>
        <img
          src={country.flags.svg}
          alt={`Flag of ${country.name.common}`}
          className="w-full rounded-md aspect-video object-cover"
        />
      </CardContent>
      <CardFooter>
        <Button onClick={() => onExploreClick(country.name.common)}>
          <PlaneIcon className="h-4 w-4 mr-2" />
          Explore {country.name.common}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CountryOfTheDay;
