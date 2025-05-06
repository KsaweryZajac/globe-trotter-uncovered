
import React, { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

interface ImageGalleryProps {
  country: string;
  numberOfImages?: number;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ 
  country, 
  numberOfImages = 5 
}) => {
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        // Using Unsplash Source API which doesn't require authentication
        // Adding a timestamp to prevent caching and get different images
        const urls = Array.from({ length: numberOfImages }).map((_, index) => 
          `https://source.unsplash.com/featured/800x600?${encodeURIComponent(country)}&sig=${Date.now() + index}`
        );
        setImageUrls(urls);
      } catch (error) {
        console.error('Failed to fetch images:', error);
        toast.error('Failed to load country images');
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
          {imageUrls.map((url, index) => (
            <div key={index} className="relative rounded-md overflow-hidden aspect-[4/3] group">
              {!loadedImages[index] && (
                <Skeleton className="absolute inset-0 w-full h-full" />
              )}
              <img
                src={url}
                alt={`Image ${index + 1} of ${country}`}
                className={`w-full h-full object-cover transition-all duration-500 ${loadedImages[index] ? 'opacity-100' : 'opacity-0'} group-hover:scale-105`}
                onLoad={() => handleImageLoaded(index)}
                onError={(e) => {
                  // Fallback to a placeholder if the image fails to load
                  const target = e.target as HTMLImageElement;
                  target.src = `https://via.placeholder.com/800x600?text=${encodeURIComponent(country)}+${index+1}`;
                  handleImageLoaded(index);
                }}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
            </div>
          ))}
        </div>
      }
      <p className="text-xs text-muted-foreground mt-2 text-right">Images from Unsplash</p>
    </div>
  );
};

export default ImageGallery;
