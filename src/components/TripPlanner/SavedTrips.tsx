
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
  if (!trips || !Array.isArray(trips)) {
    console.error("Trips is not an array:", trips);
    return (
      <Card className="shadow-md">
        <CardHeader className="pb-2 bg-muted/30">
          <CardTitle className="text-lg">Your Saved Trips</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="text-center p-4">
            <p className="text-muted-foreground">No trips available</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const handleDeleteTrip = (event: React.MouseEvent, tripId: string) => {
    event.stopPropagation();
    
    if (typeof onDeleteTrip === 'function') {
      onDeleteTrip(tripId);
    } else {
      console.error("onDeleteTrip is not a function");
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2 bg-muted/30">
        <CardTitle className="text-lg flex items-center gap-2">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            className="w-5 h-5 text-primary"
          >
            <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z" />
            <path d="M13.06 15.473a48.45 48.45 0 017.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 01-.46.71 47.878 47.878 0 00-8.105 4.342.75.75 0 01-.832 0 47.877 47.877 0 00-8.104-4.342.75.75 0 01-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 016 13.18v1.27a1.5 1.5 0 00-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 00.551-1.608 1.5 1.5 0 00.14-2.67v-.645a48.549 48.549 0 013.44 1.668 2.25 2.25 0 002.12 0z" />
            <path d="M4.462 19.462c.42-.419.753-.89 1-1.394.453.213.902.434 1.347.661a6.743 6.743 0 01-1.286 1.794.75.75 0 11-1.06-1.06z" />
          </svg>
          Your Saved Trips
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {trips.length === 0 ? (
          <div className="text-center p-8 border border-dashed rounded-lg">
            <p className="text-muted-foreground mb-2">You haven't saved any trips yet.</p>
            <Button variant="outline" onClick={() => document.getElementById('newTripTab')?.click()}>
              Plan Your First Trip
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trips.map((trip) => {
              if (!trip || !trip.id) return null;
              
              let startDate;
              let endDate;
              
              try {
                startDate = parseISO(trip.startDate);
                endDate = parseISO(trip.endDate);
                
                if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                  throw new Error("Invalid date format");
                }
              } catch (error) {
                console.error("Error parsing dates:", error);
                return null;
              }
              
              const safeDestinations = Array.isArray(trip.destinations) ? trip.destinations : [];
              
              return (
                <div 
                  key={trip.id} 
                  className="border rounded-md overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4">
                    <h3 className="font-medium text-lg truncate">{trip.title || trip.name || 'Untitled Trip'}</h3>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <CalendarIcon className="h-3 w-3 mr-1" />
                      {format(startDate, 'MMM d, yyyy')} - {format(endDate, 'MMM d, yyyy')}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="space-y-1 mb-4">
                      {safeDestinations.length > 0 
                        ? safeDestinations.map((dest, index) => {
                            if (!dest) return null;
                            
                            const cityName = dest.city || dest.cityName || '';
                            const countryName = dest.country?.name?.common || dest.countryName || '';
                            
                            if (!cityName && !countryName) return null;
                            
                            return (
                              <div key={index} className="flex items-center text-sm">
                                <MapPinIcon className="h-3 w-3 mr-1 text-muted-foreground flex-shrink-0" />
                                <span className="truncate">
                                  {cityName}{countryName ? (cityName ? `, ${countryName}` : countryName) : ''}
                                </span>
                              </div>
                            );
                          })
                        : (
                          <div className="text-sm text-muted-foreground">No destinations added</div>
                        )
                      }
                    </div>
                    
                    <div className="flex justify-end items-center pt-2 border-t">
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectTrip(trip);
                          }}
                        >
                          <EditIcon className="h-3.5 w-3.5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                          onClick={(e) => handleDeleteTrip(e, trip.id)}
                        >
                          <TrashIcon className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
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
