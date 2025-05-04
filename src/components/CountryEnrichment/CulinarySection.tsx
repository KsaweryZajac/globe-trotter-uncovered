
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UtensilsIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CulinaryInfo } from '@/services/countryEnrichmentApi';
import countryEnrichmentApi from '@/services/countryEnrichmentApi';
import { Skeleton } from '@/components/ui/skeleton';

interface CulinarySectionProps {
  countryName: string;
}

const CulinarySection = ({ countryName }: CulinarySectionProps) => {
  const [culinaryItems, setCulinaryItems] = useState<CulinaryInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCulinaryInfo = async () => {
      try {
        setLoading(true);
        setError(null);
        const info = await countryEnrichmentApi.getCulinaryInfo(countryName);
        setCulinaryItems(info);
      } catch (err) {
        console.error('Failed to fetch culinary information:', err);
        setError('Could not load culinary information.');
      } finally {
        setLoading(false);
      }
    };

    if (countryName) {
      fetchCulinaryInfo();
    }
  }, [countryName]);

  // Define the variants properly
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <Card className="shadow-md hover:shadow-lg transition-shadow h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UtensilsIcon className="h-5 w-5 text-primary" />
            Culinary Specialties
          </CardTitle>
        </CardHeader>
        <CardContent>
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="mb-4">
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-16 w-full" />
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
            <UtensilsIcon className="h-5 w-5 text-primary" />
            Culinary Specialties
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
          <UtensilsIcon className="h-5 w-5 text-primary" />
          Culinary Specialties
        </CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div 
          variants={containerVariants as any}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          {culinaryItems.length > 0 ? (
            culinaryItems.map((item, index) => (
              <motion.div 
                key={index} 
                variants={itemVariants as any}
                className="flex flex-col md:flex-row gap-4"
              >
                <h3 className="font-bold mb-1">{item.dish || 'Unknown dish'}</h3>
                <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                {item.image && (
                  <img src={item.image} alt={item.dish || 'Dish image'} className="w-full h-40 object-cover mb-2" />
                )}
                {item.ingredients && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {item.ingredients.map((ingredient, i) => (
                      <Badge key={i} variant="outline" className="bg-secondary/50">
                        {ingredient}
                      </Badge>
                    ))}
                  </div>
                )}
              </motion.div>
            ))
          ) : (
            <p className="text-center text-muted-foreground">No culinary information found for {countryName}.</p>
          )}
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default CulinarySection;
