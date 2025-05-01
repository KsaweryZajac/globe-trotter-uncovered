
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';
import { GlobeIcon, HeartIcon, MapIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import FlagQuizCard from '@/components/FlagQuiz/FlagQuizCard';
import api from '@/services/api';

const Index = () => {
  const [countries, setCountries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch a set of random countries for the flag quiz
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();
        setCountries(data);
      } catch (error) {
        console.error('Failed to fetch countries:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountries();
  }, []);

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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
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
          
          <Card className="w-full shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapIcon className="h-5 w-5" />
                Trip Planner
              </CardTitle>
              <CardDescription>
                Plan your next adventure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Create detailed travel itineraries, explore destinations, 
                check weather forecasts, and estimate costs for your trips.
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/trip-planner" className="w-full">
                <Button className="w-full" variant="outline">
                  Plan a Trip
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        <div className="max-w-6xl mx-auto mt-12">
          {!isLoading && <FlagQuizCard countries={countries} />}
        </div>

        <div className="text-center mt-16">
          <div className="text-7xl mb-4 animate-float">🗺️</div>
          <h3 className="text-2xl font-bold mb-2">Ready to explore?</h3>
          <p className="text-muted-foreground mb-6">
            Start your cultural journey by searching for a country, planning a trip, or testing your knowledge with our flag quiz.
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
            <Link to="/trip-planner">
              <Button size="lg" variant="outline" className="gap-2">
                <MapIcon className="h-5 w-5" />
                Plan a Trip
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
