import React from 'react';
import { Country } from '@/services/api';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Map as MapIcon, Globe, Users, CircleDollarSign, Languages, Image, Link } from 'lucide-react';

interface CountryCardProps {
  country: Country | null;
  loading: boolean;
  error: string | null;
  onExploreClick?: (countryName: string) => void;
  // Add optional props used in other pages
  news?: any[];
  weather?: any;
  translation?: string | null;
  onAddToFavorites?: (country: Country) => void;
  onTranslate?: (text: string, targetLang: string) => Promise<void>;
  onCitySearch?: (city: string) => Promise<void>;
  isFavorite?: boolean;
  isLoading?: boolean;
  newsLoading?: boolean;
  weatherLoading?: boolean;
  translationLoading?: boolean;
  newsError?: string | null;
  weatherError?: string | null;
  translationError?: string | null;
}

const CountryCard: React.FC<CountryCardProps> = ({ 
  country, 
  loading, 
  error, 
  onExploreClick = () => {},
  // Optional props with defaults
  news = [],
  weather = null,
  translation = null,
  onAddToFavorites = () => {},
  onTranslate = async () => {},
  onCitySearch = async () => {},
  isFavorite = false,
  isLoading = false,
  newsLoading = false,
  weatherLoading = false,
  translationLoading = false,
  newsError = null,
  weatherError = null,
  translationError = null,
}) => {
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
        <CardFooter className="flex justify-between">
          <Skeleton className="h-10 w-20" />
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
          <p className="text-center text-muted-foreground">Failed to load country data.</p>
        </CardContent>
      </Card>
    );
  }

  if (!country) {
    return (
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>No Country Selected</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">No country data available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          {country.name.common}
        </CardTitle>
        <CardDescription>{country.name.official}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <img
          src={country.flags.svg}
          alt={`Flag of ${country.name.common}`}
          className="w-full rounded-md aspect-video object-cover"
        />
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <MapIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{country.capital?.[0] || 'N/A'}, {country.region}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Population: {country.population.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Currency: {Object.values(country.currencies || {})
                .map((currency) => currency.name)
                .join(', ') || 'N/A'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Languages className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Languages: {Object.values(country.languages || {}).join(', ') || 'N/A'}
            </span>
          </div>
        </div>

        {country.coatOfArms?.svg && (
          <div className="flex flex-col items-center">
            <h3 className="font-semibold mb-1">Coat of Arms</h3>
            <img 
              src={country.coatOfArms.svg} 
              alt={`Coat of Arms of ${country.name.common}`}
              className="h-24 object-contain mb-2"
            />
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {country.borders && country.borders.length > 0 ? (
            <>
              <span className="text-sm font-medium">Borders:</span>
              {country.borders.map((border, index) => (
                <Badge key={index} variant="secondary">
                  {border}
                </Badge>
              ))}
            </>
          ) : (
            <span className="text-sm text-muted-foreground">No borders specified</span>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {onExploreClick && (
          <Button onClick={() => onExploreClick(country.name.common)}>
            <Image className="h-4 w-4 mr-2" />
            Explore
          </Button>
        )}
        <div className="flex flex-col space-y-2">
          {country.maps?.googleMaps && (
            <Button variant="outline" size="sm" className="w-full mb-2" asChild>
              <a href={country.maps.googleMaps} target="_blank" rel="noopener noreferrer">
                Google Maps
              </a>
            </Button>
          )}

          {country.maps?.openStreetMaps && (
            <Button variant="outline" size="sm" className="w-full" asChild>
              <a href={country.maps.openStreetMaps} target="_blank" rel="noopener noreferrer">
                OpenStreetMap
              </a>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default CountryCard;
