
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { TripDestination } from './TripForm';
import type { Country } from '@/services/api';

interface TripMapProps {
  destinations: TripDestination[];
  countries: Country[];
}

// Fix for Leaflet marker icons
const markerIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Helper component to fit map to markers
const MapController = ({ coordinates }: { coordinates: [number, number][] }) => {
  const map = useMap();
  
  useEffect(() => {
    if (coordinates.length > 0) {
      if (coordinates.length === 1) {
        // If only one point, center on it with a good zoom level
        map.setView(coordinates[0], 6);
      } else {
        // Create bounds that include all points
        const bounds = L.latLngBounds(coordinates.map(coord => L.latLng(coord[0], coord[1])));
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [coordinates, map]);
  
  return null;
};

const TripMap: React.FC<TripMapProps> = ({ destinations, countries }) => {
  // Helper function to get coordinates for a country
  const getCountryCoordinates = (countryName: string): [number, number] => {
    const country = countries.find(c => c.name.common === countryName);
    return country?.latlng ? [country.latlng[0], country.latlng[1]] : [0, 0];
  };
  
  // Create coordinates array for destinations
  const coordinates: [number, number][] = destinations
    .filter(d => d.countryName)
    .map(d => getCountryCoordinates(d.countryName));
  
  // Default coordinates if none are available
  const defaultCoordinates: [number, number] = [20, 0];
  const hasCoordinates = coordinates.length > 0;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Trip Route</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full rounded-md overflow-hidden border">
          {hasCoordinates ? (
            <MapContainer
              center={coordinates[0] || defaultCoordinates}
              zoom={2}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              {/* Markers for each destination */}
              {destinations.filter(d => d.countryName).map((destination, index) => {
                const coords = getCountryCoordinates(destination.countryName);
                return (
                  <Marker 
                    key={destination.id} 
                    position={coords}
                    icon={markerIcon}
                  >
                    <Popup>
                      <div>
                        <h3 className="font-medium">{destination.countryName}</h3>
                        {destination.cityName && <p>{destination.cityName}</p>}
                        {destination.durationDays && <p>{destination.durationDays} days</p>}
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
              
              {/* Polyline connecting destinations in order */}
              {coordinates.length > 1 && (
                <Polyline 
                  positions={coordinates}
                  color="blue"
                  weight={3}
                  opacity={0.7}
                  dashArray="5, 10"
                />
              )}
              
              <MapController coordinates={coordinates} />
            </MapContainer>
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-muted/20">
              <p className="text-muted-foreground">Add destinations to see your trip on the map</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TripMap;
