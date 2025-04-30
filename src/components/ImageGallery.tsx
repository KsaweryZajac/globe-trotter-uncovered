
import React, { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface ImageGalleryProps {
  country: string;
  numberOfImages?: number;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ 
  country, 
  numberOfImages = 5 
}) => {
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});
  
  const handleImageLoaded = (index: number) => {
    setLoadedImages(prev => ({
      ...prev,
      [index]: true
    }));
  };

  // Unsplash API access key
  const accessKey = 'Zb33e1ECktbJxJDGrqGoYivM-VNWgB4XAH_LpWlpzp8';

  return (
    <div className="my-4">
      <h3 className="font-semibold text-lg mb-2">Gallery of {country}</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
        {Array.from({ length: numberOfImages }).map((_, index) => (
          <div key={index} className="relative rounded-md overflow-hidden aspect-[4/3]">
            {!loadedImages[index] && (
              <Skeleton className="absolute inset-0 w-full h-full" />
            )}
            <img
              src={`https://source.unsplash.com/featured/400x300?${encodeURIComponent(country)}&sig=${index}`}
              alt={`Image ${index + 1} of ${country}`}
              className={`w-full h-full object-cover transition-opacity duration-300 ${loadedImages[index] ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => handleImageLoaded(index)}
              loading="lazy"
            />
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-2">Images from Unsplash</p>
    </div>
  );
};

export default ImageGallery;
