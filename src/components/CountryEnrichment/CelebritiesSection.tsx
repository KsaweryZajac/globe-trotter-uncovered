
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

  // Non-person filter terms
  const nonPersonTerms = [
    'mountains', 'ethnic', 'group', 'list', 'range', 'region', 'river',
    'lake', 'forest', 'valley', 'cuisine', 'dish', 'food', 'park',
    'museum', 'monument', 'building', 'festival', 'event', 'tradition',
    'dance', 'music', 'instrument', 'team', 'city', 'province', 'district',
    'error', 'not found', 'disambiguation', 'category', 'index', 'list of'
  ];

  // Terms that indicate a real person
  const personIndicators = [
    'born', 'died', 'singer', 'actor', 'actress', 'politician', 'writer',
    'author', 'scientist', 'artist', 'musician', 'composer', 'director',
    'player', 'athlete', 'president', 'prime minister', 'king', 'queen',
    'emperor', 'empress', 'duke', 'duchess', 'prince', 'princess'
  ];

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
    const fetchCelebrities = async () => {
      try {
        setLoading(true);
        setError(null);
        let celebs = await countryEnrichmentApi.getCelebrities(countryName);
        
        // Clean up the description text
        celebs = celebs.map(celeb => ({
          ...celeb,
          description: cleanText(celeb.description),
          name: cleanText(celeb.name),
          profession: cleanText(celeb.profession)
        }));
        
        // Filter out non-person entries by checking for common indicators
        const filteredCelebs = celebs.filter(celeb => {
          const lowerCaseDescription = celeb.description.toLowerCase();
          const lowerCaseName = celeb.name.toLowerCase();
          const lowerCaseProfession = celeb.profession.toLowerCase();
          
          // Check for non-person indicators
          const isNonPerson = nonPersonTerms.some(term => 
            lowerCaseName.includes(term) || 
            lowerCaseProfession.includes(term) || 
            lowerCaseDescription.includes(`list of ${term}`) ||
            lowerCaseDescription.includes(`group of ${term}`)
          );
          
          // Check for person indicators
          const isPerson = personIndicators.some(term =>
            lowerCaseDescription.includes(term) ||
            lowerCaseProfession.includes(term)
          );
          
          // Additional checks for list-like entries
          const isListEntry = 
            lowerCaseName.includes('list') || 
            lowerCaseDescription.startsWith('list') ||
            lowerCaseName.includes(' of ') || 
            lowerCaseName.includes('most ') ||
            lowerCaseName.includes('error') ||
            lowerCaseName.includes('disambiguation');
          
          // Content length check to filter out poor quality entries
          const hasGoodContent = celeb.description.length > 20;
          
          return !isNonPerson && !isListEntry && (isPerson || hasGoodContent);
        });
        
        setCelebrities(filteredCelebs);
      } catch (err) {
        console.error('Failed to fetch celebrities:', err);
        setError('Could not load notable people.');
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
      <Card className="shadow-md hover:shadow-lg transition-shadow h-full">
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
      <Card className="shadow-md h-full">
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
    <Card className="shadow-md hover:shadow-lg transition-shadow h-full">
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
