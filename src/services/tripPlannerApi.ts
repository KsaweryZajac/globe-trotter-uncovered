
// Define Points of Interest type
export interface PointOfInterest {
  id: string;
  name: string;
  description: string;
  type: string;
  rating?: number;
}

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
  countries: any[]; // Using any[] for now since the Country type is defined elsewhere
  onSaveTrip: (trip: any) => void;
}

export interface TripMapProps {
  destinations: TripDestination[];
}

export interface TripGalleryProps {
  destinations: TripDestination[];
}

export interface TripCostEstimateProps {
  destinations: any[]; // Using any[] since the actual structure might be different
  tripDuration?: number;
  travelers?: number;
  homeCountry?: string;
}

export interface SavedTripsProps {
  trips: any[];
  onSelectTrip: (trip: any) => void;
  onDeleteTrip: (tripId: string | number) => void;
}

// Mock API functions
const getPointsOfInterest = async (city: string, country: string): Promise<PointOfInterest[]> => {
  // This would normally fetch from an API, but for now we'll return mock data
  return [
    {
      id: '1',
      name: `${city} Museum of Art`,
      description: 'A beautiful museum featuring local and international art',
      type: 'museum',
      rating: 4.5
    },
    {
      id: '2',
      name: `${city} Historical District`,
      description: 'Walk through centuries of history in the old town',
      type: 'district',
      rating: 4.8
    },
    {
      id: '3',
      name: `${city} Central Park`,
      description: 'Relax in this beautiful urban green space',
      type: 'park',
      rating: 4.3
    }
  ];
};

const calculateTripCost = (country: string, duration: number = 7) => {
  // In a real app, this would use real data based on the country's cost of living
  const costs = {
    flights: Math.round(500 + Math.random() * 1000),
    lodging: Math.round(duration * (80 + Math.random() * 200)),
    food: Math.round(duration * (30 + Math.random() * 70)),
    activities: Math.round(duration * (20 + Math.random() * 50))
  };
  
  return costs;
};

// Export functions as a named export
export const tripPlannerApi = {
  getPointsOfInterest,
  calculateTripCost
};

// Also export as default for backward compatibility
export default tripPlannerApi;
