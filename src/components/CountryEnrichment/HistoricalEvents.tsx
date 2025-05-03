
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

  useEffect(() => {
    const fetchHistoricalEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const historicalEvents = await countryEnrichmentApi.getHistoricalEvents(countryName);
        setEvents(historicalEvents);
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
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HistoryIcon className="h-5 w-5 text-primary" />
            Historical Events
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
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HistoryIcon className="h-5 w-5 text-primary" />
            Historical Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HistoryIcon className="h-5 w-5 text-primary" />
          Historical Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {events.length > 0 ? (
            events.map((event, index) => (
              <motion.div 
                key={index}
                variants={item}
                className="border-l-2 border-primary/30 pl-4 py-1"
              >
                <h3 className="font-bold text-sm text-primary">{event.year}</h3>
                <p className="text-sm">{event.event}</p>
              </motion.div>
            ))
          ) : (
            <p className="text-center text-muted-foreground">No historical events found for {countryName}.</p>
          )}
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default HistoricalEvents;
