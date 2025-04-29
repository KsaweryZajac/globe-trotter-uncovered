
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';
import { GlobeIcon, HeartIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-lg bg-background/90 border-b border-border">
        <div className="container py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="animate-float">🌍</span>
            <h1 className="text-2xl font-bold">Culture Explorer</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mt-16">
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Welcome to Culture Explorer</h2>
          <p className="text-muted-foreground max-w-2xl text-lg">
            Discover the world's cultures, languages, and stories through an interactive journey.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card className="w-full shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GlobeIcon className="h-5 w-5" />
                Search Countries
              </CardTitle>
              <CardDescription>
                Explore countries around the world and learn about their culture
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Search for any country by name or discover a random one. 
                View detailed information, latest news, and get interesting translations.
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/search" className="w-full">
                <Button className="w-full">
                  Start Searching
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          <Card className="w-full shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HeartIcon className="h-5 w-5" />
                Favorite Countries
              </CardTitle>
              <CardDescription>
                Access your collection of favorite countries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                View and manage your favorite countries. Quickly access detailed information 
                about the places that interest you most.
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/favorites" className="w-full">
                <Button className="w-full" variant="outline">
                  View Favorites
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        <div className="text-center mt-16">
          <div className="text-7xl mb-4 animate-float">🗺️</div>
          <h3 className="text-2xl font-bold mb-2">Ready to explore?</h3>
          <p className="text-muted-foreground mb-6">
            Start your cultural journey by searching for a country or checking your favorites.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/search">
              <Button size="lg" className="gap-2">
                <GlobeIcon className="h-5 w-5" />
                Search Countries
              </Button>
            </Link>
            <Link to="/favorites">
              <Button size="lg" variant="outline" className="gap-2">
                <HeartIcon className="h-5 w-5" />
                View Favorites
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mt-12 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Culture Explorer - A school project</p>
      </footer>
    </div>
  );
};

export default Index;
