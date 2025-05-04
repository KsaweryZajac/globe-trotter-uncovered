
// If this file doesn't exist yet, create it with proper type definitions
export interface TripDestination {
  name: {
    common: string;
    official: string;
  };
  capital?: string[];
  region: string;
  flag: string;
}

export interface TripFormProps {
  countries: TripDestination[];
  onSaveTrip: (trip: any) => void;
}

export interface TripMapProps {
  destinations: TripDestination[];
}

export interface TripGalleryProps {
  destinations: TripDestination[];
}

export interface TripCostEstimateProps {
  destinations: TripDestination[];
  duration?: number;
  travelers?: number;
}

export interface SavedTripsProps {
  trips: any[];
  onSelectTrip: (trip: any) => void;
  onDeleteTrip: (tripId: string | number) => void;
}
