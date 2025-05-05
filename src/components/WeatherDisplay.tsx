
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Wind, Droplets, Sun, CloudRain, Cloud, AlertTriangle } from 'lucide-react';

interface Weather {
  location: {
    name: string;
    country: string;
    region: string;
  };
  current: {
    temp_c: number;
    temp_f: number;
    condition: {
      text: string;
      icon: string;
    };
    wind_kph: number;
    wind_dir: string;
    humidity: number;
    feelslike_c: number;
    feelslike_f: number;
    uv: number;
  };
  forecast: {
    forecastday: Array<{
      date: string;
      day: {
        avgtemp_c: number;
        avgtemp_f: number;
        condition: {
          text: string;
          icon: string;
        };
        daily_chance_of_rain: number;
        maxtemp_c: number;
        maxtemp_f: number;
        mintemp_c: number;
        mintemp_f: number;
      };
    }>;
  };
}

interface WeatherDisplayProps {
  countryName: string;
  cityName?: string;
}

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ countryName, cityName }) => {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<'c' | 'f'>('c');
  
  useEffect(() => {
    // Skip if no country name
    if (!countryName) {
      setLoading(false);
      return;
    }
    
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const location = cityName || countryName;
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=d76c9971c6cd40dbaa692245232007&q=${location}&days=3&aqi=no&alerts=no`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }
        
        const data = await response.json();
        setWeather(data as Weather);
      } catch (err) {
        console.error('Weather fetching error:', err);
        setError('Could not load weather information');
      } finally {
        setLoading(false);
      }
    };
    
    fetchWeather();
  }, [countryName, cityName]);
  
  if (loading) {
    return (
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Weather</CardTitle>
          <CardDescription>Loading weather information...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-[20px] w-[250px]" />
            <Skeleton className="h-[60px] w-full" />
            <Skeleton className="h-[100px] w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error || !weather) {
    return (
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Weather</CardTitle>
          <CardDescription>Current and forecast</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <div className="flex flex-col items-center text-center">
              <AlertTriangle className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">{error || 'No weather data available'}</p>
              {error && (
                <Button variant="outline" size="sm" className="mt-2" onClick={() => window.location.reload()}>
                  Retry
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg">Weather</CardTitle>
            <CardDescription>
              {weather.location.name}, {weather.location.country}
            </CardDescription>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant={unit === 'c' ? "secondary" : "outline"}
              size="sm"
              onClick={() => setUnit('c')}
              className="h-7 px-2"
            >
              °C
            </Button>
            <Button
              variant={unit === 'f' ? "secondary" : "outline"}
              size="sm"
              onClick={() => setUnit('f')}
              className="h-7 px-2"
            >
              °F
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex items-center">
            <img
              src={`https:${weather.current.condition.icon}`}
              alt={weather.current.condition.text}
              className="w-16 h-16"
            />
            <div className="ml-2">
              <p className="text-3xl font-bold">
                {unit === 'c' ? `${Math.round(weather.current.temp_c)}°C` : `${Math.round(weather.current.temp_f)}°F`}
              </p>
              <p className="text-sm text-muted-foreground">
                Feels like {unit === 'c' ? `${Math.round(weather.current.feelslike_c)}°C` : `${Math.round(weather.current.feelslike_f)}°F`}
              </p>
            </div>
            <div className="ml-auto text-right">
              <p className="font-medium">{weather.current.condition.text}</p>
              <div className="flex items-center justify-end gap-2 mt-1">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Wind className="h-3 w-3" />
                  <span>{weather.current.wind_kph} km/h</span>
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Droplets className="h-3 w-3" />
                  <span>{weather.current.humidity}%</span>
                </Badge>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t pt-3">
          <p className="font-medium mb-2">3-Day Forecast</p>
          <div className="grid grid-cols-3 gap-2">
            {weather.forecast.forecastday.map((day, i) => (
              <div
                key={day.date}
                className="flex flex-col items-center border rounded-md p-2 text-center"
              >
                <p className="text-xs font-medium">
                  {i === 0 ? 'Today' : new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                </p>
                <img
                  src={`https:${day.day.condition.icon}`}
                  alt={day.day.condition.text}
                  className="w-10 h-10 my-1"
                />
                <div className="text-xs">
                  <div className="font-medium">
                    {unit === 'c'
                      ? `${Math.round(day.day.maxtemp_c)}° / ${Math.round(day.day.mintemp_c)}°`
                      : `${Math.round(day.day.maxtemp_f)}° / ${Math.round(day.day.mintemp_f)}°`}
                  </div>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <CloudRain className="h-3 w-3" />
                    <span>{day.day.daily_chance_of_rain}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherDisplay;
