
import { useState, useEffect } from "react";
import { Country, NewsArticle, Weather } from "@/services/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { HeartIcon, InfoIcon, GlobeIcon, MapPinIcon, Map } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

interface CountryCardProps {
  country: Country;
  news: NewsArticle[];
  weather: Weather | null;
  translation?: string | null;
  onAddToFavorites: (country: Country) => void;
  onTranslate?: (text: string, targetLang: string) => void;
  onCitySearch?: (city: string) => void;
  isFavorite: boolean;
  isLoading: boolean;
  newsLoading: boolean;
  weatherLoading: boolean;
  translationLoading?: boolean;
  newsError: string | null;
  weatherError: string | null;
  translationError?: string | null;
}

const CountryCard = ({
  country,
  onAddToFavorites,
  isFavorite,
  isLoading
}: CountryCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Format languages array from object
  const languagesList = country.languages
    ? Object.values(country.languages).join(', ')
    : 'N/A';
    
  // Format population with commas
  const formattedPopulation = new Intl.NumberFormat().format(country.population);

  // Format area with commas
  const formattedArea = country.area 
    ? new Intl.NumberFormat().format(country.area) 
    : 'N/A';

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

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="bg-card shadow-md overflow-hidden border border-border/50 backdrop-blur-sm">
        <CardHeader className="pb-2 flex flex-row justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center">
              {country.name.common}
              {country.cca2 && (
                <Badge variant="outline" className="ml-2 text-xs">
                  {country.cca2}
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="text-sm">{country.name.official}</CardDescription>
          </div>
          <Button
            variant={isFavorite ? "destructive" : "outline"}
            size="sm"
            className="h-9 transition-all duration-300 transform hover:scale-105"
            onClick={() => onAddToFavorites(country)}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <HeartIcon className={`h-4 w-4 mr-1 ${isFavorite ? "fill-current" : ""}`} />
            {isFavorite ? "Remove" : "Favorite"}
          </Button>
        </CardHeader>

        <CardContent className="p-4 pt-0">
          <div className="mt-4 flex flex-col md:flex-row gap-6">
            {/* Flag Column - smaller than before */}
            <div className="w-full md:w-1/3 flex flex-col">
              {!imageLoaded ? (
                <Skeleton className="w-full h-36 rounded-md" />
              ) : (
                <div className="relative overflow-hidden rounded-md border border-border hover:shadow-md transition-shadow">
                  <img
                    src={country.flags.svg}
                    alt={country.flags.alt || `Flag of ${country.name.common}`}
                    className="w-full h-auto object-cover aspect-video"
                    onLoad={() => setImageLoaded(true)}
                  />
                </div>
              )}
              
              {country.coatOfArms && country.coatOfArms.svg && (
                <div className="mt-3">
                  <p className="text-xs text-muted-foreground mb-1">Coat of Arms</p>
                  <div className="h-24 flex items-center justify-center border rounded-md p-2">
                    <img
                      src={country.coatOfArms.svg}
                      alt={`Coat of Arms of ${country.name.common}`}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Country Info Column - more content */}
            <div className="w-full md:w-2/3">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible" 
                className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3"
              >
                <motion.div variants={itemVariants} className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Capital</p>
                  <p className="font-semibold flex items-center">
                    <MapPinIcon className="h-4 w-4 mr-1 text-primary/70" />
                    {country.capital?.[0] || 'N/A'}
                  </p>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Region</p>
                  <p className="font-semibold">
                    <GlobeIcon className="h-4 w-4 mr-1 inline text-primary/70" />
                    {country.region} {country.subregion ? `(${country.subregion})` : ''}
                  </p>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Population</p>
                  <p className="font-semibold">{formattedPopulation}</p>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Area</p>
                  <p className="font-semibold">{formattedArea} km²</p>
                </motion.div>
              </motion.div>

              <Separator className="my-4" />

              <motion.div variants={containerVariants} initial="hidden" animate="visible">
                <motion.div variants={itemVariants} className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Languages</p>
                  <div className="flex flex-wrap gap-2">
                    {country.languages ? 
                      Object.values(country.languages).map((language, i) => (
                        <Badge key={i} variant="secondary">{language}</Badge>
                      )) : 
                      <span className="text-muted-foreground text-sm">No language data available</span>
                    }
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Currency</p>
                  <div className="flex flex-wrap gap-2">
                    {country.currencies ? 
                      Object.entries(country.currencies).map(([code, currency]: [string, any]) => (
                        <Badge key={code} variant="outline" className="border-primary/30">
                          {currency.name} ({currency.symbol})
                        </Badge>
                      )) :
                      <span className="text-muted-foreground text-sm">No currency data available</span>
                    }
                  </div>
                </motion.div>
              </motion.div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                {country.maps && country.maps.googleMaps && (
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <a href={country.maps.googleMaps} target="_blank" rel="noopener noreferrer">
                      <MapPinIcon className="h-4 w-4 mr-2" />
                      Google Maps
                    </a>
                  </Button>
                )}
                
                {country.maps && country.maps.openStreetMaps && (
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <a href={country.maps.openStreetMaps} target="_blank" rel="noopener noreferrer">
                      <Map className="h-4 w-4 mr-2" />
                      OpenStreetMap
                    </a>
                  </Button>
                )}

                <Button variant="secondary" size="sm" className="flex-1" asChild>
                  <a href={`https://en.wikipedia.org/wiki/${country.name.common}`} target="_blank" rel="noopener noreferrer">
                    <InfoIcon className="h-4 w-4 mr-2" />
                    Learn More
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CountryCard;
