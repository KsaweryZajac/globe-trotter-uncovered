
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeftIcon, MapIcon, GlobeIcon, PlusIcon } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import TripForm, { Trip } from '@/components/TripPlanner/TripForm';
import SavedTrips from '@/components/TripPlanner/SavedTrips';
import TripMap from '@/components/TripPlanner/TripMap';
import TripItinerary from '@/components/TripPlanner/TripItinerary';
import TripGallery from '@/components/TripPlanner/TripGallery';
import TripExport from '@/components/TripPlanner/TripExport';
import api from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const TripPlanner: React.FC = () => {
  const [activeTab, setActiveTab] = useState('plan');
  const [savedTrips, setSavedTrips] = useLocalStorage<Trip[]>('trips', []);
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
  const { toast } = useToast();

  // Fetch all countries for destination selection
  const { data: countries, isLoading } = useQuery({
    queryKey: ['countries'],
    queryFn: async () => {
      const response = await fetch('https://restcountries.com/v3.1/all');
      if (!response.ok) {
        throw new Error('Failed to fetch countries');
      }
      return response.json();
    }
  });

  // Handle saving a trip
  const handleSaveTrip = (trip: Trip) => {
    // If this is an update to an existing trip
    if (savedTrips.some(t => t.id === trip.id)) {
      setSavedTrips(savedTrips.map(t => t.id === trip.id ? trip : t));
      toast({
        title: 'Trip Updated',
        description: `${trip.title} has been updated successfully.`,
      });
    } else {
      // This is a new trip
      setSavedTrips([...savedTrips, trip]);
      toast({
        title: 'Trip Saved',
        description: `${trip.title} has been saved to your trips.`,
      });
    }
    
    // Update current trip
    setCurrentTrip(trip);
    
    // Switch to itinerary tab
    setActiveTab('itinerary');
  };

  // Handle selecting a trip to edit
  const handleSelectTrip = (trip: Trip) => {
    setCurrentTrip(trip);
    setActiveTab('plan');
  };

  // Handle deleting a trip
  const handleDeleteTrip = (tripId: string) => {
    setSavedTrips(savedTrips.filter(trip => trip.id !== tripId));
    
    // If the current trip is being deleted, reset it
    if (currentTrip && currentTrip.id === tripId) {
      setCurrentTrip(null);
    }
    
    toast({
      title: 'Trip Deleted',
      description: 'The trip has been deleted from your saved trips.',
    });
  };

  // Start a new trip
  const handleNewTrip = () => {
    setCurrentTrip(null);
    setActiveTab('plan');
  };

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-lg bg-background/90 border-b border-border">
        <div className="container py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeftIcon className="h-4 w-4" />
              <span>Back</span>
            </Link>
            <div className="h-5 w-px bg-border mx-2" />
            <div className="flex items-center">
              <MapIcon className="h-5 w-5 mr-2" />
              <h1 className="text-2xl font-bold">Trip Planner</h1>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mt-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="plan">Plan Trip</TabsTrigger>
              <TabsTrigger value="saved">Saved Trips</TabsTrigger>
              <TabsTrigger value="itinerary" disabled={!currentTrip}>Itinerary</TabsTrigger>
              <TabsTrigger value="map" disabled={!currentTrip}>Map</TabsTrigger>
              <TabsTrigger value="gallery" disabled={!currentTrip}>Gallery</TabsTrigger>
            </TabsList>
            
            {currentTrip && (
              <div className="flex items-center gap-2">
                <TripExport trip={currentTrip} />
                <Button variant="outline" onClick={handleNewTrip}>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  New Trip
                </Button>
              </div>
            )}
          </div>

          <TabsContent value="plan" className="mt-4">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <p>Loading countries...</p>
              </div>
            ) : (
              <TripForm 
                onSaveTrip={handleSaveTrip} 
                initialTrip={currentTrip || undefined}
                countries={countries || []}
              />
            )}
          </TabsContent>
          
          <TabsContent value="saved" className="mt-4">
            <SavedTrips 
              trips={savedTrips}
              onSelectTrip={handleSelectTrip}
              onDeleteTrip={handleDeleteTrip}
            />
          </TabsContent>
          
          <TabsContent value="itinerary" className="mt-4">
            {currentTrip ? (
              <TripItinerary trip={currentTrip} />
            ) : (
              <div className="flex flex-col items-center justify-center h-64 gap-4">
                <p className="text-muted-foreground">No trip selected.</p>
                <Button onClick={() => setActiveTab('plan')}>Plan a Trip</Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="map" className="mt-4">
            {currentTrip ? (
              <TripMap destinations={currentTrip.destinations} />
            ) : (
              <div className="flex flex-col items-center justify-center h-64 gap-4">
                <p className="text-muted-foreground">No trip selected.</p>
                <Button onClick={() => setActiveTab('plan')}>Plan a Trip</Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="gallery" className="mt-4">
            {currentTrip ? (
              <TripGallery destinations={currentTrip.destinations} />
            ) : (
              <div className="flex flex-col items-center justify-center h-64 gap-4">
                <p className="text-muted-foreground">No trip selected.</p>
                <Button onClick={() => setActiveTab('plan')}>Plan a Trip</Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="container mt-12 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Culture Explorer - Trip Planner Module</p>
      </footer>
    </div>
  );
};

export default TripPlanner;
