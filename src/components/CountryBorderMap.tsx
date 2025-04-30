
import React, { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

interface CountryBorderMapProps {
  countryCode: string;
  countryName: string;
}

const CountryBorderMap: React.FC<CountryBorderMapProps> = ({ countryCode, countryName }) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  
  // Using the free nominatim service for maps without API key
  const mapUrl = `https://nominatim.openstreetmap.org/ui/search.html?country=${encodeURIComponent(countryCode)}`;
  
  // Using static snapshot from mapsvg for border display (100% free to use)
  const borderMapUrl = `https://maps.geoapify.com/v1/staticmap?style=osm-carto&width=600&height=400&center=auto&format=png&apiKey=YOUR_API_KEY&marker=lonlat:0,0;type:material;color:%23000000;icontype:awesome&zoom=auto&area=${countryCode.toLowerCase()}`;

  return (
    <Card className="p-4 mt-4">
      <h3 className="font-semibold text-lg mb-2">Country Borders</h3>
      <div className="relative rounded-md overflow-hidden aspect-[16/9]">
        {!mapLoaded && (
          <Skeleton className="absolute inset-0 w-full h-full" />
        )}
        <img 
          src={`https://open.mapquestapi.com/staticmap/v5/map?key=YOUR_API_KEY&center=${encodeURIComponent(countryName)}&zoom=3&size=600,400&type=map`}
          alt={`Map of ${countryName}`}
          className={`w-full h-full object-cover border rounded-md transition-opacity duration-300 ${mapLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setMapLoaded(true)}
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
