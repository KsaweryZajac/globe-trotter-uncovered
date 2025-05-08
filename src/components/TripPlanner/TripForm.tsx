import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { format, addDays, differenceInDays } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { CalendarIcon, PlusIcon, SaveIcon, TrashIcon, HomeIcon } from 'lucide-react';
import type { Country } from '@/services/api';
import { PointOfInterest } from '@/services/tripPlannerApi';
import DestinationSelector from './DestinationSelector';
import TripCostEstimate from './TripCostEstimate';

export interface TripDestination {
  country: Country;
  city: string;
  pointsOfInterest: PointOfInterest[];
  selectedPOIs: PointOfInterest[];
}

export interface Trip {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  homeCountry?: string;
  destinations: TripDestination[];
}

interface TripFormProps {
  onSaveTrip: (trip: Trip) => void;
  initialTrip?: Trip;
  countries: Country[];
}

const TripForm: React.FC<TripFormProps> = ({ onSaveTrip, initialTrip, countries }) => {
  const [savedCities] = useLocalStorage<Record<string, string[]>>('savedCities', {});

  const [tripTitle, setTripTitle] = useState(initialTrip?.title || '');
  const [homeCountry, setHomeCountry] = useState<string>(initialTrip?.homeCountry || '');
  const [startDate, setStartDate] = useState<Date | undefined>(
    initialTrip?.startDate ? new Date(initialTrip.startDate) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    initialTrip?.endDate ? new Date(initialTrip.endDate) : undefined
  );
  const [destinations, setDestinations] = useState<TripDestination[]>(
    initialTrip?.destinations || []
  );

  // Sort countries alphabetically
  const sortedCountries = [...countries].sort((a, b) => 
    a.name.common.localeCompare(b.name.common)
  );

  // Add a new destination
  const addDestination = () => {
    // Use the most recent country if a destination exists, otherwise use first country
    const lastDestination = destinations.length > 0 ? destinations[destinations.length - 1] : null;
    const defaultCountry = lastDestination ? lastDestination.country : sortedCountries[0];

    if (!defaultCountry) return; // Guard against empty countries array

    setDestinations([...destinations, {
      country: defaultCountry,
      city: '',
      pointsOfInterest: [],
      selectedPOIs: []
    }]);
  };

  // Update a destination
  const updateDestination = (index: number, destination: Partial<TripDestination>) => {
    const newDestinations = [...destinations];
    newDestinations[index] = { ...newDestinations[index], ...destination };
    setDestinations(newDestinations);
  };

  // Remove a destination
  const removeDestination = (index: number) => {
    const newDestinations = [...destinations];
    newDestinations.splice(index, 1);
    setDestinations(newDestinations);
  };

  // Save the trip
  const handleSaveTrip = () => {
    if (!startDate || !endDate || destinations.length === 0 || !tripTitle) {
      return;
    }

    const trip: Trip = {
      id: initialTrip?.id || Date.now().toString(),
      title: tripTitle,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      homeCountry: homeCountry,
      destinations
    };

    // Ensure onSaveTrip is a function before calling it
    if (typeof onSaveTrip === 'function') {
      onSaveTrip(trip);
    } else {
      console.error('onSaveTrip is not a function');
    }
  };

  // Get the trip duration in days
  const tripDuration = startDate && endDate ? 
    Math.max(1, differenceInDays(endDate, startDate) + 1) : 0;

  // Handle home country change
  const handleHomeCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setHomeCountry(e.target.value);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Plan Your Trip</CardTitle>
          <CardDescription>Fill in the details to create your personalized travel itinerary</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="trip-title">Trip Title</Label>
            <Input 
              id="trip-title"
              placeholder="My Amazing Adventure"
              value={tripTitle}
              onChange={(e) => setTripTitle(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="home-country" className="flex items-center">
              <HomeIcon className="h-4 w-4 mr-1" />
              Your Home Country
            </Label>
            <select
              id="home-country"
              value={homeCountry}
              onChange={handleHomeCountryChange}
              className="w-full px-3 py-2 mt-1 border rounded-md"
            >
              <option value="">-- Select your home country --</option>
              {sortedCountries.map((country) => (
                <option key={country.cca3} value={country.name.common}>
                  {country.name.common}
                </option>
              ))}
            </select>
            <p className="text-sm text-muted-foreground mt-1">
              This helps us calculate flight costs and provide relevant travel information
            </p>
          </div>
          
          <div className="flex flex-col space-y-4">
            <div>
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal mt-1",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal mt-1",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date) => startDate ? date < startDate : false}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Destinations</Label>
              <Button 
                variant="outline" 
                size="sm"
                onClick={addDestination}
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Destination
              </Button>
            </div>
            
            {destinations.length === 0 ? (
              <div className="text-center p-4 border border-dashed rounded-md">
                <p className="text-muted-foreground">No destinations added yet.</p>
                <Button 
                  variant="outline" 
                  className="mt-2"
                  onClick={addDestination}
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Your First Destination
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {destinations.map((destination, index) => (
                  <DestinationSelector
                    key={index}
                    countries={countries}
                    destination={destination}
                    savedCities={savedCities}
                    onChange={(updatedDestination) => updateDestination(index, updatedDestination)}
                    onRemove={() => removeDestination(index)}
                  />
                ))}
              </div>
            )}
          </div>

          {destinations.length > 0 && tripDuration > 0 && (
            <TripCostEstimate 
              destinations={destinations} 
              tripDuration={tripDuration}
              homeCountry={homeCountry}
            />
          )}

          <div className="flex justify-end pt-2">
            <Button
              onClick={handleSaveTrip}
              disabled={!tripTitle || !startDate || !endDate || destinations.length === 0}
            >
              <SaveIcon className="h-4 w-4 mr-2" />
              Save Trip
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TripForm;
