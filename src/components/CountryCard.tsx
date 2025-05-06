
import React from 'react';
import { Country, NewsArticle, Weather } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MapPin, Globe, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

// Define a custom CSS class to be injected into the app
const injectFlagStyles = () => {
  const styleId = 'custom-flag-styles';
  
  // Only add if not already present
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.innerHTML = `
      .country-card img.flag-image {
        max-height: 120px !important;
        object-fit: contain !important;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      }
      
      /* Make flags even smaller in search results */
      .search-results .country-card img.flag-image {
        max-height: 80px !important;
      }
    `;
    document.head.appendChild(style);
  }
};

// Execute immediately when this component loads
injectFlagStyles();

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
  news?: NewsArticle[];
  weather?: Weather | null;
  translation?: string | null;
  onTranslate?: (text: string, targetLang: string) => void;
  onCitySearch?: (city: string) => void | Promise<void>;
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
      <div className="country-card">
        <Card className="shadow-md">
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
      </div>
    );
  }

  if (error) {
    return (
      <div className="country-card">
        <Card className="shadow-md">
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
      </div>
    );
  }

  if (children) {
    return <div className="country-card">{children}</div>;
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

  return (
    <div className="country-card">
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>{country.name.common}</span>
            {country.cca2 && (
              <span className="text-xs bg-muted px-2 py-1 rounded-md">{country.cca2}</span>
            )}
          </CardTitle>
          <CardDescription>{country.name.official}</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Flag */}
          <div className="flex justify-center">
            <img
              src={country.flags.svg || country.flags.png}
              alt={`Flag of ${country.name.common}`}
              className="flag-image rounded-md max-w-full h-[120px]"
              onError={(e) => {
                // Fallback if flag image fails to load
                const target = e.target as HTMLImageElement;
                target.src = `https://via.placeholder.com/320x180?text=${encodeURIComponent(country.name.common)}+Flag`;
              }}
            />
          </div>
          
          {/* Country info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
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
            
            <div className="space-y-2">
              {currencyInfo && (
                <Badge variant="outline" className="mr-2">
                  {currencyInfo}
                </Badge>
              )}
              
              {languageInfo && (
                <div className="text-xs text-muted-foreground">
                  Languages: {languageInfo}
                </div>
              )}
              
              {country.borders && country.borders.length > 0 && (
                <div className="text-xs text-muted-foreground">
                  Borders: {country.borders.slice(0, 5).join(', ')}
                  {country.borders.length > 5 && '...'}
                </div>
              )}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
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
        </CardFooter>
      </Card>
    </div>
  );
};

// This wrapper should still accept children to maintain compatibility
interface SmallerFlagWrapperProps {
  children?: React.ReactNode;
}

const SmallerFlagWrapper: React.FC<SmallerFlagWrapperProps> = ({ children }) => {
  // Apply the custom class to the wrapper
  return <div className="country-card">{children}</div>;
};

export default CountryCard;
