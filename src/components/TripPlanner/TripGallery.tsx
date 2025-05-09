
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

  // Generiere Galerie-Elemente aus den Reisezielen - Sicherstellen, dass die Daten gültig sind
  const galleryItems: GalleryItem[] = React.useMemo(() => {
    if (!destinations || !Array.isArray(destinations) || destinations.length === 0) {
      return [];
    }
    
    return destinations.flatMap(dest => {
      if (!dest || typeof dest !== 'object') {
        console.warn('Invalid destination object in TripGallery', dest);
        return [];
      }
      
      const cityItems: GalleryItem[] = [];
      
      if (dest.city && dest.country && dest.country.name) {
        cityItems.push({
          id: `city-${dest.city}`,
          title: dest.city,
          subtitle: dest.country.name.common || '',
          searchTerm: `${dest.city} ${dest.country.name.common || ''} skyline`
        });
      }
      
      const poiItems: GalleryItem[] = [];
      
      if (Array.isArray(dest.selectedPOIs)) {
        dest.selectedPOIs.forEach(poi => {
          if (poi && poi.id && poi.name) {
            poiItems.push({
              id: poi.id,
              title: poi.name,
              subtitle: `${dest.city || ''}, ${dest.country?.name?.common || ''}`,
              searchTerm: poi.name,
              image: poi.image
            });
          }
        });
      }
      
      return [...cityItems, ...poiItems];
    });
  }, [destinations]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Trip Gallery</CardTitle>
      </CardHeader>
      <CardContent>
        {galleryItems.length > 0 ? (
          <>
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
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://via.placeholder.com/400x300?text=${encodeURIComponent(item.title)}`;
                      handleImageLoaded(item.id);
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2">
                    <h4 className="text-sm font-medium">{item.title}</h4>
                    <p className="text-xs text-gray-200">{item.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Images from Unsplash</p>
          </>
        ) : (
          <div className="text-center p-4">
            <p className="text-muted-foreground">Add destinations to see images</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TripGallery;
