
import React from 'react';
import { format, addDays, differenceInDays, parseISO } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, MapPinIcon, ClockIcon } from 'lucide-react';
import { Trip, TripDestination } from './TripForm';

interface TripItineraryProps {
  trip: Trip | null;
}

const TripItinerary: React.FC<TripItineraryProps> = ({ trip }) => {
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

  try {
    if (!trip.startDate || !trip.endDate) {
      throw new Error("Trip dates are invalid");
    }

    // Datumsangaben sicher parsen
    const startDate = parseISO(trip.startDate);
    const endDate = parseISO(trip.endDate);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error("Invalid date format");
    }
    
    // Reisedauer berechnen
    const tripDuration = differenceInDays(endDate, startDate) + 1;
    
    // Tagesplan erstellen
    const days = Array.from({ length: tripDuration }).map((_, index) => {
      const date = addDays(startDate, index);
      return { date, dayNumber: index + 1 };
    });

    // Sicherstellen, dass destinations ein Array ist
    const safeDestinations = Array.isArray(trip.destinations) ? trip.destinations : [];
    
    // Reiseziele auf Tage verteilen (einfacher Ansatz)
    const destinationsPerDay = safeDestinations.length > 0 
      ? Math.max(1, Math.ceil(safeDestinations.length / tripDuration))
      : 0;
    
    // Tägliche Reiseroute mit zugewiesenen Reisezielen erstellen
    const itinerary = days.map(day => {
      const dayIndex = day.dayNumber - 1;
      const startDestIndex = dayIndex * destinationsPerDay;
      const endDestIndex = Math.min(startDestIndex + destinationsPerDay, safeDestinations.length);
      
      const dayDestinations = destinationsPerDay > 0 
        ? safeDestinations.slice(startDestIndex, endDestIndex)
        : [];
      
      return {
        ...day,
        destinations: dayDestinations
      };
    });

    return (
      <Card className="overflow-auto max-h-[70vh] md:max-h-[60vh]">
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
                    {day.destinations.map((dest, index) => {
                      if (!dest) return null;
                      
                      const cityName = dest.city || dest.cityName || 'Unknown city';
                      const countryName = dest.country?.name?.common || 
                                         dest.countryName || 'Unknown country';
                      
                      return (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center">
                            <MapPinIcon className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
                            <h4 className="font-medium">
                              {cityName}, {countryName}
                            </h4>
                          </div>
                          
                          {Array.isArray(dest.selectedPOIs) && dest.selectedPOIs.length > 0 ? (
                            <div className="ml-6 space-y-2">
                              {dest.selectedPOIs.map((poi) => {
                                if (!poi || !poi.id) return null;
                                
                                return (
                                  <div key={poi.id} className="flex">
                                    <ClockIcon className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
                                    <div className="flex-1">
                                      <p className="text-sm">{poi.name}</p>
                                      <p className="text-xs text-muted-foreground">
                                        {poi.description?.substring(0, 60)}
                                        {poi.description && poi.description.length > 60 ? '...' : ''}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="ml-6 text-sm text-muted-foreground">
                              Free time to explore {cityName}
                            </p>
                          )}
                        </div>
                      );
                    })}
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
  } catch (error) {
    console.error("Error rendering itinerary:", error);
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Trip Itinerary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-6">
            <p className="text-red-500">There was an error displaying this itinerary</p>
          </div>
        </CardContent>
      </Card>
    );
  }
};

export default TripItinerary;
