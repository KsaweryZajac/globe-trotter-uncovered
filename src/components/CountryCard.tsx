
import React from 'react';
import { Country } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MapPin, Globe, Info } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

interface CountryCardProps {
  country: Country;
  loading: boolean;
  error: string | null;
  onExploreClick: () => void;
  onAddToFavorites: () => void;
  isFavorite: boolean;
  newsLoading?: boolean;
  weatherLoading?: boolean;
  translationLoading?: boolean;
  newsError?: string | null;
  weatherError?: string | null;
  translationError?: string | null;
  children?: React.ReactNode;
}

const CountryCard: React.FC<CountryCardProps> = ({ 
  country, 
  loading, 
  error,
  onExploreClick,
  onAddToFavorites,
  isFavorite,
  children
}) => {
  if (loading) {
    return (
      <Card className="shadow-md h-full">
        <CardHeader>
          <Skeleton className="h-6 w-40 mb-2" />
          <Skeleton className="h-4 w-28" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <Skeleton className="h-[120px] w-[180px]" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </CardFooter>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-md h-full">
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            Unable to load country information. Please try again.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (children) {
    return <div className="h-full">{children}</div>;
  }

  // Format population with commas
  const formattedPopulation = country.population?.toLocaleString();
  
  // Extract region and subregion
  const regionText = country.subregion 
    ? `${country.subregion}, ${country.region}`
    : country.region;

  // Get currency info
  let currencyInfo = '';
  if (country.currencies) {
    const currencyCode = Object.keys(country.currencies)[0];
    if (currencyCode) {
      const currency = country.currencies[currencyCode];
      currencyInfo = `${currency.name} (${currency.symbol || currencyCode})`;
    }
  }

  // Get language info
  let languageInfo = '';
  if (country.languages) {
    const languageCodes = Object.keys(country.languages);
    if (languageCodes.length > 0) {
      languageInfo = languageCodes.map(code => country.languages[code]).join(', ');
    }
  }

  // Check if coat of arms exists and is not empty
  const hasCoatOfArms = country.coatOfArms && (country.coatOfArms.svg || country.coatOfArms.png);

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>{country.name.common}</span>
          {country.cca2 && (
            <span className="text-xs bg-muted px-2 py-1 rounded-md">{country.cca2}</span>
          )}
        </CardTitle>
        <CardDescription>{country.name.official}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Flag and Coat of Arms */}
        <div className={`flex ${hasCoatOfArms ? 'justify-between' : 'justify-center'} gap-4`}>
          <div className={hasCoatOfArms ? "flex-1" : "max-w-[180px]"}>
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
          {hasCoatOfArms && (
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1">Coat of Arms</p>
              <img
                src={country.coatOfArms.svg || country.coatOfArms.png}
                alt={`Coat of Arms of ${country.name.common}`}
                className="rounded-md w-full h-auto shadow-sm object-contain"
                style={{ maxHeight: "100px" }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://via.placeholder.com/320x180?text=${encodeURIComponent(country.name.common)}+Coat+of+Arms`;
                }}
              />
            </div>
          )}
        </div>
        
        {/* Country info */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {country.capital?.length ? country.capital.join(', ') : 'N/A'}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{regionText}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Pop: {formattedPopulation}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {currencyInfo && (
            <Badge variant="outline">
              {currencyInfo}
            </Badge>
          )}
        </div>
        
        {languageInfo && (
          <div className="text-xs text-muted-foreground">
            Languages: {languageInfo}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-center">
        <div className="flex gap-4">
          <Button 
            variant="default" 
            size="sm" 
            onClick={onExploreClick}
          >
            Explore
          </Button>
          
          <Button
            variant={isFavorite ? "destructive" : "outline"}
            size="icon"
            onClick={onAddToFavorites}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart 
              className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} 
            />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CountryCard;
