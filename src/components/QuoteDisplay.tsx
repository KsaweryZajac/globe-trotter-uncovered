
import { Quote } from "@/services/api";
import { Card, CardContent } from "@/components/ui/card";

interface QuoteDisplayProps {
  quote: Quote | null;
  isLoading: boolean;
  error: string | null;
}

const QuoteDisplay = ({ quote, isLoading, error }: QuoteDisplayProps) => {
  return (
    <Card className="shadow-sm mt-4">
      <CardContent className="pt-6">
        {isLoading ? (
          <div className="text-center py-4">
            <div className="text-muted-foreground">Loading quote...</div>
          </div>
        ) : error ? (
          <div className="text-center py-4">
            <div className="text-destructive">{error}</div>
          </div>
        ) : quote ? (
          <figure className="flex flex-col gap-2">
            <blockquote className="italic text-muted-foreground">
              "{quote.content}"
            </blockquote>
            <figcaption className="text-right text-sm font-medium">
              &mdash; {quote.author}
            </figcaption>
          </figure>
        ) : (
          <div className="text-center py-4">
            <div className="text-muted-foreground">No quote found. Try searching for a country.</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuoteDisplay;
