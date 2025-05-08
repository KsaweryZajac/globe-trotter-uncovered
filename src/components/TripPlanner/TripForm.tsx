
import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { differenceInDays } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import type { Country } from '@/services/api';
import { PointOfInterest } from '@/services/tripPlannerApi';
import DestinationSelector from './DestinationSelector';
import TripCostSummary from './TripCostSummary';
import TripTitleInput from './FormComponents/TripTitleInput';
import HomeCountrySelector from './FormComponents/HomeCountrySelector';
import DateRangePicker from './FormComponents/DateRangePicker';
import DestinationsList from './FormComponents/DestinationsList';

export interface TripDestination {
  id: string;
  country: Country;
  countryName: string;
  city: string;
  cityName?: string;
  pointsOfInterest: PointOfInterest[];
  selectedPOIs: PointOfInterest[];
  durationDays?: number;
  notes?: string;
}

export interface Trip {
  id: string;
  name: string;
  title: string;
  startDate: string;
  endDate: string;
  homeCountry?: string;
  startCountry?: string;
  destinations: TripDestination[];
  totalCost?: number;
}

interface TripFormProps {
  onSaveTrip: (trip: Trip) => void;
  initialTrip?: Trip;
  countries: Country[];
}

const TripForm: React.FC<TripFormProps> = ({ onSaveTrip, initialTrip, countries }) => {
  const [savedCities] = useLocalStorage<Record<string, string[]>>('savedCities', {});

  const [tripTitle, setTripTitle] = useState(initialTrip?.title || initialTrip?.name || '');
  const [homeCountry, setHomeCountry] = useState<string>(initialTrip?.homeCountry || initialTrip?.startCountry || '');
  const [startDate, setStartDate] = useState<Date | undefined>(
    initialTrip?.startDate ? new Date(initialTrip.startDate) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    initialTrip?.endDate ? new Date(initialTrip.endDate) : undefined
  );
  const [destinations, setDestinations] = useState<TripDestination[]>(
    initialTrip?.destinations || []
  );
  const [totalCost, setTotalCost] = useState<number>(initialTrip?.totalCost || 0);

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

    const newDestination: TripDestination = {
      id: Date.now().toString(),
      country: defaultCountry,
      countryName: defaultCountry.name.common,
      city: '',
      cityName: '',
      pointsOfInterest: [],
      selectedPOIs: [],
      durationDays: undefined,
      notes: ''
    };

    setDestinations([...destinations, newDestination]);
  };

  // Update a destination
  const updateDestination = (index: number, destination: Partial<TripDestination>) => {
    const newDestinations = [...destinations];
    
    // If country is updated, also update countryName
    if (destination.country) {
      destination.countryName = destination.country.name.common;
    }
    
    newDestinations[index] = { ...newDestinations[index], ...destination };
    setDestinations(newDestinations);
  };

  // Remove a destination
  const removeDestination = (index: number) => {
    const newDestinations = [...destinations];
    newDestinations.splice(index, 1);
    setDestinations(newDestinations);
  };

  // Update total cost when destinations change
  useEffect(() => {
    if (destinations.length > 0 && startDate && endDate) {
      // Calculate total cost based on destinations
      const tripDuration = Math.max(1, differenceInDays(endDate, startDate) + 1);
      
      // Simple cost calculation logic - can be enhanced
      let calculatedCost = 0;
      
      destinations.forEach(destination => {
        const destDuration = destination.durationDays || Math.ceil(tripDuration / destinations.length);
        // Base cost per destination
        const baseCost = 100 * destDuration;
        calculatedCost += baseCost;
      });
      
      // Add fixed costs (flights, etc.)
      calculatedCost += 500;
      
      setTotalCost(calculatedCost);
    }
  }, [destinations, startDate, endDate]);

  // Save the trip
  const handleSaveTrip = () => {
    if (!startDate || !endDate || destinations.length === 0 || !tripTitle) {
      return;
    }

    const trip: Trip = {
      id: initialTrip?.id || Date.now().toString(),
      name: tripTitle,
      title: tripTitle,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      homeCountry: homeCountry,
      startCountry: homeCountry,
      destinations,
      totalCost
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Plan Your Trip</CardTitle>
          <CardDescription>Fill in the details to create your personalized travel itinerary</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <TripTitleInput 
            title={tripTitle} 
            setTitle={setTripTitle} 
          />
          
          <HomeCountrySelector 
            homeCountry={homeCountry} 
            setHomeCountry={setHomeCountry} 
            countries={sortedCountries} 
          />
          
          <DateRangePicker 
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
          />

          <DestinationsList
            destinations={destinations}
            countries={countries}
            savedCities={savedCities}
            addDestination={addDestination}
            updateDestination={updateDestination}
            removeDestination={removeDestination}
          />

          {/* Cost summary */}
          {destinations.length > 0 && tripDuration > 0 && (
            <TripCostSummary 
              destinations={destinations} 
              startDate={startDate}
              endDate={endDate}
              totalCost={totalCost}
            />
          )}

          <div className="flex justify-end pt-2">
            <Button
              onClick={handleSaveTrip}
              disabled={!tripTitle || !startDate || !endDate || destinations.length === 0}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Trip
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TripForm;
