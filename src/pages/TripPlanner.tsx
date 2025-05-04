import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import { PlaneIcon, MapIcon, CalendarIcon } from 'lucide-react';
import TripForm from '@/components/TripPlanner/TripForm';
import SavedTrips from '@/components/TripPlanner/SavedTrips';
import TripItinerary from '@/components/TripPlanner/TripItinerary';
import TripMap from '@/components/TripPlanner/TripMap';
import TripGallery from '@/components/TripPlanner/TripGallery';
import TripCostEstimate from '@/components/TripPlanner/TripCostEstimate';
import TripExport from '@/components/TripPlanner/TripExport';
import DestinationSelector from '@/components/TripPlanner/DestinationSelector';

const TripPlanner = () => {
  const [activeTab, setActiveTab] = useState("newTrip");
  const [trip, setTrip] = useState({
    destination: '',
    startDate: new Date(),
    endDate: new Date(),
    budget: 1000,
    interests: [],
  });
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [isDestinationModalOpen, setIsDestinationModalOpen] = useState(false);

  const openDestinationModal = () => setIsDestinationModalOpen(true);
  const closeDestinationModal = () => setIsDestinationModalOpen(false);

  const handleDestinationSelect = (destination: string) => {
    setTrip({ ...trip, destination });
    closeDestinationModal();
  };

  const createNewTrip = (newTrip) => {
    // Logic to save the new trip
    console.log('New trip created:', newTrip);
    setTrip(newTrip);
    setSelectedTrip(newTrip);
  };

  const selectTrip = (trip) => {
    // Logic to load a saved trip
    console.log('Trip selected:', trip);
    setTrip(trip);
    setSelectedTrip(trip);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/90">
      <Header title="Trip Planner" subtitle="Plan your next adventure" icon={<PlaneIcon className="w-6 h-6" />} />
      
      <div className="container mx-auto py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Plan Your Perfect Journey
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover amazing places, create detailed itineraries, and make memories that last a lifetime.
          </p>
        </motion.div>

        <Tabs defaultValue="newTrip" className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-8">
            <TabsTrigger value="newTrip" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <div className="flex items-center gap-2">
                <PlaneIcon className="h-4 w-4" />
                Plan New Trip
              </div>
            </TabsTrigger>
            <TabsTrigger value="savedTrips" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <div className="flex items-center gap-2">
                <MapIcon className="h-4 w-4" />
                Saved Trips
              </div>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="newTrip" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="md:col-span-1 shadow-md border border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PlaneIcon className="h-5 w-5 text-primary" />
                    Trip Details
                  </CardTitle>
                  <CardDescription>
                    Enter your trip information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TripForm onSubmit={createNewTrip} />
                </CardContent>
              </Card>
              
              <div className="md:col-span-2 space-y-8">
                <Card className="shadow-md border border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5 text-primary" />
                      Trip Itinerary
                    </CardTitle>
                    <CardDescription>
                      View and customize your trip itinerary
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TripItinerary trip={selectedTrip} />
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card className="shadow-md border border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapIcon className="h-5 w-5 text-primary" />
                        Trip Map
                      </CardTitle>
                      <CardDescription>
                        Explore your destination on the map
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <TripMap destination={trip.destination} />
                    </CardContent>
                  </Card>

                  <Card className="shadow-md border border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
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
                    <CardContent>
                      <TripGallery destination={trip.destination} />
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card className="shadow-md border border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-5 h-5 text-primary"
                        >
                          <path
                            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM16.219 8.906a.75.75 0 00-1.06 0l-3.219 3.219-3.219-3.22a.75.75 0 00-1.061 1.06l3.22 3.219-3.22 3.22a.75.75 0 001.061 1.06l3.219-3.22 3.219 3.22a.75.75 0 001.06-1.06l-3.22-3.219 3.22-3.22a.75.75 0 000-1.06z"
                          />
                        </svg>
                        Cost Estimate
                      </CardTitle>
                      <CardDescription>
                        Estimate the cost of your trip
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <TripCostEstimate budget={trip.budget} />
                    </CardContent>
                  </Card>

                  <Card className="shadow-md border border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-5 h-5 text-primary"
                        >
                          <path
                            fillRule="evenodd"
                            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm14.024-.983a1.125 1.125 0 010 1.966l-5.603 3.113A1.125 1.125 0 019 15.93l-.292-.29a1.125 1.125 0 011.587-1.587l.292.29 2.312-1.281a.75.75 0 00.524-.419l5.603-3.113a1.125 1.125 0 011.966 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Trip Export
                      </CardTitle>
                      <CardDescription>
                        Export your trip details
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <TripExport trip={selectedTrip} />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="savedTrips">
            <SavedTrips onSelectTrip={selectTrip} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TripPlanner;
