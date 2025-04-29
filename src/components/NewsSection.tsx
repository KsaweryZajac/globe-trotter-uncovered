
import { NewsArticle } from "@/services/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface NewsSectionProps {
  news: NewsArticle[];
  isLoading: boolean;
  error: string | null;
  countryName: string;
}

const NewsSection = ({ news, isLoading, error, countryName }: NewsSectionProps) => {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Latest News about {countryName}</CardTitle>
        <CardDescription>Recent articles related to {countryName}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">
            <div className="text-muted-foreground">Loading news...</div>
          </div>
        ) : error ? (
          <div className="text-center py-4">
            <div className="text-destructive">{error}</div>
          </div>
        ) : news && news.length > 0 ? (
          <ul className="space-y-4">
            {news.slice(0, 3).map((article, index) => (
              <li key={index}>
                <a 
                  href={article.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block hover:bg-secondary p-2 rounded-md transition-colors"
                >
                  <h3 className="font-medium">{article.title}</h3>
                  <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                    {article.description}
                  </p>
                  <div className="text-xs text-muted-foreground mt-1">
                    {article.source.name} · {new Date(article.publishedAt).toLocaleDateString()}
                  </div>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-4">
            <div className="text-muted-foreground">No news articles found for {countryName}.</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NewsSection;
