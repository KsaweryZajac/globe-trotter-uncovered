
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import DestinationSelector from '../DestinationSelector';
import type { Country } from '@/services/api';
import { TripDestination } from '../TripForm';

interface DestinationsListProps {
  destinations: TripDestination[];
  countries: Country[];
  savedCities: Record<string, string[]>;
  addDestination: () => void;
  updateDestination: (index: number, destination: Partial<TripDestination>) => void;
  removeDestination: (index: number) => void;
}

const DestinationsList: React.FC<DestinationsListProps> = ({
  destinations,
  countries,
  savedCities,
  addDestination,
  updateDestination,
  removeDestination
}) => {
  return (
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
              key={destination.id || index}
              destination={destination}
              countries={countries}
              savedCities={savedCities}
              onChange={(updatedDestination) => updateDestination(index, updatedDestination)}
              onRemove={() => removeDestination(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DestinationsList;
