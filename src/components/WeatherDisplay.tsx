
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CloudSunIcon, SunIcon, CloudRainIcon, ThermometerIcon, WindIcon, SearchIcon, DropletIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import api from '@/services/api';
import { Weather } from '@/services/api';

interface WeatherDisplayProps {
  countryName: string;
  capital?: string | null;
  weather?: Weather | null;
}

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ 
  countryName,
  capital
}) => {
  const [searchCity, setSearchCity] = useState<string>('');
  const [displayCity, setDisplayCity] = useState<string | null>(capital || null);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch weather when city changes
  useEffect(() => {
    if (displayCity) {
      fetchWeather(displayCity);
    }
  }, [displayCity]);

  // Set initial city when capital prop changes
  useEffect(() => {
    if (capital && !displayCity) {
      setDisplayCity(capital);
    }
  }, [capital]);

  const fetchWeather = async (city: string) => {
    if (!city) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const weatherData = await api.getWeatherForCity(city);
      setWeather(weatherData);
    } catch (err) {
      console.error("Error fetching weather:", err);
      setError("Failed to load weather information");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCity.trim()) {
      setDisplayCity(searchCity.trim());
    }
  };

  const handleCitySearch = (city: string) => {
    if (city.trim()) {
      setDisplayCity(city.trim());
    }
  };

  // Select appropriate weather icon
  const getWeatherIcon = (description: string | undefined) => {
    if (!description) return <CloudSunIcon className="h-10 w-10 text-primary" />;
    
    description = description.toLowerCase();
    if (description.includes('rain') || description.includes('drizzle') || description.includes('shower')) {
      return <CloudRainIcon className="h-10 w-10 text-blue-500" />;
    } else if (description.includes('cloud') || description.includes('overcast')) {
      return <CloudSunIcon className="h-10 w-10 text-gray-500" />;
    } else {
      return <SunIcon className="h-10 w-10 text-amber-500" />;
    }
  };

  return (
    <Card className="overflow-hidden border border-border shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-2 border-b">
        <CardTitle className="flex items-center gap-2 text-lg">
          <CloudSunIcon className="h-5 w-5 text-primary" /> 
          Weather Information
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="mb-5 flex gap-2">
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
          <div className="flex flex-col space-y-4 p-4 bg-muted/20 rounded-lg">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        ) : error ? (
          <div className="p-4 bg-destructive/10 text-destructive rounded-lg text-center">
            <p>{error}</p>
            <p className="text-sm mt-2">Try searching for another city.</p>
          </div>
        ) : weather && displayCity ? (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-background border">
              <h4 className="font-medium mb-2 text-md">Current Weather in {displayCity}</h4>
              
              <div className="flex items-center">
                <div className="mr-4">
                  {getWeatherIcon(weather.current_condition?.[0]?.weatherDesc?.[0]?.value)}
                </div>
                <div>
                  <div className="flex items-center mb-1">
                    <ThermometerIcon className="h-4 w-4 mr-1 text-red-500" />
                    <span className="text-2xl font-semibold">
                      {weather.current_condition?.[0]?.temp_C || 'N/A'}°C
                    </span>
                  </div>
                  <p className="text-muted-foreground">
                    {weather.current_condition?.[0]?.weatherDesc?.[0]?.value || 'Unknown'}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="flex items-center">
                  <WindIcon className="h-4 w-4 mr-2 text-blue-400" />
                  <span className="text-sm">Wind: {weather.current_condition?.[0]?.windspeedKmph || 'N/A'} km/h</span>
                </div>
                <div className="flex items-center">
                  <DropletIcon className="h-4 w-4 mr-2 text-blue-500" />
                  <span className="text-sm">Humidity: {weather.current_condition?.[0]?.humidity || 'N/A'}%</span>
                </div>
              </div>
            </div>

            {weather.weather && weather.weather.length > 0 && (
              <div>
                <h4 className="font-medium mb-2 text-md">3-Day Forecast</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {weather.weather.slice(0, 3).map((day, index) => (
                    <div key={index} className="p-3 rounded-md border bg-background/50 hover:bg-background/80 transition-colors">
                      <p className="font-medium text-sm">{day.date || `Day ${index + 1}`}</p>
                      <div className="flex items-center mt-1">
                        {getWeatherIcon(day.hourly?.[4]?.weatherDesc?.[0]?.value)}
                        <div className="ml-2">
                          <p className="font-semibold">{day.avgtempC}°C</p>
                          <p className="text-xs text-muted-foreground">
                            {day.hourly?.[4]?.weatherDesc?.[0]?.value || 'Unknown'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <p className="text-xs text-muted-foreground text-center">Weather data from wttr.in</p>
          </div>
        ) : (
          <div className="text-center p-6 bg-muted/20 rounded-lg">
            <CloudSunIcon className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
            <p className="text-muted-foreground">Search for a city to see weather information</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherDisplay;
