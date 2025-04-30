
import React, { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

interface CountryBorderMapProps {
  countryCode: string;
  countryName: string;
}

const CountryBorderMap: React.FC<CountryBorderMapProps> = ({ countryCode, countryName }) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  
  // Using open-source OpenStreetMap for map display
  const mapUrl = `https://nominatim.openstreetmap.org/ui/search.html?country=${encodeURIComponent(countryCode)}`;
  
  // Using free StaticMap API
  const borderMapUrl = `https://static-maps.yandex.ru/1.x/?lang=en_US&size=600,400&l=map&bbox=-180,-85,180,85&pl=c:3F75FFB2,w:2,${countryCode.toLowerCase()}`;

  return (
    <Card className="p-4 mt-4">
      <h3 className="font-semibold text-lg mb-2">Country Borders</h3>
      <div className="relative rounded-md overflow-hidden aspect-[16/9]">
        {!mapLoaded && (
          <Skeleton className="absolute inset-0 w-full h-full" />
        )}
        <img 
          src={`https://staticmap.openstreetmap.de/staticmap.php?center=${encodeURIComponent(countryName)}&zoom=4&size=600x400&maptype=mapnik&markers=${encodeURIComponent(countryName)},lightblue`}
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
