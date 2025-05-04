
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ExternalLinkIcon, PlaneIcon, BedDoubleIcon, UtensilsIcon, MapPinIcon } from 'lucide-react';
import { tripPlannerApi } from '@/services/tripPlannerApi';
import { TripDestination } from './TripForm';

interface TripCostEstimateProps {
  destinations: TripDestination[];
  tripDuration: number;
  homeCountry?: string;
}

const TripCostEstimate: React.FC<TripCostEstimateProps> = ({ destinations, tripDuration, homeCountry }) => {
  // Store manually entered costs
  const [manualCosts, setManualCosts] = useState<Record<string, Record<string, number>>>({});
  
  // Calculate costs for each destination
  const costs = destinations.map(dest => {
    const destinationKey = `${dest.country?.cca3 || 'unknown'}_${dest.city || 'unknown'}`;
    const countryName = dest.country?.name?.common || '';
    const autoEstimate = tripPlannerApi.calculateTripCost(countryName, tripDuration);
    
    return {
      destination: `${dest.city || ''}, ${countryName}`,
      country: dest.country,
      city: dest.city || '',
      key: destinationKey,
      estimate: {
        flights: manualCosts[destinationKey]?.flights !== undefined ? manualCosts[destinationKey].flights : autoEstimate.flights,
        lodging: manualCosts[destinationKey]?.lodging !== undefined ? manualCosts[destinationKey].lodging : autoEstimate.lodging,
        food: manualCosts[destinationKey]?.food !== undefined ? manualCosts[destinationKey].food : autoEstimate.food,
        activities: manualCosts[destinationKey]?.activities !== undefined ? manualCosts[destinationKey].activities : autoEstimate.activities,
        get total() {
          return this.flights + this.lodging + this.food + this.activities;
        }
      }
    };
  });

  // Calculate total costs
  const totalCost = costs.reduce(
    (total, item) => total + item.estimate.total,
    0
  );

  // Handle manual cost input
  const handleCostChange = (destinationKey: string, category: string, value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    if (isNaN(numValue)) return;
    
    setManualCosts(prev => ({
      ...prev,
      [destinationKey]: {
        ...prev[destinationKey],
        [category]: numValue
      }
    }));
  };

  // Generate external links
  const getFlightsLink = (destination: TripDestination) => {
    const from = encodeURIComponent(homeCountry || '');
    const to = encodeURIComponent(destination.country?.name?.common || '');
    return `https://www.google.com/travel/flights?q=Flights%20from%20${from}%20to%20${to}`;
  };

  const getHotelsLink = (destination: TripDestination) => {
    const location = encodeURIComponent(`${destination.city || ''}, ${destination.country?.name?.common || ''}`);
    return `https://www.booking.com/searchresults.html?ss=${location}`;
  };
  
  const getRestaurantsLink = (destination: TripDestination) => {
    const location = encodeURIComponent(`${destination.city || ''}, ${destination.country?.name?.common || ''}`);
    return `https://www.tripadvisor.com/Restaurants-g${location}`;
  };
  
  const getAttractionsLink = (destination: TripDestination) => {
    const location = encodeURIComponent(`${destination.city || ''}, ${destination.country?.name?.common || ''}`);
    return `https://www.tripadvisor.com/Attractions-g${location}`;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Estimated Trip Costs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {costs.map((item, index) => {
            const destination = destinations[index];
            return (
              <div key={index} className="space-y-2">
                <h4 className="font-medium text-sm">{item.destination}</h4>
                <div className="grid grid-cols-[1fr_1fr_auto] gap-1 text-sm items-center">
                  <div className="text-muted-foreground flex items-center">
                    <PlaneIcon className="h-4 w-4 mr-1" />
                    Flights
                  </div>
                  <div className="flex items-center">
                    <span className="mr-1">$</span>
                    <Input
                      type="number"
                      value={item.estimate.flights}
                      onChange={(e) => handleCostChange(item.key, 'flights', e.target.value)}
                      className="h-8 w-24"
                    />
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8" 
                    asChild
                  >
                    <a href={getFlightsLink(destination)} target="_blank" rel="noopener noreferrer">
                      <ExternalLinkIcon className="h-4 w-4" />
                    </a>
                  </Button>
                  
                  <div className="text-muted-foreground flex items-center">
                    <BedDoubleIcon className="h-4 w-4 mr-1" />
                    Accommodation
                  </div>
                  <div className="flex items-center">
                    <span className="mr-1">$</span>
                    <Input
                      type="number"
                      value={item.estimate.lodging}
                      onChange={(e) => handleCostChange(item.key, 'lodging', e.target.value)}
                      className="h-8 w-24"
                    />
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8" 
                    asChild
                  >
                    <a href={getHotelsLink(destination)} target="_blank" rel="noopener noreferrer">
                      <ExternalLinkIcon className="h-4 w-4" />
                    </a>
                  </Button>
                  
                  <div className="text-muted-foreground flex items-center">
                    <UtensilsIcon className="h-4 w-4 mr-1" />
                    Food
                  </div>
                  <div className="flex items-center">
                    <span className="mr-1">$</span>
                    <Input
                      type="number"
                      value={item.estimate.food}
                      onChange={(e) => handleCostChange(item.key, 'food', e.target.value)}
                      className="h-8 w-24"
                    />
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8" 
                    asChild
                  >
                    <a href={getRestaurantsLink(destination)} target="_blank" rel="noopener noreferrer">
                      <ExternalLinkIcon className="h-4 w-4" />
                    </a>
                  </Button>
                  
                  <div className="text-muted-foreground flex items-center">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    Activities
                  </div>
                  <div className="flex items-center">
                    <span className="mr-1">$</span>
                    <Input
                      type="number"
                      value={item.estimate.activities}
                      onChange={(e) => handleCostChange(item.key, 'activities', e.target.value)}
                      className="h-8 w-24"
                    />
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8" 
                    asChild
                  >
                    <a href={getAttractionsLink(destination)} target="_blank" rel="noopener noreferrer">
                      <ExternalLinkIcon className="h-4 w-4" />
                    </a>
                  </Button>
                  
                  <div className="font-medium col-span-2">Subtotal</div>
                  <div className="text-right font-medium">${item.estimate.total}</div>
                </div>
              </div>
            );
          })}

          <div className="pt-2 border-t">
            <div className="flex justify-between font-bold">
              <span>Total Estimated Cost</span>
              <span>${totalCost}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Prices are estimates in USD based on average costs and may vary.
              You can adjust costs manually as needed.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TripCostEstimate;
