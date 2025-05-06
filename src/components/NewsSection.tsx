
import { NewsArticle } from "@/services/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, Globe } from "lucide-react";

interface NewsSectionProps {
  news: NewsArticle[];
  isLoading: boolean;
  error: string | null;
  countryName: string;
}

const NewsSection = ({ news, isLoading, error, countryName }: NewsSectionProps) => {
  // Format date to be more readable
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Unknown date';
      }
      
      // Get time difference in days
      const diffTime = Math.abs(Date.now() - date.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        return 'Today';
      } else if (diffDays === 1) {
        return 'Yesterday';
      } else if (diffDays < 7) {
        return `${diffDays} days ago`;
      } else {
        return date.toLocaleDateString(undefined, { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        });
      }
    } catch (e) {
      return 'Unknown date';
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          Latest News about {countryName}
        </CardTitle>
        <CardDescription>Recent articles and updates from {countryName}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(index => (
              <div key={index} className="flex flex-col space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-12 w-full" />
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-4 border border-muted rounded-lg">
            <div className="text-destructive">{error}</div>
          </div>
        ) : news && news.length > 0 ? (
          <ul className="space-y-4">
            {news.map((article, index) => (
              <li key={index}>
                <a 
                  href={article.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block hover:bg-secondary p-3 rounded-md transition-colors"
                >
                  <div className="flex gap-4">
                    {article.urlToImage && (
                      <div className="hidden md:block flex-shrink-0">
                        <img 
                          src={article.urlToImage} 
                          alt={article.title}
                          className="w-24 h-16 object-cover rounded"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium flex items-center gap-1">
                        {article.title}
                        <ExternalLink className="h-3 w-3 inline flex-shrink-0 opacity-50" />
                      </h3>
                      <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                        {article.description}
                      </p>
                      <div className="text-xs text-muted-foreground mt-2">
                        {article.source.name} · {formatDate(article.publishedAt)}
                      </div>
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8 border border-muted rounded-lg">
            <div className="text-muted-foreground">No news articles found for {countryName}.</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NewsSection;
