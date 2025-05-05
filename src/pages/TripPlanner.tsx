import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import { Plane, Map, Calendar, Search } from 'lucide-react';
import TripForm, { Trip } from '@/components/TripPlanner/TripForm';
import SavedTrips from '@/components/TripPlanner/SavedTrips';
import TripItinerary from '@/components/TripPlanner/TripItinerary';
import TripMap from '@/components/TripPlanner/TripMap';
import TripGallery from '@/components/TripPlanner/TripGallery';
import TripCostEstimate from '@/components/TripPlanner/TripCostEstimate';
import TripExport from '@/components/TripPlanner/TripExport';
import { getAllCountries } from '@/services/api';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

// Define mock trips for SavedTrips component
const mockTrips = [
  {
    id: '1',
    title: 'European Adventure',
    startDate: '2023-06-01',
    endDate: '2023-06-15',
    destinations: []
  },
  {
    id: '2',
    title: 'Asian Exploration',
    startDate: '2023-08-10',
    endDate: '2023-08-25',
    destinations: []
  }
];

const TripPlanner = () => {
  const [activeTab, setActiveTab] = useState("newTrip");
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isEditingTrip, setIsEditingTrip] = useState(false);

  // Fetch countries
  const { data: countries = [] } = useQuery({
    queryKey: ['countries'],
    queryFn: getAllCountries
  });

  // Load saved trips from localStorage
  useEffect(() => {
    const savedTrips = localStorage.getItem('savedTrips');
    if (savedTrips) {
      try {
        const parsedTrips = JSON.parse(savedTrips);
        setTrips(parsedTrips);
      } catch (e) {
        console.error('Failed to parse saved trips', e);
        toast.error('Failed to load your saved trips');
      }
    }
  }, []);

  const createNewTrip = (newTrip: Trip) => {
    // Save the trip to localStorage
    const updatedTrips = isEditingTrip 
      ? trips.map(trip => trip.id === newTrip.id ? newTrip : trip)
      : [...trips, newTrip];
    
    setTrips(updatedTrips);
    setSelectedTrip(newTrip);
    
    // Save to localStorage
    localStorage.setItem('savedTrips', JSON.stringify(updatedTrips));
    
    // Show success message
    toast.success(isEditingTrip ? 'Trip updated successfully' : 'Trip created successfully');
    setIsEditingTrip(false);
    
    // Switch to saved trips tab to see the new trip
    setTimeout(() => {
      setActiveTab('savedTrips');
    }, 500);
  };

  const selectTrip = (trip: Trip) => {
    setSelectedTrip(trip);
    setIsEditingTrip(true);
    setActiveTab('newTrip');
  };

  const viewTrip = (trip: Trip) => {
    setSelectedTrip(trip);
    // Keep on the saved trips tab
  };

  const deleteTrip = (tripId: string) => {
    const updatedTrips = trips.filter(t => t.id !== tripId);
    setTrips(updatedTrips);
    localStorage.setItem('savedTrips', JSON.stringify(updatedTrips));
    
    if (selectedTrip && selectedTrip.id === tripId) {
      setSelectedTrip(null);
    }
    
    toast.success('Trip deleted successfully');
  };

  const startNewTrip = () => {
    setSelectedTrip(null);
    setIsEditingTrip(false);
    setActiveTab('newTrip');
  };

  // Create empty destinations array for initial state
  const emptyDestinations: any[] = [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/90">
      <Header />
      
      <div className="container mx-auto py-8 px-4 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Plan Your Perfect Journey
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover amazing places, create detailed itineraries, and make memories that last a lifetime.
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-6 md:mb-8">
            <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
              <TabsTrigger value="newTrip" id="newTripTab" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <div className="flex items-center gap-2">
                  <Plane className="h-4 w-4" />
                  Plan Trip
                </div>
              </TabsTrigger>
              <TabsTrigger value="savedTrips" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <div className="flex items-center gap-2">
                  <Map className="h-4 w-4" />
                  Saved Trips
                </div>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="newTrip" className="space-y-6 md:space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
              <div className="lg:col-span-1">
                <Card className="shadow-md border border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader className="pb-2 md:pb-4 bg-muted/30">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Plane className="h-5 w-5 text-primary" />
                      {isEditingTrip ? 'Edit Trip' : 'Trip Details'}
                    </CardTitle>
                    <CardDescription>
                      {isEditingTrip ? `Editing "${selectedTrip?.title}"` : 'Enter your trip information'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4 md:pt-6">
                    {isEditingTrip && (
                      <div className="mb-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={startNewTrip}
                          className="text-xs"
                        >
                          Cancel Editing
                        </Button>
                      </div>
                    )}
                    <TripForm 
                      onSaveTrip={createNewTrip}
                      initialTrip={selectedTrip || undefined}
                      countries={countries}
                    />
                  </CardContent>
                </Card>
              </div>
              
              <div className="lg:col-span-2 space-y-6 md:space-y-8">
                <Card className="shadow-md border border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader className="pb-2 md:pb-4 bg-muted/30">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Calendar className="h-5 w-5 text-primary" />
                      Trip Itinerary
                    </CardTitle>
                    <CardDescription>
                      View and customize your trip itinerary
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4 md:pt-6">
                    <TripItinerary trip={selectedTrip} />
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <Card className="shadow-md border border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="pb-2 md:pb-4 bg-muted/30">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Map className="h-5 w-5 text-primary" />
                        Trip Map
                      </CardTitle>
                      <CardDescription>
                        Explore your destination on the map
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4 overflow-hidden max-h-[350px]">
                      <TripMap destinations={selectedTrip?.destinations || emptyDestinations} />
                    </CardContent>
                  </Card>

                  <Card className="shadow-md border border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="pb-2 md:pb-4 bg-muted/30">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-5 h-5 text-primary"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3A5.25 5.25 0 0012 1.5zm-7.5 8.25A3.75 3.75 0 1112 15.75a3.75 3.75 0 013.75-3.75H15a.75.75 0 01.75.75v4.5a.75.75 0 01-.75.75H4.5a.75.75 0 01-.75-.75v-4.5a.75.75 0 01.75-.75h.75z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Trip Gallery
                      </CardTitle>
                      <CardDescription>
                        View photos of your destination
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4 overflow-auto max-h-[350px]">
                      <TripGallery destinations={selectedTrip?.destinations || emptyDestinations} />
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <Card className="shadow-md border border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="pb-2 md:pb-4 bg-muted/30">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-5 h-5 text-primary"
                        >
                          <path
                            d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z"
                          />
                          <path
                            fillRule="evenodd"
                            d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z"
                            clipRule="evenodd"
                          />
                          <path
                            d="M2.25 18a.75.75 0 000 1.5h19.5a.75.75 0 000-1.5H2.25z"
                          />
                        </svg>
                        Cost Estimate
                      </CardTitle>
                      <CardDescription>
                        Estimate the cost of your trip
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4 overflow-auto max-h-[350px]">
                      {selectedTrip ? (
                        <TripCostEstimate 
                          destinations={selectedTrip.destinations} 
                          tripDuration={selectedTrip.startDate && selectedTrip.endDate ? 
                            Math.ceil((new Date(selectedTrip.endDate).getTime() - new Date(selectedTrip.startDate).getTime()) / (1000 * 60 * 60 * 24)) : 7} 
                          homeCountry={selectedTrip.homeCountry}
                        />
                      ) : (
                        <div className="text-center p-6 border border-dashed rounded-lg">
                          <p className="text-muted-foreground">Select or create a trip to see cost estimates</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="shadow-md border border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="pb-2 md:pb-4 bg-muted/30">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-5 h-5 text-primary"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9.75 6.75h-3a3 3 0 00-3 3v7.5a3 3 0 003 3h7.5a3 3 0 003-3v-7.5a3 3 0 00-3-3h-3V1.5a.75.75 0 00-.75-.75h-1.5a.75.75 0 00-.75.75v5.25zm0 0h1.5v5.69l1.72-1.72a.75.75 0 011.06 0l1.06 1.06a.75.75 0 010 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 010-1.06l1.06-1.06a.75.75 0 011.06 0l1.72 1.72V6.75z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Trip Export
                      </CardTitle>
                      <CardDescription>
                        Export your trip details
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4 overflow-auto max-h-[350px]">
                      <TripExport trip={selectedTrip} />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="savedTrips">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-medium">Your Saved Journeys</h2>
              <Button 
                variant="outline"
                size="sm"
                onClick={startNewTrip}
                className="flex items-center gap-1"
              >
                <Plane className="h-4 w-4" />
                Plan New Trip
              </Button>
            </div>
            <SavedTrips 
              trips={trips} 
              onSelectTrip={selectTrip} 
              onDeleteTrip={deleteTrip} 
            />
            
            {selectedTrip && (
              <div className="mt-8 space-y-6">
                <h3 className="text-xl font-medium flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5 text-primary"
                  >
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                  </svg>
                  Trip Details: {selectedTrip.title}
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="shadow-md">
                    <CardHeader className="pb-2 bg-muted/30">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        Trip Itinerary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <TripItinerary trip={selectedTrip} />
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow-md">
                    <CardHeader className="pb-2 bg-muted/30">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Map className="h-5 w-5 text-primary" />
                        Trip Map
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 h-[400px] overflow-hidden">
                      <TripMap destinations={selectedTrip?.destinations || []} />
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="shadow-md md:col-span-1">
                    <CardHeader className="pb-2 bg-muted/30">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-5 h-5 text-primary"
                        >
                          <path
                            d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z"
                          />
                          <path
                            fillRule="evenodd"
                            d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z"
                            clipRule="evenodd"
                          />
                          <path
                            d="M2.25 18a.75.75 0 000 1.5h19.5a.75.75 0 000-1.5H2.25z"
                          />
                        </svg>
                        Cost Estimate
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <TripCostEstimate 
                        destinations={selectedTrip.destinations} 
                        tripDuration={selectedTrip.startDate && selectedTrip.endDate ? 
                          Math.ceil((new Date(selectedTrip.endDate).getTime() - new Date(selectedTrip.startDate).getTime()) / (1000 * 60 * 60 * 24)) : 7}
                        homeCountry={selectedTrip.homeCountry}
                      />
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow-md md:col-span-1">
                    <CardHeader className="pb-2 bg-muted/30">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-5 h-5 text-primary"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3A5.25 5.25 0 0012 1.5zm-7.5 8.25A3.75 3.75 0 1112 15.75a3.75 3.75 0 013.75-3.75H15a.75.75 0 01.75.75v4.5a.75.75 0 01-.75.75H4.5a.75.75 0 01-.75-.75v-4.5a.75.75 0 01.75-.75h.75z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Trip Gallery
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <TripGallery destinations={selectedTrip?.destinations || []} />
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow-md md:col-span-1">
                    <CardHeader className="pb-2 bg-muted/30">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-5 h-5 text-primary"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9.75 6.75h-3a3 3 0 00-3 3v7.5a3 3 0 003 3h7.5a3 3 0 003-3v-7.5a3 3 0 00-3-3h-3V1.5a.75.75 0 00-.75-.75h-1.5a.75.75 0 00-.75.75v5.25zm0 0h1.5v5.69l1.72-1.72a.75.75 0 011.06 0l1.06 1.06a.75.75 0 010 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 010-1.06l1.06-1.06a.75.75 0 011.06 0l1.72 1.72V6.75z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Trip Export
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <TripExport trip={selectedTrip} />
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TripPlanner;
