
import { Country } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HeartIcon, XIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface FavoritesListProps {
  favorites: Country[];
  onRemoveFavorite: (countryCode: string) => void;
  onSelectFavorite: (country: Country) => void;
}

const FavoritesList = ({ favorites, onRemoveFavorite, onSelectFavorite }: FavoritesListProps) => {
  if (!favorites.length) {
    return (
      <Card className="w-full shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <HeartIcon className="h-5 w-5 mr-2 text-destructive" />
            Favorite Countries
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            No favorites yet. Search for a country and click the "Favorite" button to add it here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <HeartIcon className="h-5 w-5 mr-2 text-destructive" />
          Favorite Countries ({favorites.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {favorites.map((country, index) => (
            <div key={country.cca3}>
              <div className="flex items-center justify-between">
                <div 
                  className="flex items-center gap-3 flex-grow cursor-pointer hover:bg-secondary p-2 rounded-md transition-colors"
                  onClick={() => onSelectFavorite(country)}
                >
                  <img 
                    src={country.flags.svg} 
                    alt={`Flag of ${country.name.common}`}
                    className="h-6 w-10 object-cover shadow-sm rounded"
                  />
                  <div className="flex-grow">
                    <h3 className="font-medium text-sm">{country.name.common}</h3>
                    <p className="text-xs text-muted-foreground">{country.capital?.[0] || 'N/A'}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => onRemoveFavorite(country.cca3)}
                  aria-label={`Remove ${country.name.common} from favorites`}
                >
                  <XIcon className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                </Button>
              </div>
              {index < favorites.length - 1 && <Separator className="my-2" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FavoritesList;
