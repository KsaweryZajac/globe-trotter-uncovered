
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Wind, Droplets, Sun, CloudRain, Cloud, AlertTriangle } from 'lucide-react';

interface WeatherResponse {
  current: {
    temp_c: number;
    temp_f: number;
    condition: {
      text: string;
      icon: string;
    };
    wind_kph: number;
    humidity: number;
    feelslike_c: number;
    feelslike_f: number;
    uv: number;
    wind_dir: string;
  };
  forecast: {
    forecastday: {
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
    }[];
  };
  location: {
    name: string;
    country: string;
    region: string;
  };
}

interface WeatherDisplayProps {
  countryName: string;
  cityName?: string;
  capital?: string;
}

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ countryName, cityName, capital }) => {
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<'c' | 'f'>('c');
  
  useEffect(() => {
    if (!countryName) {
      setLoading(false);
      return;
    }
    
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const location = cityName || capital || countryName;
        
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=d76c9971c6cd40dbaa692245232007&q=${encodeURIComponent(location)}&days=3&aqi=no&alerts=no`);
        
        if (!response.ok) {
          throw new Error('Weather API failed, trying fallback');
        }
        
        const data = await response.json();
        setWeather(data);
      } catch (err) {
        console.error('Weather API error:', err);
        
        try {
          // Fallback zur Open-Meteo API, die vollständig kostenlos ist und keinen API-Schlüssel benötigt
          const location = cityName || capital || countryName;
          const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`);
          
          if (!geoResponse.ok) {
            throw new Error('Geocoding failed');
          }
          
          const geoData = await geoResponse.json();
          
          if (!geoData.results || geoData.results.length === 0) {
            throw new Error('Location not found');
          }
          
          const { latitude, longitude, name, country } = geoData.results[0];
          
          const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=3`
          );
          
          if (!weatherResponse.ok) {
            throw new Error('Weather data fetch failed');
          }
          
          const weatherData = await weatherResponse.json();
          
          // Umwandlung des Open-Meteo-Datenformats in unser erwartetes Format
          const convertedData: WeatherResponse = {
            location: {
              name,
              country,
              region: '',
            },
            current: {
              temp_c: weatherData.current.temperature_2m,
              temp_f: weatherData.current.temperature_2m * 9/5 + 32,
              condition: {
                text: getWeatherConditionText(weatherData.current.weather_code),
                icon: getWeatherIconUrl(weatherData.current.weather_code),
              },
              wind_kph: weatherData.current.wind_speed_10m * 3.6,
              humidity: weatherData.current.relative_humidity_2m,
              feelslike_c: weatherData.current.temperature_2m,
              feelslike_f: weatherData.current.temperature_2m * 9/5 + 32,
              uv: 0,
              wind_dir: 'N/A',
            },
            forecast: {
              forecastday: weatherData.daily.time.map((date: string, i: number) => ({
                date,
                day: {
                  avgtemp_c: (weatherData.daily.temperature_2m_max[i] + weatherData.daily.temperature_2m_min[i]) / 2,
                  avgtemp_f: ((weatherData.daily.temperature_2m_max[i] + weatherData.daily.temperature_2m_min[i]) / 2) * 9/5 + 32,
                  condition: {
                    text: getWeatherConditionText(weatherData.daily.weather_code[i]),
                    icon: getWeatherIconUrl(weatherData.daily.weather_code[i]),
                  },
                  daily_chance_of_rain: weatherData.daily.precipitation_probability_max[i] || 0,
                  maxtemp_c: weatherData.daily.temperature_2m_max[i],
                  maxtemp_f: weatherData.daily.temperature_2m_max[i] * 9/5 + 32,
                  mintemp_c: weatherData.daily.temperature_2m_min[i],
                  mintemp_f: weatherData.daily.temperature_2m_min[i] * 9/5 + 32,
                },
              })),
            },
          };
          
          setWeather(convertedData);
        } catch (fallbackErr) {
          console.error('Fallback weather API error:', fallbackErr);
          setError('Could not load weather information');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchWeather();
  }, [countryName, cityName, capital]);
  
  // Hilfsfunktion zur Umwandlung von WMO-Wettercodes in Text
  function getWeatherConditionText(code: number): string {
    const conditions: Record<number, string> = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      56: 'Light freezing drizzle',
      57: 'Dense freezing drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      66: 'Light freezing rain',
      67: 'Heavy freezing rain',
      71: 'Slight snow fall',
      73: 'Moderate snow fall',
      75: 'Heavy snow fall',
      77: 'Snow grains',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      85: 'Slight snow showers',
      86: 'Heavy snow showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with slight hail',
      99: 'Thunderstorm with heavy hail',
    };
    return conditions[code] || 'Unknown';
  }
  
  // Hilfsfunktion zum Abrufen der Wetter-Icon-URL
  function getWeatherIconUrl(code: number): string {
    if (code === 0) return 'https://cdn.weatherapi.com/weather/64x64/day/113.png';
    if (code >= 1 && code <= 2) return 'https://cdn.weatherapi.com/weather/64x64/day/116.png';
    if (code === 3) return 'https://cdn.weatherapi.com/weather/64x64/day/119.png';
    if (code >= 45 && code <= 48) return 'https://cdn.weatherapi.com/weather/64x64/day/248.png';
    if (code >= 51 && code <= 57) return 'https://cdn.weatherapi.com/weather/64x64/day/266.png';
    if (code >= 61 && code <= 67) return 'https://cdn.weatherapi.com/weather/64x64/day/308.png';
    if (code >= 71 && code <= 77) return 'https://cdn.weatherapi.com/weather/64x64/day/338.png';
    if (code >= 80 && code <= 82) return 'https://cdn.weatherapi.com/weather/64x64/day/305.png';
    if (code >= 85 && code <= 86) return 'https://cdn.weatherapi.com/weather/64x64/day/338.png';
    if (code >= 95) return 'https://cdn.weatherapi.com/weather/64x64/day/389.png';
    return 'https://cdn.weatherapi.com/weather/64x64/day/116.png';
  }
  
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
              src={`${weather.current.condition.icon}`}
              alt={weather.current.condition.text}
              className="w-16 h-16"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://cdn.weatherapi.com/weather/64x64/day/116.png';
              }}
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
                  src={day.day.condition.icon}
                  alt={day.day.condition.text}
                  className="w-10 h-10 my-1"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://cdn.weatherapi.com/weather/64x64/day/116.png';
                  }}
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
