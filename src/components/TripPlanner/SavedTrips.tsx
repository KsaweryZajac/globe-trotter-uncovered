
import React from 'react';
import { format, parseISO } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EditIcon, TrashIcon, CalendarIcon, MapPinIcon } from 'lucide-react';
import { Trip } from './TripForm';

interface SavedTripsProps {
  trips: Trip[];
  onSelectTrip: (trip: Trip) => void;
  onDeleteTrip: (tripId: string) => void;
}

const SavedTrips: React.FC<SavedTripsProps> = ({ trips, onSelectTrip, onDeleteTrip }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Your Saved Trips</CardTitle>
      </CardHeader>
      <CardContent>
        {trips.length === 0 ? (
          <div className="text-center p-4">
            <p className="text-muted-foreground">You haven't saved any trips yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {trips.map((trip) => {
              const startDate = parseISO(trip.startDate);
              const endDate = parseISO(trip.endDate);
              
              return (
                <div 
                  key={trip.id} 
                  className="border rounded-md p-3 hover:bg-muted/50 transition"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{trip.title}</h3>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6"
                        onClick={() => onSelectTrip(trip)}
                      >
                        <EditIcon className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-destructive"
                        onClick={() => onDeleteTrip(trip.id)}
                      >
                        <TrashIcon className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-xs text-muted-foreground mt-2">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    {format(startDate, 'MMM d, yyyy')} - {format(endDate, 'MMM d, yyyy')}
                  </div>
                  
                  <div className="mt-2 space-y-1">
                    {trip.destinations.map((dest, index) => (
                      <div key={index} className="flex items-center text-xs">
                        <MapPinIcon className="h-3 w-3 mr-1 text-muted-foreground" />
                        {dest.city}, {dest.country.name.common}
                        {index < trip.destinations.length - 1 && <span className="mx-1">→</span>}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SavedTrips;
