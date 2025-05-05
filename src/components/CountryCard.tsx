
// This component is read-only, so we need to create a custom style wrapper for it

import React from 'react';
import { Card } from '@/components/ui/card';

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

interface SmallerFlagWrapperProps {
  children: React.ReactNode;
}

const SmallerFlagWrapper: React.FC<SmallerFlagWrapperProps> = ({ children }) => {
  // Apply the custom class to the wrapper
  return <div className="country-card">{children}</div>;
};

export default SmallerFlagWrapper;
