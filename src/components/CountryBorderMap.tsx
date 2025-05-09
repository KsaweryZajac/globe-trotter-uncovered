
import React, { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { MapIcon } from 'lucide-react';

interface CountryBorderMapProps {
  countryName: string;
  countryCode?: string;
  latlng?: number[];
}

const CountryBorderMap: React.FC<CountryBorderMapProps> = ({ countryName, countryCode, latlng }) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapUrl, setMapUrl] = useState('');
  
  const cleanCountryName = countryName.replace(/[^\w\s]/gi, '').trim();
  
  useEffect(() => {
    const baseUrl = 'https://www.openstreetmap.org/export/embed.html';
    
    let queryParams;
    
    if (latlng && latlng.length === 2) {
      const [lat, lng] = latlng;
      
      let zoomLevel = 5;
      
      if (['Vatican City', 'Monaco', 'Nauru', 'Tuvalu', 'San Marino', 'Liechtenstein', 'Malta', 'Maldives', 'Barbados', 'Bahrain', 'Singapore'].includes(countryName)) {
        zoomLevel = 9;
      } else if (['Russia', 'Canada', 'United States', 'Brazil', 'Australia', 'China', 'India'].includes(countryName)) {
        zoomLevel = 3;
      }
      
      queryParams = `?bbox=${lng-20},${lat-20},${lng+20},${lat+20}&layer=mapnik&marker=${lat},${lng}`;
      queryParams += `&zoom=${zoomLevel}`;
    } else if (countryCode && countryCode.match(/^[A-Z]{2,3}$/)) {
      queryParams = `?bbox=-180,-85,180,85&layer=mapnik&relation=${countryCode}`;
    } else {
      queryParams = `?query=${encodeURIComponent(cleanCountryName)}`;
    }
    
    setMapUrl(`${baseUrl}${queryParams}`);
  }, [countryName, countryCode, latlng, cleanCountryName]);

  const viewMapUrl = countryCode ? 
    `https://www.openstreetmap.org/relation/${countryCode}` : 
    `https://www.openstreetmap.org/search?query=${encodeURIComponent(cleanCountryName)}`;
  
  return (
    <Card className="p-4 mt-4 overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <h3 className="font-semibold text-lg mb-3 flex items-center">
        <MapIcon className="h-5 w-5 text-primary mr-2" />
        Country Map
      </h3>
      <div className="relative rounded-md overflow-hidden aspect-[16/9] border">
        {!mapLoaded && (
          <Skeleton className="absolute inset-0 w-full h-full" />
        )}
        <iframe 
          src={mapUrl}
          width="100%" 
          height="100%" 
          frameBorder="0" 
          title={`Map of ${countryName}`}
          className={`w-full h-full transition-opacity duration-300 ${mapLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setMapLoaded(true)}
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="mt-2 flex justify-between items-center">
        <p className="text-xs text-muted-foreground">Map data from OpenStreetMap</p>
        <a 
          href={viewMapUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-xs text-primary hover:underline flex items-center"
        >
          <span>View interactive map</span>
          <svg className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </Card>
  );
};

export default CountryBorderMap;
