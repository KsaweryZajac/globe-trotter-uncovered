
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trip } from './TripForm';
import { format } from 'date-fns';
import { Edit, Trash2 } from 'lucide-react';

interface TripListProps {
  trips: Trip[];
  onSelectTrip: (trip: Trip) => void;
  onDeleteTrip: (tripId: string) => void;
}

const TripList: React.FC<TripListProps> = ({ trips, onSelectTrip, onDeleteTrip }) => {
  if (trips.length === 0) {
    return (
      <div className="text-center p-8 border border-dashed rounded-lg">
        <h3 className="text-lg font-medium mb-2">No trips saved yet</h3>
        <p className="text-muted-foreground mb-4">
          Start planning your first adventure by creating a new trip.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {trips.map((trip) => {
        const startDate = new Date(trip.startDate);
        const endDate = new Date(trip.endDate);
        
        return (
          <Card key={trip.id} className="hover:bg-accent/5 transition-colors">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-medium">{trip.name}</CardTitle>
                <div className="flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={() => onSelectTrip(trip)}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => onDeleteTrip(trip.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm mb-2">
                <div>
                  <span className="text-muted-foreground">Dates: </span>
                  <span>{format(startDate, "MMM d, yyyy")} - {format(endDate, "MMM d, yyyy")}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Starting from: </span>
                  <span>{trip.startCountry}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Destinations: </span>
                  <span>{trip.destinations.length}</span>
                </div>
                {trip.totalCost && (
                  <div>
                    <span className="text-muted-foreground">Est. cost: </span>
                    <span className="font-medium">${trip.totalCost.toLocaleString()}</span>
                  </div>
                )}
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-2"
                onClick={() => onSelectTrip(trip)}
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default TripList;
