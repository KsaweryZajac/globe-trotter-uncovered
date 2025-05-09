
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import { PlusIcon, Map, Calendar } from 'lucide-react';
import TripForm, { Trip } from '@/components/TripPlanner/TripForm';
import TripList from '@/components/TripPlanner/TripList';
import TripMap from '@/components/TripPlanner/TripMap';
import TripExportButton from '@/components/TripPlanner/TripExportButton';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from 'sonner';

const TripPlanner = () => {
  const [activeTab, setActiveTab] = useState("create");
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [trips, setTrips] = useLocalStorage<Trip[]>('savedTrips', []);

  // Fetch countries using React Query
  const { data: countries = [], isLoading: isLoadingCountries } = useQuery({
    queryKey: ['countries'],
    queryFn: () => api.getAllCountries()
  });

  // Handle saving a trip
  const handleSaveTrip = (tripData: Trip) => {
    try {
      console.log("Saving trip:", tripData);
      
      // Check if we're updating an existing trip or creating a new one
      const isUpdating = trips.some(t => t.id === tripData.id);
      
      if (isUpdating) {
        // Update existing trip
        const updatedTrips = trips.map(trip => 
          trip.id === tripData.id ? tripData : trip
        );
        setTrips(updatedTrips);
        toast.success("Trip updated successfully");
      } else {
        // Add new trip
        setTrips([...trips, tripData]);
        toast.success("New trip created successfully");
      }
      
      // Switch to the list tab after saving
      setActiveTab("list");
      
      // Clear the selected trip
      setSelectedTrip(null);
    } catch (error) {
      console.error("Error saving trip:", error);
      toast.error("Failed to save trip", {
        description: "There was an error saving your trip. Please try again."
      });
    }
  };

  // Handle selecting a trip to edit
  const handleSelectTrip = (trip: Trip) => {
    setSelectedTrip(trip);
    setActiveTab("create");
  };

  // Handle deleting a trip
  const handleDeleteTrip = (tripId: string) => {
    if (window.confirm("Are you sure you want to delete this trip?")) {
      try {
        const filteredTrips = trips.filter(trip => trip.id !== tripId);
        setTrips(filteredTrips);
        
        // If the deleted trip was selected, clear the selection
        if (selectedTrip && selectedTrip.id === tripId) {
          setSelectedTrip(null);
        }
        
        toast.success("Trip deleted successfully");
      } catch (error) {
        console.error("Error deleting trip:", error);
        toast.error("Failed to delete trip");
      }
    }
  };

  // Function to start a new trip
  const startNewTrip = () => {
    setSelectedTrip(null);
    setActiveTab("create");
  };

  // Display loading state while countries are being fetched
  if (isLoadingCountries) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background/90">
        <Header />
        <div className="container mx-auto py-12 px-4">
          <div className="flex justify-center items-center h-[60vh]">
            <p>Loading trip planner...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/90">
      <Header />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto py-8 px-4 md:py-12"
      >
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Plan Your Perfect Journey
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create detailed travel plans, estimate costs, and organize your trips with ease.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-6">
            <TabsList className="grid grid-cols-2 w-full max-w-md">
              <TabsTrigger value="create" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <PlusIcon className="h-4 w-4 mr-2" />
                {selectedTrip ? 'Edit Trip' : 'Create Trip'}
              </TabsTrigger>
              <TabsTrigger value="list" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                Saved Trips
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="create" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <TripForm 
                  onSaveTrip={handleSaveTrip}
                  initialTrip={selectedTrip || undefined}
                  countries={countries}
                />
              </div>
              
              <div className="lg:col-span-1 space-y-6">
                {selectedTrip && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Trip Details</CardTitle>
                      <CardDescription>
                        Additional information and export options
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <TripExportButton trip={selectedTrip} />
                        
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={startNewTrip}
                        >
                          <PlusIcon className="h-4 w-4 mr-2" />
                          Create New Trip
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {selectedTrip && selectedTrip.destinations.length > 0 && (
                  <TripMap
                    destinations={selectedTrip.destinations}
                    countries={countries}
                  />
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="list">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-primary" />
                      Your Saved Trips
                    </CardTitle>
                    <CardDescription>
                      View and manage your saved trips
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button 
                        onClick={startNewTrip} 
                        variant="default" 
                        className="w-full"
                      >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Create New Trip
                      </Button>
                      
                      <div className="mt-4">
                        <TripList
                          trips={trips}
                          onSelectTrip={handleSelectTrip}
                          onDeleteTrip={handleDeleteTrip}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="lg:col-span-2">
                {selectedTrip ? (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>{selectedTrip.name || selectedTrip.title}</span>
                          <div className="flex space-x-2">
                            <TripExportButton trip={selectedTrip} />
                            <Button
                              onClick={() => handleSelectTrip(selectedTrip)}
                              variant="outline"
                            >
                              Edit Trip
                            </Button>
                          </div>
                        </CardTitle>
                        <CardDescription>
                          {selectedTrip.destinations.length} destinations · ${selectedTrip.totalCost?.toLocaleString() || 'Cost not calculated'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Start Date</h3>
                            <p>{new Date(selectedTrip.startDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">End Date</h3>
                            <p>{new Date(selectedTrip.endDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Starting From</h3>
                            <p>{selectedTrip.startCountry || selectedTrip.homeCountry || "Not specified"}</p>
                          </div>
                        </div>
                        
                        <h3 className="font-medium mt-6 mb-2">Destinations</h3>
                        <ul className="space-y-2">
                          {selectedTrip.destinations.map((destination) => (
                            <li key={destination.id} className="p-3 border rounded-md bg-background/50">
                              <div className="font-medium">{destination.countryName}{destination.cityName ? ` - ${destination.cityName}` : ''}</div>
                              {destination.durationDays && <div className="text-sm text-muted-foreground">Duration: {destination.durationDays} days</div>}
                              {destination.notes && <div className="text-sm mt-1">{destination.notes}</div>}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <TripMap
                      destinations={selectedTrip.destinations}
                      countries={countries}
                    />
                  </div>
                ) : (
                  <Card className="h-full flex items-center justify-center p-10 text-center">
                    <div>
                      <Map className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Trip Selected</h3>
                      <p className="text-muted-foreground mb-4">
                        Select a trip from the list to view its details, or create a new trip.
                      </p>
                      <Button onClick={startNewTrip}>
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Create New Trip
                      </Button>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default TripPlanner;
