
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowLeftIcon, MapIcon, GlobeIcon, PlusIcon, PlaneIcon, MapPinIcon } from 'lucide-react';
import Header from '@/components/Header';
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

  // Fetch all countries for destination selection, sorted alphabetically
  const { data: countries, isLoading } = useQuery({
    queryKey: ['countries'],
    queryFn: async () => {
      const response = await fetch('https://restcountries.com/v3.1/all');
      if (!response.ok) {
        throw new Error('Failed to fetch countries');
      }
      const data = await response.json();
      return data.sort((a: any, b: any) => a.name.common.localeCompare(b.name.common));
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
    <div className="min-h-screen pb-8 bg-gradient-to-b from-background to-background/90">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 py-8 px-4 mb-8">
        <div className="container max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Travel Planner
              </h1>
              <p className="text-muted-foreground max-w-xl">
                Plan your next adventure, organize your itinerary, and explore destinations around the world.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-3">
              {currentTrip ? (
                <>
                  <TripExport trip={currentTrip} />
                  <Button variant="outline" onClick={handleNewTrip} className="flex items-center">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    New Trip
                  </Button>
                </>
              ) : (
                <Button onClick={() => setActiveTab('plan')} className="flex items-center">
                  <AirplaneIcon className="h-4 w-4 mr-2" />
                  Start Planning
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container max-w-7xl mx-auto px-4">
        <Card className="border border-border/50 shadow-md bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2 border-b">
            <CardTitle className="flex items-center gap-2">
              {activeTab === 'plan' && <PlusIcon className="h-5 w-5 text-primary" />}
              {activeTab === 'saved' && <MapPinIcon className="h-5 w-5 text-primary" />}
              {activeTab === 'itinerary' && <AirplaneIcon className="h-5 w-5 text-primary" />}
              {activeTab === 'map' && <MapIcon className="h-5 w-5 text-primary" />}
              {activeTab === 'gallery' && <GlobeIcon className="h-5 w-5 text-primary" />}
              {activeTab === 'plan' && 'Plan Your Trip'}
              {activeTab === 'saved' && 'Your Saved Trips'}
              {activeTab === 'itinerary' && 'Trip Itinerary'}
              {activeTab === 'map' && 'Destinations Map'}
              {activeTab === 'gallery' && 'Travel Gallery'}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-6"
            >
              <TabsList className="bg-muted/50 p-1 rounded-lg mb-6">
                <TabsTrigger value="plan" className="flex items-center">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Plan
                </TabsTrigger>
                <TabsTrigger value="saved" className="flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-2" />
                  Saved
                </TabsTrigger>
                <TabsTrigger value="itinerary" className="flex items-center" disabled={!currentTrip}>
                  <AirplaneIcon className="h-4 w-4 mr-2" />
                  Itinerary
                </TabsTrigger>
                <TabsTrigger value="map" className="flex items-center" disabled={!currentTrip}>
                  <MapIcon className="h-4 w-4 mr-2" />
                  Map
                </TabsTrigger>
                <TabsTrigger value="gallery" className="flex items-center" disabled={!currentTrip}>
                  <GlobeIcon className="h-4 w-4 mr-2" />
                  Gallery
                </TabsTrigger>
              </TabsList>

              <TabsContent value="plan" className="mt-4">
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                      <p className="text-muted-foreground">Loading countries...</p>
                    </div>
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
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="container mt-12 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Culture Explorer - Zajac Ksawery</p>
      </footer>
    </div>
  );
};

export default TripPlanner;
