
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HistoryIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HistoricalEvent } from '@/services/countryEnrichmentApi';
import countryEnrichmentApi from '@/services/countryEnrichmentApi';
import { Skeleton } from '@/components/ui/skeleton';

interface HistoricalEventsProps {
  countryName: string;
}

const HistoricalEvents = ({ countryName }: HistoricalEventsProps) => {
  const [events, setEvents] = useState<HistoricalEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Clean text function to remove common artifacts
  const cleanText = (text: string): string => {
    if (!text) return '';

    return text
      // Remove HTML entities
      .replace(/&quot;/g, '"')
      .replace(/&gt;/g, '>')
      .replace(/&lt;/g, '<')
      .replace(/&amp;/g, '&')
      // Remove citation references [1], [2], etc.
      .replace(/\[\d+\]/g, '')
      // Remove other common markers
      .replace(/\^/g, '')
      // Remove multiple spaces
      .replace(/\s+/g, ' ')
      // Clean up trailing punctuation irregularities
      .replace(/\s+[.,;:]\s*$/g, '')
      .trim();
  };

  // Parse year from text
  const parseYear = (text: string): string => {
    // Look for year patterns in the text
    const yearPatterns = [
      // Year range patterns
      /\b(\d{3,4})[-–—](\d{2,4})\b/,
      /\b(\d{3,4})s\b/,
      // Simple year patterns
      /\b(\d{3,4})\s*(BC|BCE|AD|CE)?\b/i,
      /\b(BC|BCE|AD|CE)?\s*(\d{3,4})\b/i,
      // Text formats
      /\b(in|around|circa|c\.)\s+(\d{3,4})\b/i,
    ];
    
    for (const pattern of yearPatterns) {
      const match = text.match(pattern);
      if (match) {
        // Return the full match as the year
        return match[0];
      }
    }
    
    // If no year pattern is found, look for century expressions
    const centuryPatterns = [
      /\b(\d{1,2})(st|nd|rd|th)\s+century\b/i,
      /\bearly\s+(\d{1,2})(st|nd|rd|th)\s+century\b/i,
      /\bmid\s+(\d{1,2})(st|nd|rd|th)\s+century\b/i,
      /\blate\s+(\d{1,2})(st|nd|rd|th)\s+century\b/i,
    ];
    
    for (const pattern of centuryPatterns) {
      const match = text.match(pattern);
      if (match) {
        return match[0];
      }
    }
    
    // Return a default if no pattern matches
    return 'Historical';
  };

  useEffect(() => {
    const fetchHistoricalEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const historicalEvents = await countryEnrichmentApi.getHistoricalEvents(countryName);
        
        // Clean up the event text and extract years
        const processedEvents = historicalEvents.map(event => {
          const cleanedText = cleanText(event.event);
          
          // Try to extract a year if not provided
          const year = event.year && event.year !== 'Unknown' 
            ? event.year 
            : parseYear(cleanedText);
          
          return {
            ...event,
            event: cleanedText,
            year: year
          };
        });
        
        // Filter out events with no useful content
        const validEvents = processedEvents.filter(event => 
          event.event.length > 10 && 
          !event.event.toLowerCase().includes('error') &&
          !event.event.toLowerCase().includes('not found')
        );
        
        // Sort by year in ascending order (oldest first)
        const sortedEvents = [...validEvents].sort((a, b) => {
          // Extract numeric values from year strings if needed
          const yearAText = String(a.year).replace(/[^0-9]/g, '');
          const yearBText = String(b.year).replace(/[^0-9]/g, '');
          
          const yearA = yearAText ? parseInt(yearAText) : 0;
          const yearB = yearBText ? parseInt(yearBText) : 0;
          
          // Handle BC/BCE years (negative numbers) and non-numeric years
          if (isNaN(yearA) && isNaN(yearB)) return 0;
          if (isNaN(yearA)) return 1;
          if (isNaN(yearB)) return -1;
          
          // For BC/BCE years, we need to handle as negative numbers
          const adjustedYearA = String(a.year).includes('BC') ? -yearA : yearA;
          const adjustedYearB = String(b.year).includes('BC') ? -yearB : yearB;
          
          return adjustedYearA - adjustedYearB;
        });
        
        setEvents(sortedEvents);
      } catch (err) {
        console.error('Failed to fetch historical events:', err);
        setError('Could not load historical events.');
      } finally {
        setLoading(false);
      }
    };

    if (countryName) {
      fetchHistoricalEvents();
    }
  }, [countryName]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <Card className="shadow-md hover:shadow-lg transition-shadow h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HistoryIcon className="h-5 w-5 text-primary" />
            Historical Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="mb-4">
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-12 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-md h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HistoryIcon className="h-5 w-5 text-primary" />
            Historical Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HistoryIcon className="h-5 w-5 text-primary" />
          Historical Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-4 relative"
        >
          {events.length > 0 ? (
            <div className="relative border-l-2 border-primary/30 ml-2">
              {events.map((event, index) => (
                <motion.div 
                  key={index}
                  variants={item}
                  className="ml-6 mb-6 relative"
                >
                  {/* Timeline dot */}
                  <div className="absolute w-4 h-4 bg-primary rounded-full -left-[21px] top-0"></div>
                  
                  <h3 className="font-bold text-sm text-primary">{event.year}</h3>
                  <p className="text-sm mt-1">{event.event}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No historical events found for {countryName}.</p>
          )}
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default HistoricalEvents;
