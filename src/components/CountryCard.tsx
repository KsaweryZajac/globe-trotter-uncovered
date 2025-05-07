
import React from 'react';
import { Country } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface CountryCardProps {
  country: Country;
  onAddToFavorites: (country: Country) => void;
  isFavorite: boolean;
}

const CountryCard: React.FC<CountryCardProps> = ({
  country,
  onAddToFavorites,
  isFavorite,
}) => {
  // Check if coat of arms exists
  const hasCoatOfArms = country.coatOfArms && 
    (country.coatOfArms.svg || country.coatOfArms.png) &&
    (country.coatOfArms.svg !== "" || country.coatOfArms.png !== "");
  
  // Get first language
  const languages = country.languages ? Object.values(country.languages) : [];
  const firstLanguage = languages.length > 0 ? languages[0] : 'Unknown';

  // Format population with commas
  const formattedPopulation = country.population
    ? country.population.toLocaleString()
    : 'Unknown';

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative">
        <img
          src={country.flags.svg || country.flags.png}
          alt={`Flag of ${country.name.common}`}
          className="w-full h-32 object-cover"
        />
        
        <Button
          size="icon"
          variant={isFavorite ? "destructive" : "secondary"}
          className="absolute top-2 right-2 h-8 w-8 rounded-full flex items-center justify-center"
          onClick={() => onAddToFavorites(country)}
        >
          <Heart
            className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`}
          />
        </Button>
      </div>

      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-lg">{country.name.common}</CardTitle>
        <p className="text-sm text-muted-foreground">{country.name.official}</p>
      </CardHeader>

      <CardContent className="p-4 pt-2 grid gap-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1 flex-1">
            <p className="text-sm">
              <span className="font-medium">Capital:</span>{' '}
              {country.capital?.[0] || 'N/A'}
            </p>
            <p className="text-sm">
              <span className="font-medium">Population:</span> {formattedPopulation}
            </p>
            <p className="text-sm">
              <span className="font-medium">Region:</span> {country.region}
            </p>
            <p className="text-sm">
              <span className="font-medium">Language:</span> {firstLanguage}
            </p>
          </div>
          
          {hasCoatOfArms ? (
            <div className="flex-shrink-0 w-16 h-auto flex items-center justify-center">
              <img 
                src={country.coatOfArms.svg || country.coatOfArms.png} 
                alt={`Coat of arms of ${country.name.common}`}
                className="max-w-full max-h-16 object-contain"
                style={{ height: 'auto', width: 'auto' }}
              />
            </div>
          ) : (
            <div className="flex-shrink-0 w-16 h-auto flex items-center justify-center">
              <img 
                src={country.flags.svg || country.flags.png}
                alt={`Flag of ${country.name.common}`}
                className="max-w-full max-h-16 object-contain"
              />
            </div>
          )}
        </div>

        <div className="flex justify-center mt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            asChild
          >
            <a href={`/country/${country.cca3}`}>View Details</a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CountryCard;
