
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { TrashIcon, MapPinIcon, SearchIcon, GlobeIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Country } from '@/services/api';
import tripPlannerApi, { PointOfInterest } from '@/services/tripPlannerApi';
import { TripDestination } from './TripForm';

interface DestinationSelectorProps {
  countries: Country[];
  destination: TripDestination;
  savedCities: Record<string, string[]>;
  onChange: (destination: Partial<TripDestination>) => void;
  onRemove: () => void;
}

const DestinationSelector: React.FC<DestinationSelectorProps> = ({
  countries,
  destination,
  savedCities,
  onChange,
  onRemove
}) => {
  const [isLoadingPOIs, setIsLoadingPOIs] = useState(false);
  const [cityInput, setCityInput] = useState(destination.city || '');

  // Get cities for the selected country
  const citiesForCountry = destination.country?.cca3 
    ? (savedCities[destination.country.cca3] || [])
    : [];

  // Update available POIs when country/city changes
  useEffect(() => {
    if (destination.country && destination.city) {
      setIsLoadingPOIs(true);
      try {
        // Get mock POIs for this city/country
        const pois = tripPlannerApi.getMockPointsOfInterest(
          destination.city,
          destination.country.name.common
        );
        onChange({ pointsOfInterest: pois });
      } catch (error) {
        console.error('Error fetching points of interest:', error);
        onChange({ pointsOfInterest: [] });
      } finally {
        setIsLoadingPOIs(false);
      }
    }
  }, [destination.country, destination.city]);

  // Handle country selection
  const handleCountrySelect = (countryCode: string) => {
    const selectedCountry = countries.find(c => c.cca3 === countryCode);
    if (selectedCountry) {
      onChange({ 
        country: selectedCountry,
        city: '',
        pointsOfInterest: [],
        selectedPOIs: []
      });
      setCityInput('');
    }
  };

  // Handle city selection
  const handleCitySelect = (city: string) => {
    onChange({ city });
  };

  // Handle custom city input
  const handleCitySubmit = () => {
    if (cityInput.trim()) {
      onChange({ city: cityInput.trim() });
    }
  };

  // Handle POI selection
  const handlePOISelect = (poi: PointOfInterest, isChecked: boolean) => {
    const currentSelectedPOIs = [...(destination.selectedPOIs || [])];
    
    if (isChecked) {
      // Add POI if not already in the list
      if (!currentSelectedPOIs.some(p => p.id === poi.id)) {
        currentSelectedPOIs.push(poi);
      }
    } else {
      // Remove POI if in the list
      const index = currentSelectedPOIs.findIndex(p => p.id === poi.id);
      if (index !== -1) {
        currentSelectedPOIs.splice(index, 1);
      }
    }
    
    onChange({ selectedPOIs: currentSelectedPOIs });
  };

  // Get more details about a POI
  const fetchPOIDetails = async (poi: PointOfInterest) => {
    try {
      const wikiData = await tripPlannerApi.getPointOfInterest(poi.name);
      
      // Update the POI with Wikipedia data
      const updatedPOIs = destination.pointsOfInterest.map(p => 
        p.id === poi.id 
          ? { 
              ...p, 
              wikipediaData: wikiData,
              image: wikiData.thumbnail?.source || p.image,
              description: wikiData.extract || p.description,
              link: wikiData.content_urls.desktop.page
            } 
          : p
      );
      
      // Also update selected POIs if necessary
      const updatedSelectedPOIs = destination.selectedPOIs.map(p => 
        p.id === poi.id 
          ? { 
              ...p, 
              wikipediaData: wikiData,
              image: wikiData.thumbnail?.source || p.image,
              description: wikiData.extract || p.description,
              link: wikiData.content_urls.desktop.page
            } 
          : p
      );
      
      onChange({ 
        pointsOfInterest: updatedPOIs,
        selectedPOIs: updatedSelectedPOIs
      });
    } catch (error) {
      console.error('Error fetching POI details:', error);
    }
  };

  return (
    <Card className="border">
      <CardContent className="pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor={`country-${destination.country?.cca3 || 'new'}`}>Country</Label>
            <Select 
              value={destination.country?.cca3} 
              onValueChange={handleCountrySelect}
            >
              <SelectTrigger id={`country-${destination.country?.cca3 || 'new'}`} className="w-[180px] mt-1">
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.cca3} value={country.cca3}>
                    {country.name.common}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onRemove}
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
        
        {destination.country && (
          <div>
            <Label htmlFor="city-input">City</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="city-input"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                placeholder="Enter city name"
                className="flex-1"
              />
              <Button onClick={handleCitySubmit} disabled={!cityInput.trim()}>
                <SearchIcon className="h-4 w-4" />
              </Button>
            </div>
            
            {citiesForCountry.length > 0 && (
              <div className="mt-2">
                <Label>Suggested Cities</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {citiesForCountry.map((city) => (
                    <Button
                      key={city}
                      size="sm"
                      variant="outline"
                      onClick={() => handleCitySelect(city)}
                      className={cn("text-xs", 
                        city === destination.city ? "bg-primary text-primary-foreground" : ""
                      )}
                    >
                      <MapPinIcon className="h-3 w-3 mr-1" />
                      {city}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {destination.city && !isLoadingPOIs && destination.pointsOfInterest.length > 0 && (
          <div className="mt-3">
            <Label>Points of Interest</Label>
            <div className="mt-2 space-y-2">
              {destination.pointsOfInterest.map((poi) => {
                const isSelected = destination.selectedPOIs?.some(p => p.id === poi.id) || false;
                
                return (
                  <div key={poi.id} className="flex items-start gap-2 p-2 border rounded-md">
                    <Checkbox 
                      id={`poi-${poi.id}`}
                      checked={isSelected}
                      onCheckedChange={(checked) => handlePOISelect(poi, !!checked)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <label
                        htmlFor={`poi-${poi.id}`}
                        className="text-sm font-medium leading-none cursor-pointer"
                      >
                        {poi.name}
                      </label>
                      <p className="text-xs text-muted-foreground mt-1">
                        {poi.description?.substring(0, 100)}{poi.description?.length > 100 ? '...' : ''}
                      </p>
                      {!poi.wikipediaData && (
                        <Button 
                          variant="link" 
                          size="sm" 
                          className="p-0 h-auto mt-1 text-xs"
                          onClick={() => fetchPOIDetails(poi)}
                        >
                          <GlobeIcon className="h-3 w-3 mr-1" />
                          Get more info
                        </Button>
                      )}
                      {poi.wikipediaData && poi.link && (
                        <div className="mt-1">
                          <a 
                            href={poi.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline"
                          >
                            <GlobeIcon className="h-3 w-3 inline mr-1" />
                            View on Wikipedia
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {destination.city && isLoadingPOIs && (
          <div className="flex justify-center p-4">
            <p className="text-sm text-muted-foreground">Loading points of interest...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DestinationSelector;
