
import React, { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

interface ImageGalleryProps {
  country: string;
  numberOfImages?: number;
}

interface PexelsPhoto {
  id: number;
  src: {
    medium: string;
    large: string;
  };
  alt: string;
  photographer: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ 
  country, 
  numberOfImages = 5 
}) => {
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});
  const [imageUrls, setImageUrls] = useState<PexelsPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        // Use Pexels API with landscape focus and excluding people
        const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(country)}+landscape+nature+-people&per_page=${numberOfImages}&orientation=landscape`, {
          headers: {
            Authorization: 'jEYY0FYmW1VakicDe2EOkxo19GbNNrufNNZ40KiSCWnVg1291swHRaDA'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch images from Pexels');
        }
        
        const data = await response.json();
        setImageUrls(data.photos || []);
      } catch (error) {
        console.error('Failed to fetch images:', error);
        toast.error('Failed to load country images');
        // Fallback to placeholder images if the API fails
        const fallbackImages = Array.from({ length: numberOfImages }).map((_, index) => ({
          id: index,
          src: {
            medium: `https://via.placeholder.com/400x300?text=${encodeURIComponent(country)}+Image+${index+1}`,
            large: `https://via.placeholder.com/800x600?text=${encodeURIComponent(country)}+Image+${index+1}`
          },
          alt: `Placeholder for ${country}`,
          photographer: 'Placeholder'
        }));
        setImageUrls(fallbackImages);
      } finally {
        setLoading(false);
      }
    };
    
    if (country) {
      fetchImages();
    }
  }, [country, numberOfImages]);
  
  const handleImageLoaded = (index: number) => {
    setLoadedImages(prev => ({
      ...prev,
      [index]: true
    }));
  };

  return (
    <div className="w-full">
      {loading ? 
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {Array.from({ length: numberOfImages }).map((_, index) => (
            <Skeleton key={`skeleton-${index}`} className="w-full aspect-[4/3]" />
          ))}
        </div> :
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {imageUrls.map((photo, index) => (
            <div key={photo.id} className="relative rounded-md overflow-hidden aspect-[4/3] group">
              {!loadedImages[index] && (
                <Skeleton className="absolute inset-0 w-full h-full" />
              )}
              <img
                src={photo.src.medium}
                alt={photo.alt || `Image of ${country}`}
                className={`w-full h-full object-cover transition-all duration-500 ${loadedImages[index] ? 'opacity-100' : 'opacity-0'} group-hover:scale-105`}
                onLoad={() => handleImageLoaded(index)}
                onError={(e) => {
                  // Fallback to a placeholder if the image fails to load
                  const target = e.target as HTMLImageElement;
                  target.src = `https://via.placeholder.com/400x300?text=${encodeURIComponent(country)}+${index+1}`;
                  handleImageLoaded(index);
                }}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
            </div>
          ))}
        </div>
      }
      <p className="text-xs text-muted-foreground mt-2 text-right">Images from Pexels</p>
    </div>
  );
};

export default ImageGallery;
