
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeftIcon, FlagIcon, UsersIcon, TrophyIcon, CopyIcon, RefreshCwIcon } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import FlagQuizCard from '@/components/FlagQuiz/FlagQuizCard';
import FlagQuizMultiplayer from '@/components/FlagQuiz/FlagQuizMultiplayer';
import api from '@/services/api';

const STORAGE_KEY = 'flagQuizLeaderboard';

type LeaderboardEntry = {
  name: string;
  score: number;
  date: string;
};

const FlagQuiz = () => {
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [countries, setCountries] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('solo');
  const [playerName, setPlayerName] = useState('');
  const [lobbyCode, setLobbyCode] = useState('');
  const [joinLobbyCode, setJoinLobbyCode] = useState('');
  const [multiplayerMode, setMultiplayerMode] = useState<'create' | 'join' | 'play'>('create');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  // Check for lobby code in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const lobbyCodeParam = params.get('lobby');
    
    if (lobbyCodeParam) {
      setLobbyCode(lobbyCodeParam);
      setActiveTab('multiplayer');
      setMultiplayerMode('play');
    }
  }, [location]);

  // Fetch countries for the quiz
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const allCountries = await api.getAllCountries();
        setCountries(allCountries);
      } catch (error) {
        console.error('Failed to fetch countries:', error);
        toast({
          title: "Error",
          description: "Failed to load countries. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountries();
    
    // Load leaderboard from localStorage
    const storedLeaderboard = localStorage.getItem(STORAGE_KEY);
    if (storedLeaderboard) {
      setLeaderboard(JSON.parse(storedLeaderboard));
    }

    // Load player name from localStorage if available
    const savedPlayerName = localStorage.getItem('flagQuizPlayerName');
    if (savedPlayerName) {
      setPlayerName(savedPlayerName);
    }
  }, []);

  // Save player name to localStorage when it changes
  useEffect(() => {
    if (playerName) {
      localStorage.setItem('flagQuizPlayerName', playerName);
    }
  }, [playerName]);

  // Update leaderboard with new score
  const updateLeaderboard = (name: string, score: number) => {
    const newEntry = { name, score, date: new Date().toISOString() };
    const updatedLeaderboard = [...leaderboard, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10); // Keep only top 10
    
    setLeaderboard(updatedLeaderboard);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLeaderboard));
    
    toast({
      title: "Score Saved",
      description: `Your score of ${score} has been added to the leaderboard!`,
    });
  };

  // Copy lobby code to clipboard
  const handleCopyLobbyCode = () => {
    navigator.clipboard.writeText(lobbyCode);
    toast({
      title: "Copied!",
      description: "Lobby code copied to clipboard",
    });
  };

  // Reset the multiplayer form
  const handleResetLobby = () => {
    setMultiplayerMode('create');
    setLobbyCode('');
    setJoinLobbyCode('');
  };

  // Handle Go to Multiplayer button click
  const handleGoToMultiplayer = () => {
    if (!playerName) {
      toast({
        title: "Enter Your Name",
        description: "Please enter your name before starting multiplayer",
      });
      return;
    }
    
    // Generate a random 5-character lobby code
    const randomCode = Math.random().toString(36).substring(2, 7).toUpperCase();
    setLobbyCode(randomCode);
    
    setActiveTab('multiplayer');
    setMultiplayerMode('play');
    
    // Update URL with lobby code
    navigate(`/flag-quiz?lobby=${randomCode}`);
    
    toast({
      title: "Multiplayer Started",
      description: `Lobby code: ${randomCode}. Share this with friends!`,
    });
  };

  return (
    <div className="min-h-screen pb-8 bg-gradient-to-b from-background to-background/90">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-lg bg-background/90 border-b border-border">
        <div className="container py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeftIcon className="h-4 w-4" />
              <span>Back</span>
            </Link>
            <div className="h-5 w-px bg-border mx-2" />
            <div className="flex items-center">
              <FlagIcon className="h-5 w-5 mr-2 text-primary" />
              <h1 className="text-2xl font-bold">Flag Quiz</h1>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mt-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-4 bg-muted/50">
            <TabsTrigger value="solo">Solo Play</TabsTrigger>
            <TabsTrigger value="multiplayer">Multiplayer</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>
          
          {/* Solo Play Tab */}
          <TabsContent value="solo">
            <div className="max-w-3xl mx-auto">
              <Card className="border-primary/10 shadow-lg">
                <CardHeader className="bg-primary/5 rounded-t-lg">
                  <CardTitle>Single Player Mode</CardTitle>
                  <CardDescription>Test your knowledge of world flags. Answer as many questions correctly as you can!</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="mb-4">
                    <label htmlFor="player-name-solo" className="block text-sm font-medium mb-1">
                      Your Name (for Leaderboard)
                    </label>
                    <Input
                      id="player-name-solo"
                      placeholder="Enter your name"
                      value={playerName}
                      onChange={e => setPlayerName(e.target.value)}
                      className="max-w-xs"
                    />
                  </div>
                  
                  {isLoading ? (
                    <div className="text-center py-8">
                      <p>Loading quiz...</p>
                    </div>
                  ) : (
                    <FlagQuizCard 
                      countries={countries}
                      onGameComplete={(score, total) => {
                        if (playerName) {
                          updateLeaderboard(playerName, score);
                        } else {
                          toast({
                            title: "Enter Your Name",
                            description: "Set a name to save your score to the leaderboard!",
                          });
                        }
                      }}
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Multiplayer Tab */}
          <TabsContent value="multiplayer">
            <div className="max-w-3xl mx-auto">
              {multiplayerMode === 'play' ? (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Multiplayer Game</h2>
                    <div className="flex items-center gap-2 bg-muted p-2 rounded-md">
                      <p className="text-sm font-medium">Lobby: {lobbyCode}</p>
                      <Button variant="ghost" size="sm" onClick={handleCopyLobbyCode}>
                        <CopyIcon className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={handleResetLobby}>
                        <RefreshCwIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {isLoading ? (
                    <div className="text-center py-8">
                      <p>Loading multiplayer quiz...</p>
                    </div>
                  ) : (
                    <FlagQuizMultiplayer 
                      countries={countries}
                      playerName={playerName}
                      lobbyCode={lobbyCode}
                      onGameComplete={(score, total) => {
                        updateLeaderboard(playerName, score);
                      }}
                    />
                  )}
                </div>
              ) : (
                <Card className="border-primary/10 shadow-lg">
                  <CardHeader className="bg-primary/5 rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <UsersIcon className="h-5 w-5 text-primary" /> 
                      Multiplayer Flag Quiz
                    </CardTitle>
                    <CardDescription>
                      Play with friends in real-time or compete for the highest score
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="player-name" className="block text-sm font-medium mb-1">
                          Your Name
                        </label>
                        <Input
                          id="player-name"
                          placeholder="Enter your name"
                          value={playerName}
                          onChange={e => setPlayerName(e.target.value)}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        <div className="p-4 border rounded-lg bg-gradient-to-br from-primary/5 to-transparent">
                          <h3 className="text-base font-medium mb-2">Join the Real-Time Multiplayer</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Our multiplayer feature uses a unique code that you can share with friends!
                          </p>
                          <Button 
                            className="w-full bg-primary hover:bg-primary/80" 
                            onClick={handleGoToMultiplayer}
                          >
                            Go to Multiplayer
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard">
            <div className="max-w-3xl mx-auto">
              <Card className="border-primary/10 shadow-lg">
                <CardHeader className="bg-primary/5 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <TrophyIcon className="h-5 w-5 text-primary" /> 
                    Global Leaderboard
                  </CardTitle>
                  <CardDescription>
                    Top players and their high scores
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {leaderboard.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No scores yet. Be the first to play and set a high score!
                    </div>
                  ) : (
                    <div className="border rounded-md overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-muted">
                            <th className="px-4 py-2 text-left">Rank</th>
                            <th className="px-4 py-2 text-left">Player</th>
                            <th className="px-4 py-2 text-right">Score</th>
                            <th className="px-4 py-2 text-right">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {leaderboard.map((entry, index) => (
                            <tr key={index} className={index === 0 ? "bg-primary/10 border-t" : "border-t"}>
                              <td className="px-4 py-2">{index + 1}</td>
                              <td className="px-4 py-2 font-medium">{entry.name}</td>
                              <td className="px-4 py-2 text-right">{entry.score}</td>
                              <td className="px-4 py-2 text-right text-muted-foreground text-sm">
                                {new Date(entry.date).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Footer */}
      <footer className="container mt-12 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Culture Explorer - Zajac Ksawery</p>
      </footer>
    </div>
  );
};

export default FlagQuiz;
