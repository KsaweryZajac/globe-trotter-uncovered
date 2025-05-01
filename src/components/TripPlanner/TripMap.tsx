
import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { TripDestination } from './TripForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Fix for Leaflet marker icons
const markerIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface TripMapProps {
  destinations: TripDestination[];
}

interface MapPoint {
  id: string;
  name: string;
  country: string;
  city: string;
  position: [number, number];
  image?: string;
  description?: string;
  link?: string;
}

// Create a MapController component to handle map interactions
// This separates the map control logic from the rendering
const MapController = ({ points }: { points: MapPoint[] }) => {
  const map = useMap();
  
  useEffect(() => {
    if (points.length > 0) {
      if (points.length === 1) {
        // If only one point, center on it with a good zoom level
        const point = points[0];
        map.setView(point.position, 9);
      } else {
        // Create bounds that include all points
        const bounds = L.latLngBounds(points.map(p => L.latLng(p.position[0], p.position[1])));
        map.fitBounds(bounds, { padding: [30, 30] });
      }
    }
  }, [map, points]);
  
  return null;
};

const TripMap: React.FC<TripMapProps> = ({ destinations }) => {
  // Create map points from destinations
  const mapPoints: MapPoint[] = destinations.flatMap(dest => {
    // Add city as a map point
    const cityPoint: MapPoint = {
      id: `city-${dest.city}`,
      name: dest.city,
      country: dest.country.name.common,
      city: dest.city,
      // Use position from country for city if we don't have specific coordinates
      // This is a simplification - in a real app, you'd use a geocoding service
      position: [
        dest.country.latlng?.[0] ?? 0, 
        dest.country.latlng?.[1] ?? 0
      ]
    };
    
    // Add selected POIs as map points
    const poiPoints: MapPoint[] = (dest.selectedPOIs || [])
      .filter(poi => poi.location)
      .map(poi => ({
        id: poi.id,
        name: poi.name,
        country: dest.country.name.common,
        city: dest.city,
        position: [
          poi.location?.lat || 0,
          poi.location?.lng || 0
        ] as [number, number],
        image: poi.image,
        description: poi.description,
        link: poi.link
      }));
    
    return [cityPoint, ...poiPoints];
  });

  return (
    <Card className="mt-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Trip Map</CardTitle>
      </CardHeader>
      <CardContent>
        {mapPoints.length > 0 ? (
          <div className="h-[400px] rounded-md overflow-hidden border">
            <MapContainer
              center={[20, 0]} // Default center
              zoom={2} // Default zoom
              style={{ height: '100%', width: '100%' }}
            >
              <MapController points={mapPoints} />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {mapPoints.map(point => (
                <Marker 
                  key={point.id} 
                  position={point.position}
                  icon={markerIcon}
                >
                  <Popup>
                    <div className="min-w-[200px]">
                      <h3 className="font-bold">{point.name}</h3>
                      <p className="text-sm text-gray-600">{point.city}, {point.country}</p>
                      {point.image && (
                        <img 
                          src={point.image} 
                          alt={point.name}
                          className="w-full h-24 object-cover my-2 rounded"
                        />
                      )}
                      {point.description && (
                        <p className="text-xs my-1">{point.description.substring(0, 100)}...</p>
                      )}
                      {point.link && (
                        <a 
                          href={point.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-500 hover:underline"
                        >
                          Learn more
                        </a>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        ) : (
          <div className="h-[200px] flex items-center justify-center border rounded-md">
            <p className="text-muted-foreground">Add destinations to see them on the map</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TripMap;
