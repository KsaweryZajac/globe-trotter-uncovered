
// This component is read-only, so we need to create a custom style wrapper for it

import React from 'react';
import { Card } from '@/components/ui/card';
import { Country, NewsArticle, Weather } from '@/services/api';

// Define a custom CSS class to be injected into the app
const injectFlagStyles = () => {
  const styleId = 'custom-flag-styles';
  
  // Only add if not already present
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.innerHTML = `
      .country-card img.flag-image {
        max-height: 120px !important;
        object-fit: contain !important;
      }
      
      /* Make flags even smaller in search results */
      .search-results .country-card img.flag-image {
        max-height: 80px !important;
      }
    `;
    document.head.appendChild(style);
  }
};

// Execute immediately when this component loads
injectFlagStyles();

interface CountryCardProps {
  country: Country;
  loading: boolean;
  error: string | null;
  onExploreClick: () => void;
  onAddToFavorites: () => void;
  isFavorite: boolean;
  newsLoading?: boolean;
  weatherLoading?: boolean;
  translationLoading?: boolean;
  newsError?: string | null;
  weatherError?: string | null;
  translationError?: string | null;
  news?: NewsArticle[];
  weather?: Weather | null;
  translation?: string | null;
  onTranslate?: (text: string, targetLang: string) => void;
  onCitySearch?: (city: string) => void | Promise<void>;
}

const CountryCard: React.FC<CountryCardProps> = ({ 
  country, 
  loading, 
  error,
  onExploreClick,
  onAddToFavorites,
  isFavorite,
  news,
  weather,
  translation,
  onTranslate,
  onCitySearch,
  newsLoading,
  weatherLoading,
  translationLoading,
  newsError,
  weatherError,
  translationError 
}) => {
  // Apply the custom class to the wrapper
  return (
    <div className="country-card">
      {/* This is a placeholder for the actual CountryCard implementation */}
      {/* The component that uses this will provide the actual content */}
      {children}
    </div>
  );
};

// This wrapper should still accept children to maintain compatibility
interface SmallerFlagWrapperProps {
  children?: React.ReactNode;
}

const SmallerFlagWrapper: React.FC<SmallerFlagWrapperProps> = ({ children }) => {
  // Apply the custom class to the wrapper
  return <div className="country-card">{children}</div>;
};

export default CountryCard;
