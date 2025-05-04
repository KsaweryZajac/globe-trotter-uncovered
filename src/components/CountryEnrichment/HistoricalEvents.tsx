
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

  useEffect(() => {
    const fetchHistoricalEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const historicalEvents = await countryEnrichmentApi.getHistoricalEvents(countryName);
        
        // Clean up the event text
        const cleanedEvents = historicalEvents.map(event => ({
          ...event,
          event: cleanText(event.event)
        }));
        
        // Sort by year in ascending order (oldest first)
        const sortedEvents = [...cleanedEvents].sort((a, b) => {
          // Extract numeric values from year strings if needed
          const yearA = typeof a.year === 'string' ? parseInt(a.year) : a.year;
          const yearB = typeof b.year === 'string' ? parseInt(b.year) : b.year;
          
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
