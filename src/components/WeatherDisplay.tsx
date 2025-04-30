
import React, { useState } from 'react';
import { Weather } from '@/services/api';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CloudSunIcon, SunIcon, CloudRainIcon, ThermometerIcon, WindIcon, SearchIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface WeatherDisplayProps {
  weather: Weather | null;
  city: string | null;
  isLoading: boolean;
  error: string | null;
  onCitySearch: (city: string) => void;
  countryName: string;
}

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ 
  weather, 
  city, 
  isLoading, 
  error, 
  onCitySearch,
  countryName 
}) => {
  const [searchCity, setSearchCity] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCity.trim()) {
      onCitySearch(searchCity.trim());
    }
  };

  // Select appropriate weather icon
  const getWeatherIcon = (description: string) => {
    description = description.toLowerCase();
    if (description.includes('rain') || description.includes('drizzle') || description.includes('shower')) {
      return <CloudRainIcon className="h-8 w-8 mr-2" />;
    } else if (description.includes('cloud') || description.includes('overcast')) {
      return <CloudSunIcon className="h-8 w-8 mr-2" />;
    } else {
      return <SunIcon className="h-8 w-8 mr-2" />;
    }
  };

  return (
    <Card className="p-4 mt-4">
      <h3 className="font-semibold text-lg mb-4">Weather Information</h3>
      
      <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
        <Input
          type="text"
          placeholder={`Search for a city in ${countryName}...`}
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
          className="flex-grow"
        />
        <Button type="submit" disabled={isLoading || !searchCity.trim()}>
          <SearchIcon className="h-4 w-4 mr-2" />
          Search
        </Button>
      </form>

      {isLoading ? (
        <div className="flex flex-col space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      ) : error ? (
        <p className="text-destructive">{error}</p>
      ) : weather && city ? (
        <>
          <div className="mb-4">
            <h4 className="text-md font-medium mb-2">Current Weather in {city}</h4>
            <div className="flex items-center">
              {getWeatherIcon(weather.current_condition[0].weatherDesc[0].value)}
              <div>
                <div className="flex items-center">
                  <ThermometerIcon className="h-4 w-4 mr-1" />
                  <span className="text-xl font-medium">{weather.current_condition[0].temp_C}°C</span>
                </div>
                <p className="text-muted-foreground">{weather.current_condition[0].weatherDesc[0].value}</p>
              </div>
            </div>
            <div className="mt-2 flex items-center">
              <WindIcon className="h-4 w-4 mr-1" />
              <span>Humidity: {weather.current_condition[0].humidity}%</span>
            </div>
          </div>

          {weather.weather && weather.weather.length > 0 && (
            <div>
              <h4 className="text-md font-medium mb-2">Forecast</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {weather.weather.slice(0, 3).map((day, index) => (
                  <div key={index} className="bg-muted/30 p-3 rounded-md">
                    <p className="font-medium">{day.date || `Day ${index + 1}`}</p>
                    <div className="flex items-center">
                      {getWeatherIcon(day.hourly[4].weatherDesc[0].value)}
                      <span>{day.avgtempC}°C</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{day.hourly[4].weatherDesc[0].value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <p className="text-xs text-muted-foreground mt-4">Weather data from wttr.in</p>
        </>
      ) : (
        <p className="text-muted-foreground">Search for a city to see weather information</p>
      )}
    </Card>
  );
};

export default WeatherDisplay;
