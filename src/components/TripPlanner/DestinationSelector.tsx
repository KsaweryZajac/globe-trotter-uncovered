
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { TrashIcon } from 'lucide-react';
import { Country } from '@/services/api';
import { PointOfInterest } from '@/services/tripPlannerApi';
import tripPlannerApi from '@/services/tripPlannerApi';

interface DestinationSelectorProps {
  countries: Country[];
  destination: {
    country: Country;
    city: string;
    pointsOfInterest: PointOfInterest[];
    selectedPOIs: PointOfInterest[];
  };
  savedCities: Record<string, string[]>;
  onChange: (destination: Partial<{
    country: Country;
    city: string;
    pointsOfInterest: PointOfInterest[];
    selectedPOIs: PointOfInterest[];
  }>) => void;
  onRemove: () => void;
}

const DestinationSelector: React.FC<DestinationSelectorProps> = ({
  countries,
  destination,
  savedCities,
  onChange,
  onRemove,
}) => {
  const [isLoadingPOIs, setIsLoadingPOIs] = useState(false);
  const [suggestedCities, setSuggestedCities] = useState<string[]>([]);
  
  // Sort countries alphabetically
  const sortedCountries = [...countries].sort((a, b) => 
    a.name.common.localeCompare(b.name.common)
  );

  // Get suggested cities for selected country
  useEffect(() => {
    if (destination.country?.name?.common) {
      const countryName = destination.country.name.common;
      const cities = savedCities[countryName] || [];
      
      // Add the capital if available
      if (destination.country.capital && destination.country.capital.length > 0) {
        const capital = destination.country.capital[0];
        if (!cities.includes(capital)) {
          cities.unshift(capital);
        }
      }
      
      setSuggestedCities(cities);
    }
  }, [destination.country, savedCities]);

  // Fetch points of interest when city is selected
  useEffect(() => {
    const fetchPointsOfInterest = async () => {
      if (!destination.city || !destination.country?.name?.common) return;
      
      setIsLoadingPOIs(true);
      try {
        // Use the real data fetching function instead of mock data
        const pois = await tripPlannerApi.getPointsOfInterest(destination.city, destination.country.name.common);
        onChange({ pointsOfInterest: pois });
      } catch (error) {
        console.error('Error fetching points of interest:', error);
      } finally {
        setIsLoadingPOIs(false);
      }
    };
    
    fetchPointsOfInterest();
  }, [destination.city, destination.country]);

  // Handle country selection
  const handleCountrySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryCode = e.target.value;
    const selectedCountry = countries.find(c => c.cca3 === countryCode);
    
    if (selectedCountry) {
      onChange({ 
        country: selectedCountry,
        city: '', // Reset city when country changes
        pointsOfInterest: [], // Reset POIs
        selectedPOIs: [] // Reset selected POIs
      });
    }
  };

  // Handle city input
  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ city: e.target.value });
  };

  // Toggle POI selection
  const togglePOI = (poi: PointOfInterest) => {
    const isSelected = destination.selectedPOIs.some(p => p.id === poi.id);
    
    if (isSelected) {
      onChange({
        selectedPOIs: destination.selectedPOIs.filter(p => p.id !== poi.id)
      });
    } else {
      onChange({
        selectedPOIs: [...destination.selectedPOIs, poi]
      });
    }
  };

  return (
    <Card className="border border-border">
      <CardContent className="pt-4 pb-4">
        <div className="grid grid-cols-[1fr_auto] gap-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="country">Country</Label>
                <select
                  id="country"
                  value={destination.country?.cca3 || ''}
                  onChange={handleCountrySelect}
                  className="w-full px-3 py-2 mt-1 border rounded-md"
                >
                  {sortedCountries.map((country) => (
                    <option key={country.cca3} value={country.cca3}>
                      {country.name.common}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  list="city-suggestions"
                  value={destination.city}
                  onChange={handleCityChange}
                  placeholder="Enter city name"
                  className="mt-1"
                />
                <datalist id="city-suggestions">
                  {suggestedCities.map((city, index) => (
                    <option key={index} value={city} />
                  ))}
                </datalist>
              </div>
            </div>
            
            {isLoadingPOIs ? (
              <div className="text-center py-2">
                <p className="text-sm text-muted-foreground">Loading attractions...</p>
              </div>
            ) : destination.pointsOfInterest.length > 0 ? (
              <div>
                <Label className="mb-2 block">Points of Interest</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-2">
                  {destination.pointsOfInterest.map((poi) => (
                    <div key={poi.id} className="flex items-start space-x-2">
                      <Checkbox
                        id={`poi-${poi.id}`}
                        checked={destination.selectedPOIs.some(p => p.id === poi.id)}
                        onCheckedChange={() => togglePOI(poi)}
                      />
                      <div>
                        <Label 
                          htmlFor={`poi-${poi.id}`} 
                          className="font-medium cursor-pointer"
                        >
                          {poi.name}
                        </Label>
                        <p className="text-sm text-muted-foreground">{poi.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : destination.city ? (
              <p className="text-sm text-muted-foreground">No points of interest found.</p>
            ) : null}
          </div>
          
          <div>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={onRemove}
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DestinationSelector;
