
import React, { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

interface CountryBorderMapProps {
  countryName: string;
  countryCode?: string;
}

const CountryBorderMap: React.FC<CountryBorderMapProps> = ({ countryName, countryCode }) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  
  // Using open-source OpenStreetMap for map display
  const mapUrl = countryCode ? 
    `https://nominatim.openstreetmap.org/ui/search.html?country=${encodeURIComponent(countryCode)}` : 
    `https://nominatim.openstreetmap.org/ui/search.html?q=${encodeURIComponent(countryName)}`;
  
  // If we don't have a country code, use the country name for the map
  const mapParam = countryCode ? 
    `area=${countryCode.toLowerCase()}` : 
    `text=${encodeURIComponent(countryName)}`;
  
  return (
    <Card className="p-4 mt-4">
      <h3 className="font-semibold text-lg mb-2">Country Borders</h3>
      <div className="relative rounded-md overflow-hidden aspect-[16/9]">
        {!mapLoaded && (
          <Skeleton className="absolute inset-0 w-full h-full" />
        )}
        <img 
          src={`https://maps.geoapify.com/v1/staticmap?style=osm-carto&width=600&height=400&center=lonlat:0,0;auto&zoom=auto&marker=lonlat:0,0;type:awesome;color:%23ff0000;icontype:awesome&apiKey=15c128aec18940f195c1df47d62d7548&${mapParam}`}
          alt={`Map of ${countryName}`}
          className={`w-full h-full object-cover border rounded-md transition-opacity duration-300 ${mapLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setMapLoaded(true)}
          onError={() => setMapLoaded(true)} // Handle errors gracefully
          loading="lazy"
        />
      </div>
      <div className="mt-2 flex justify-between items-center">
        <p className="text-xs text-muted-foreground">Map data from OpenStreetMap</p>
        <a 
          href={mapUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-xs text-blue-600 hover:underline"
        >
          View interactive map
        </a>
      </div>
    </Card>
  );
};

export default CountryBorderMap;
