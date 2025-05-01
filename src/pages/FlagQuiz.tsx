
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FlagIcon, UsersIcon, UserIcon, HeartIcon, ArrowLeftIcon, TrophyIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import ThemeToggle from '@/components/ThemeToggle';
import FlagQuizCard from '@/components/FlagQuiz/FlagQuizCard';
import FlagQuizMultiplayer from '@/components/FlagQuiz/FlagQuizMultiplayer';
import api, { Country } from '@/services/api';

const FlagQuiz = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const lobbyCode = queryParams.get('lobby');
  const [activeTab, setActiveTab] = useState<string>(lobbyCode ? 'multiplayer' : 'solo');

  // Fetch countries for the flag quiz
  useEffect(() => {
    const fetchCountries = async () => {
      setIsLoading(true);
      try {
        const allCountries = await api.getAllCountries();
        setCountries(allCountries.filter(country => 
          country.flags && (country.flags.png || country.flags.svg)
        ));
      } catch (error) {
        console.error('Failed to fetch countries:', error);
        toast({
          title: 'Error',
          description: 'Failed to load countries. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountries();
  }, [toast]);

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-lg bg-background/90 border-b border-border">
        <div className="container py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <span className="animate-float">🌍</span>
              <h1 className="text-2xl font-bold">Culture Explorer</h1>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/favorites">
              <Button variant="outline" className="flex items-center gap-2">
                <HeartIcon size={16} />
                <span className="hidden sm:inline">Favorites</span>
              </Button>
            </Link>
            <Link to="/search">
              <Button variant="outline" className="flex items-center gap-2">
                <FlagIcon size={16} />
                <span className="hidden sm:inline">Search</span>
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mt-8">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            className="mb-6" 
            onClick={() => navigate('/')}
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" /> Back to Home
          </Button>
          
          <div className="flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <FlagIcon className="h-6 w-6" />
              Flag Quiz
            </h2>
            <p className="text-muted-foreground max-w-2xl mb-6">
              Test your knowledge of world flags! Choose between solo play or multiplayer mode.
            </p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mx-auto max-w-4xl">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="solo" className="flex items-center gap-2">
                <UserIcon className="h-4 w-4" />
                Solo Play
              </TabsTrigger>
              <TabsTrigger value="multiplayer" className="flex items-center gap-2">
                <UsersIcon className="h-4 w-4" />
                Multiplayer
              </TabsTrigger>
            </TabsList>
            <TabsContent value="solo" className="mt-6">
              {!isLoading && countries.length > 0 ? (
                <FlagQuizCard countries={countries} />
              ) : (
                <Card className="w-full shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="flex justify-center items-center h-48">
                    <p>Loading quiz...</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            <TabsContent value="multiplayer" className="mt-6">
              <FlagQuizMultiplayer countries={countries} initialLobbyCode={lobbyCode} isLoading={isLoading} />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mt-12 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Culture Explorer - A school project</p>
      </footer>
    </div>
  );
};

export default FlagQuiz;
