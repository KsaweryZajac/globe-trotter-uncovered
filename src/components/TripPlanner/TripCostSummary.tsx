
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { differenceInDays } from 'date-fns';
import { TripDestination } from './TripForm';

interface TripCostSummaryProps {
  destinations: TripDestination[];
  startDate?: Date;
  endDate?: Date;
  totalCost: number;
}

const TripCostSummary: React.FC<TripCostSummaryProps> = ({ 
  destinations, 
  startDate, 
  endDate,
  totalCost
}) => {
  const tripDuration = startDate && endDate ? 
    Math.max(1, differenceInDays(endDate, startDate) + 1) : 0;

  return (
    <Card className="mt-6 bg-muted/40">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Trip Cost Summary</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <ul className="space-y-2 text-sm">
          {startDate && endDate && (
            <li className="flex justify-between">
              <span className="text-muted-foreground">Trip duration:</span>
              <span className="font-medium">{tripDuration} days</span>
            </li>
          )}
          
          <li className="flex justify-between">
            <span className="text-muted-foreground">Destinations:</span>
            <span className="font-medium">{destinations.length}</span>
          </li>
          
          {destinations.filter(dest => dest.countryName).map((dest) => (
            <li key={dest.id} className="flex justify-between">
              <span className="text-muted-foreground">
                {dest.countryName} {dest.cityName ? `(${dest.cityName})` : ''}: 
              </span>
              <span className="font-medium">
                {dest.durationDays ? `${dest.durationDays} days` : 'Duration not set'}
              </span>
            </li>
          ))}
        </ul>
        
        <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
          <span className="font-semibold">Estimated total cost:</span>
          <span className="text-lg font-bold">${totalCost.toLocaleString()}</span>
        </div>
        
        <p className="text-xs text-muted-foreground mt-1">
          This is an estimate based on average costs for accommodation, food, transportation, 
          and activities in the selected destinations.
        </p>
      </CardContent>
    </Card>
  );
};

export default TripCostSummary;
