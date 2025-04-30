
import React from 'react';
import { Weather } from '@/services/api';
import { Card } from '@/components/ui/card';
import { CloudSunIcon, SunIcon, CloudRainIcon, ThermometerIcon, WindIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface WeatherDisplayProps {
  weather: Weather | null;
  city: string | null;
  isLoading: boolean;
  error: string | null;
}

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ weather, city, isLoading, error }) => {
  if (isLoading) {
    return (
      <Card className="p-4 mt-4">
        <div className="flex flex-col space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4 mt-4 text-destructive">
        <p>Failed to load weather information: {error}</p>
      </Card>
    );
  }

  if (!weather || !city) {
    return null;
  }

  const currentWeather = weather.current_condition[0];
  const weatherDescription = currentWeather.weatherDesc[0].value;
  const temperature = currentWeather.temp_C;
  const humidity = currentWeather.humidity;

  // Select appropriate weather icon
  const getWeatherIcon = () => {
    const description = weatherDescription.toLowerCase();
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
      <h3 className="font-semibold text-lg mb-2">Current Weather in {city}</h3>
      <div className="flex items-center">
        {getWeatherIcon()}
        <div>
          <div className="flex items-center">
            <ThermometerIcon className="h-4 w-4 mr-1" />
            <span className="text-xl font-medium">{temperature}°C</span>
          </div>
          <p className="text-muted-foreground">{weatherDescription}</p>
        </div>
      </div>
      <div className="mt-2 flex items-center">
        <WindIcon className="h-4 w-4 mr-1" />
        <span>Humidity: {humidity}%</span>
      </div>
      <p className="text-xs text-muted-foreground mt-2">Weather data from wttr.in</p>
    </Card>
  );
};

export default WeatherDisplay;
