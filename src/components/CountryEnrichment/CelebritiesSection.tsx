
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Celebrity } from '@/services/countryEnrichmentApi';
import countryEnrichmentApi from '@/services/countryEnrichmentApi';
import { Skeleton } from '@/components/ui/skeleton';

interface CelebritiesSectionProps {
  countryName: string;
}

const CelebritiesSection = ({ countryName }: CelebritiesSectionProps) => {
  const [celebrities, setCelebrities] = useState<Celebrity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCelebrities = async () => {
      try {
        setLoading(true);
        setError(null);
        const celebs = await countryEnrichmentApi.getCelebrities(countryName);
        setCelebrities(celebs);
      } catch (err) {
        console.error('Failed to fetch celebrities:', err);
        setError('Could not load celebrities.');
      } finally {
        setLoading(false);
      }
    };

    if (countryName) {
      fetchCelebrities();
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

  // Get initials from name for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (loading) {
    return (
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserIcon className="h-5 w-5 text-primary" />
            Notable People
          </CardTitle>
        </CardHeader>
        <CardContent>
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="flex items-start gap-4 mb-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-12 w-full" />
              </div>
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
            <UserIcon className="h-5 w-5 text-primary" />
            Notable People
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
          <UserIcon className="h-5 w-5 text-primary" />
          Notable People
        </CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          {celebrities.length > 0 ? (
            celebrities.map((celebrity, index) => (
              <motion.div 
                key={index} 
                variants={item}
                className="flex items-start gap-4"
              >
                <Avatar>
                  <AvatarFallback className="bg-primary/20 text-primary">
                    {getInitials(celebrity.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    {celebrity.name}
                    <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded">
                      {celebrity.profession}
                    </span>
                  </h3>
                  <p className="text-sm text-muted-foreground">{celebrity.description}</p>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-center text-muted-foreground">No notable people found for {countryName}.</p>
          )}
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default CelebritiesSection;
