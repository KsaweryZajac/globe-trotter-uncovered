
import React, { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Expand } from 'lucide-react';

interface ImageGalleryProps {
  country: string;
  numberOfImages?: number;
}

interface PexelsPhoto {
  id: number;
  src: {
    medium: string;
    large: string;
    original: string;
  };
  alt: string;
  photographer: string;
  url: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ 
  country, 
  numberOfImages = 5 
}) => {
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});
  const [imageUrls, setImageUrls] = useState<PexelsPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [expandedGallery, setExpandedGallery] = useState<PexelsPhoto[]>([]);
  const [expandedLoading, setExpandedLoading] = useState(false);
  const [expandedLoadedImages, setExpandedLoadedImages] = useState<Record<number, boolean>>({});
  
  // Fetch initial images for preview
  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        // Use Pexels API with landscape, cities, and nature focus, excluding people
        const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(country)}+landscape+cities+nature+-people&per_page=${numberOfImages}&orientation=landscape`, {
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
            large: `https://via.placeholder.com/800x600?text=${encodeURIComponent(country)}+Image+${index+1}`,
            original: `https://via.placeholder.com/1200x900?text=${encodeURIComponent(country)}+Image+${index+1}`
          },
          alt: `Placeholder for ${country}`,
          photographer: 'Placeholder',
          url: '#'
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
  
  // Fetch expanded gallery images
  const fetchExpandedGallery = async () => {
    if (expandedGallery.length > 0) return; // Don't refetch if we already have images
    
    setExpandedLoading(true);
    try {
      // Fetch more images (16) for the expanded gallery
      const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(country)}+landscape+cities+nature+-people&per_page=16&orientation=landscape`, {
        headers: {
          Authorization: 'jEYY0FYmW1VakicDe2EOkxo19GbNNrufNNZ40KiSCWnVg1291swHRaDA'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch gallery images');
      }
      
      const data = await response.json();
      setExpandedGallery(data.photos || []);
    } catch (error) {
      console.error('Failed to fetch expanded gallery:', error);
      toast.error('Failed to load full gallery');
      // Use the existing smaller set as fallback
      setExpandedGallery(imageUrls);
    } finally {
      setExpandedLoading(false);
    }
  };
  
  const handleImageLoaded = (index: number) => {
    setLoadedImages(prev => ({
      ...prev,
      [index]: true
    }));
  };

  const handleExpandedImageLoaded = (index: number) => {
    setExpandedLoadedImages(prev => ({
      ...prev,
      [index]: true
    }));
  };

  const openFullscreen = (index: number) => {
    setSelectedImageIndex(index);
    fetchExpandedGallery();
    setFullscreenOpen(true);
  };

  return (
    <div className="w-full">
      {loading ? 
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {Array.from({ length: numberOfImages }).map((_, index) => (
            <Skeleton key={`skeleton-${index}`} className="w-full aspect-[4/3]" />
          ))}
        </div> :
        <>
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
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => openFullscreen(index)}
                >
                  <Expand className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-muted-foreground">Images from Pexels</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                fetchExpandedGallery();
                setFullscreenOpen(true);
              }}
              className="text-xs flex items-center gap-1"
            >
              <Expand className="h-3 w-3" />
              <span>View Full Gallery</span>
            </Button>
          </div>
        </>
      }

      {/* Fullscreen Gallery Dialog */}
      <Dialog open={fullscreenOpen} onOpenChange={setFullscreenOpen}>
        <DialogContent className="max-w-screen-lg w-[90vw]">
          <DialogHeader>
            <DialogTitle className="text-center mb-4">
              {country} Photo Gallery
            </DialogTitle>
          </DialogHeader>
          
          <div className="relative">
            {expandedLoading ? (
              <div className="flex justify-center p-12">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {expandedGallery.map((photo, index) => (
                  <div key={photo.id} className="relative aspect-[4/3] group">
                    {!expandedLoadedImages[index] && (
                      <Skeleton className="absolute inset-0 w-full h-full" />
                    )}
                    <img 
                      src={photo.src.medium}
                      alt={photo.alt || `Photo of ${country}`}
                      className={`w-full h-full object-cover rounded-md transition-opacity duration-300 ${expandedLoadedImages[index] ? 'opacity-100' : 'opacity-0'} hover:scale-[1.02] transition-transform`}
                      onLoad={() => handleExpandedImageLoaded(index)}
                      loading="lazy"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-xs text-white truncate">by {photo.photographer}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex justify-center mt-4">
              <p className="text-xs text-muted-foreground">Images from Pexels</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImageGallery;
