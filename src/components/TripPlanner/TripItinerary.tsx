
import React from 'react';
import { format, addDays, differenceInDays, parseISO } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, MapPinIcon, ClockIcon } from 'lucide-react';
import { Trip, TripDestination } from './TripForm';

interface TripItineraryProps {
  trip: Trip | null;
}

const TripItinerary: React.FC<TripItineraryProps> = ({ trip }) => {
  // If no trip is selected, show a placeholder
  if (!trip) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Trip Itinerary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-6 text-center">
            <p className="text-muted-foreground">
              No trip selected. Please create or select a trip to view the itinerary.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate trip duration
  const startDate = parseISO(trip.startDate);
  const endDate = parseISO(trip.endDate);
  const tripDuration = differenceInDays(endDate, startDate) + 1;
  
  // Create a day-by-day itinerary
  const days = Array.from({ length: tripDuration }).map((_, index) => {
    const date = addDays(startDate, index);
    return { date, dayNumber: index + 1 };
  });

  // Distribute destinations across days (simple approach)
  const destinationsPerDay = Math.max(1, Math.ceil(trip.destinations.length / tripDuration));
  
  // Generate day-by-day itinerary with destinations assigned to specific days
  const itinerary = days.map(day => {
    const dayIndex = day.dayNumber - 1;
    const startDestIndex = dayIndex * destinationsPerDay;
    const endDestIndex = Math.min(startDestIndex + destinationsPerDay, trip.destinations.length);
    
    // Get destinations for this day
    const dayDestinations = trip.destinations.slice(startDestIndex, endDestIndex);
    
    return {
      ...day,
      destinations: dayDestinations
    };
  });

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Trip Itinerary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {itinerary.map((day) => (
            <div key={day.dayNumber} className="pb-4 border-b last:border-0 last:pb-0">
              <div className="flex items-center mb-3">
                <CalendarIcon className="h-5 w-5 mr-2 text-muted-foreground" />
                <h3 className="font-medium">
                  Day {day.dayNumber} - {format(day.date, 'EEEE, MMMM d, yyyy')}
                </h3>
              </div>
              
              {day.destinations.length > 0 ? (
                <div className="space-y-4 pl-7">
                  {day.destinations.map((dest, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center">
                        <MapPinIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                        <h4 className="font-medium">{dest.city}, {dest.country.name.common}</h4>
                      </div>
                      
                      {dest.selectedPOIs && dest.selectedPOIs.length > 0 ? (
                        <div className="ml-6 space-y-2">
                          {dest.selectedPOIs.map((poi, poiIndex) => (
                            <div key={poi.id} className="flex">
                              <ClockIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                              <div>
                                <p className="text-sm">{poi.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {poi.description?.substring(0, 60)}
                                  {poi.description && poi.description.length > 60 ? '...' : ''}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="ml-6 text-sm text-muted-foreground">
                          Free time to explore {dest.city}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground ml-7">
                  No destinations planned for this day
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TripItinerary;
