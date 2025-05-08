
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Trash2 } from 'lucide-react';
import { TripDestination } from './TripForm';
import type { Country } from '@/services/api';

interface TripDestinationItemProps {
  destination: TripDestination;
  countries: Country[];
  onChange: (changes: Partial<TripDestination>) => void;
  onRemove: () => void;
}

const TripDestinationItem: React.FC<TripDestinationItemProps> = ({ 
  destination, 
  countries, 
  onChange, 
  onRemove 
}) => {
  // Update the country selection to properly set both country and countryName
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCountry = countries.find(c => c.name.common === e.target.value);
    if (selectedCountry) {
      onChange({ 
        country: selectedCountry,
        countryName: selectedCountry.name.common
      });
    }
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm">
      <CardContent className="pt-4 pb-4">
        <div className="flex justify-between items-start mb-1">
          <h4 className="font-medium text-sm text-muted-foreground">
            Destination {destination.countryName ? `- ${destination.countryName}` : ''}
          </h4>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onRemove}
            className="h-8 w-8 p-0"
          >
            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
            <span className="sr-only">Remove destination</span>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
          {/* Country selection */}
          <div className="space-y-2">
            <Label htmlFor={`country-${destination.id}`}>Country</Label>
            <select
              id={`country-${destination.id}`}
              value={destination.countryName || ''}
              onChange={handleCountryChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select a country</option>
              {countries.map((country) => (
                <option key={country.cca3} value={country.name.common}>
                  {country.name.common}
                </option>
              ))}
            </select>
          </div>
          
          {/* City input */}
          <div className="space-y-2">
            <Label htmlFor={`city-${destination.id}`}>City (Optional)</Label>
            <Input
              id={`city-${destination.id}`}
              value={destination.cityName || ''}
              onChange={(e) => onChange({ cityName: e.target.value })}
              placeholder="Main city or area"
            />
          </div>
          
          {/* Duration input */}
          <div className="space-y-2">
            <Label htmlFor={`duration-${destination.id}`}>Duration (days)</Label>
            <Input
              id={`duration-${destination.id}`}
              type="number"
              min="1"
              value={destination.durationDays || ''}
              onChange={(e) => onChange({ durationDays: parseInt(e.target.value) || undefined })}
              placeholder="Number of days"
            />
          </div>
          
          {/* Notes textarea */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor={`notes-${destination.id}`}>Notes (Optional)</Label>
            <Textarea
              id={`notes-${destination.id}`}
              value={destination.notes || ''}
              onChange={(e) => onChange({ notes: e.target.value })}
              placeholder="Add notes about this destination..."
              rows={2}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TripDestinationItem;
