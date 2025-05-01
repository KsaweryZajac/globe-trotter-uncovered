
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import tripPlannerApi from '@/services/tripPlannerApi';
import { TripDestination } from './TripForm';

interface TripCostEstimateProps {
  destinations: TripDestination[];
  tripDuration: number;
}

const TripCostEstimate: React.FC<TripCostEstimateProps> = ({ destinations, tripDuration }) => {
  // Calculate costs for each destination
  const costs = destinations.map(dest => ({
    destination: `${dest.city}, ${dest.country.name.common}`,
    estimate: tripPlannerApi.calculateTripCost(dest.country.name.common, tripDuration)
  }));

  // Calculate total costs
  const totalCost = costs.reduce(
    (total, item) => total + item.estimate.total,
    0
  );

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Estimated Trip Costs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {costs.map((item, index) => (
            <div key={index} className="space-y-2">
              <h4 className="font-medium text-sm">{item.destination}</h4>
              <div className="grid grid-cols-2 gap-1 text-sm">
                <div className="text-muted-foreground">Flights</div>
                <div className="text-right">${item.estimate.flights}</div>
                <div className="text-muted-foreground">Accommodation</div>
                <div className="text-right">${item.estimate.lodging}</div>
                <div className="text-muted-foreground">Food</div>
                <div className="text-right">${item.estimate.food}</div>
                <div className="text-muted-foreground">Activities</div>
                <div className="text-right">${item.estimate.activities}</div>
                <div className="font-medium">Subtotal</div>
                <div className="text-right font-medium">${item.estimate.total}</div>
              </div>
            </div>
          ))}

          <div className="pt-2 border-t">
            <div className="flex justify-between font-bold">
              <span>Total Estimated Cost</span>
              <span>${totalCost}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Prices are estimates in USD based on average costs and may vary.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TripCostEstimate;
