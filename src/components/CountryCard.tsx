
import { useState, useEffect } from "react";
import { Country, NewsArticle, Quote } from "@/services/api";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { HeartIcon, GlobeIcon } from "lucide-react";
import NewsSection from "./NewsSection";
import QuoteDisplay from "./QuoteDisplay";
import TranslationSection from "./TranslationSection";

interface CountryCardProps {
  country: Country;
  news: NewsArticle[];
  quote: Quote | null;
  translation?: string | null;
  onAddToFavorites: (country: Country) => void;
  onTranslate?: (text: string, targetLang: string) => void;
  isFavorite: boolean;
  isLoading: boolean;
  newsLoading: boolean;
  quoteLoading: boolean;
  translationLoading?: boolean;
  newsError: string | null;
  quoteError: string | null;
  translationError?: string | null;
}

const CountryCard = ({
  country,
  news,
  quote,
  translation,
  onAddToFavorites,
  onTranslate,
  isFavorite,
  isLoading,
  newsLoading,
  quoteLoading,
  translationLoading = false,
  newsError,
  quoteError,
  translationError = null
}: CountryCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Format languages array from object
  const languagesList = country.languages
    ? Object.values(country.languages).join(', ')
    : 'N/A';
    
  // Format population with commas
  const formattedPopulation = new Intl.NumberFormat().format(country.population);

  // Set image loaded state when flag is loaded
  useEffect(() => {
    const img = new Image();
    img.src = country.flags.svg;
    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageLoaded(true); // Still mark as "loaded" on error
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [country.flags.svg]);

  return (
    <Card className="w-full shadow-md overflow-hidden border border-border">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span>{country.name.common}</span>
          <Button
            variant={isFavorite ? "destructive" : "outline"}
            size="sm"
            className="ml-2"
            onClick={() => onAddToFavorites(country)}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <HeartIcon className="h-4 w-4 mr-1" />
            {isFavorite ? "Remove" : "Favorite"}
          </Button>
        </CardTitle>
        <CardDescription>{country.name.official}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/2">
            {!imageLoaded ? (
              <Skeleton className="w-full h-36 rounded-md" />
            ) : (
              <div className="relative aspect-video overflow-hidden rounded-md border border-border">
                <img
                  src={country.flags.svg}
                  alt={country.flags.alt || `Flag of ${country.name.common}`}
                  className="object-cover w-full h-full"
                  onLoad={() => setImageLoaded(true)}
                />
              </div>
            )}
          </div>
          <div className="w-full md:w-1/2">
            <div className="space-y-2">
              <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2">
                <dt className="font-medium">Capital:</dt>
                <dd>{country.capital?.[0] || 'N/A'}</dd>
                
                <dt className="font-medium">Population:</dt>
                <dd>{formattedPopulation}</dd>
                
                <dt className="font-medium">Languages:</dt>
                <dd className="line-clamp-2" title={languagesList}>
                  {languagesList}
                </dd>
              </dl>
            </div>

            {onTranslate && (
              <div className="mt-4">
                <TranslationSection 
                  countryName={country.name.common}
                  translation={translation}
                  onTranslate={onTranslate}
                  isLoading={translationLoading}
                  error={translationError}
                />
              </div>
            )}
          </div>
        </div>
        
        <NewsSection 
          news={news} 
          isLoading={newsLoading} 
          error={newsError} 
          countryName={country.name.common}
        />
        
        <QuoteDisplay 
          quote={quote} 
          isLoading={quoteLoading} 
          error={quoteError} 
        />
      </CardContent>
    </Card>
  );
};

export default CountryCard;
