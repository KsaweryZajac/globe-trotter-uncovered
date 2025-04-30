
import React from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface QuoteDisplayProps {
  quote: {
    content: string;
    author: string;
  } | null;
  isLoading: boolean;
  error: string | null;
}

const QuoteDisplay: React.FC<QuoteDisplayProps> = ({ quote, isLoading, error }) => {
  if (isLoading) {
    return (
      <Card className="p-4 mt-4">
        <div className="flex flex-col space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4 mt-4 border-destructive">
        <p className="text-destructive">Failed to load quote: {error}</p>
      </Card>
    );
  }

  if (!quote) {
    return null;
  }

  return (
    <Card className="p-4 mt-4">
      <blockquote className="italic">"{quote.content}"</blockquote>
      <p className="text-right mt-2">— {quote.author}</p>
    </Card>
  );
};

export default QuoteDisplay;
