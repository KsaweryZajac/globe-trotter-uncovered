
import React from 'react';
import { TripDestination } from './TripForm';
import TripDestinationItem from './TripDestinationItem';
import type { Country } from '@/services/api';

interface DestinationSelectorProps {
  destination: TripDestination;
  countries: Country[];
  savedCities: Record<string, string[]>;
  onChange: (destination: Partial<TripDestination>) => void;
  onRemove: () => void;
}

const DestinationSelector: React.FC<DestinationSelectorProps> = ({
  destination,
  countries,
  savedCities,
  onChange,
  onRemove
}) => {
  return (
    <TripDestinationItem
      destination={destination}
      countries={countries}
      onChange={onChange}
      onRemove={onRemove}
    />
  );
};

export default DestinationSelector;
