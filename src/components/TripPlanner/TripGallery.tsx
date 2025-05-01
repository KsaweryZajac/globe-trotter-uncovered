
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TripDestination } from './TripForm';

interface TripGalleryProps {
  destinations: TripDestination[];
}

interface GalleryItem {
  id: string;
  title: string;
  subtitle: string;
  searchTerm: string;
  image?: string;
}

const TripGallery: React.FC<TripGalleryProps> = ({ destinations }) => {
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  const handleImageLoaded = (id: string) => {
    setLoadedImages(prev => ({
      ...prev,
      [id]: true
    }));
  };

  // Generate gallery items from destinations
  const galleryItems: GalleryItem[] = destinations.flatMap(dest => {
    // Create gallery item for each city
    const cityItem: GalleryItem = {
      id: `city-${dest.city}`,
      title: dest.city,
      subtitle: dest.country.name.common,
      searchTerm: `${dest.city} ${dest.country.name.common} skyline`
    };
    
    // Create gallery items for selected POIs
    const poiItems: GalleryItem[] = (dest.selectedPOIs || []).map(poi => ({
      id: poi.id,
      title: poi.name,
      subtitle: `${dest.city}, ${dest.country.name.common}`,
      searchTerm: poi.name,
      // Use the POI's image if available (from Wikipedia)
      image: poi.image
    }));
    
    return [cityItem, ...poiItems];
  });

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Trip Gallery</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {galleryItems.map((item) => (
            <div key={item.id} className="relative rounded-md overflow-hidden aspect-[4/3]">
              {!loadedImages[item.id] && (
                <Skeleton className="absolute inset-0 w-full h-full" />
              )}
              <img
                src={item.image || `https://source.unsplash.com/400x300/?${encodeURIComponent(item.searchTerm)}`}
                alt={item.title}
                className={`w-full h-full object-cover transition-opacity duration-300 ${loadedImages[item.id] ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => handleImageLoaded(item.id)}
                loading="lazy"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2">
                <h4 className="text-sm font-medium">{item.title}</h4>
                <p className="text-xs text-gray-200">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
        
        {galleryItems.length === 0 && (
          <div className="text-center p-4">
            <p className="text-muted-foreground">Add destinations to see images</p>
          </div>
        )}
        
        <p className="text-xs text-muted-foreground mt-2">Images from Unsplash</p>
      </CardContent>
    </Card>
  );
};

export default TripGallery;
