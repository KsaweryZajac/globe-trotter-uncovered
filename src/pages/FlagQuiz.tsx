
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

const generateLobbyCode = (): string => {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed similar-looking characters
  let result = '';
  for (let i = 0; i < 5; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

type LeaderboardEntry = {
  name: string;
  score: number;
  date: string;
};

const FlagQuiz = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [countries, setCountries] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('solo');
  const [playerName, setPlayerName] = useState('');
  const [lobbyCode, setLobbyCode] = useState('');
  const [joinLobbyCode, setJoinLobbyCode] = useState('');
  const [multiplayerMode, setMultiplayerMode] = useState<'create' | 'join' | 'play'>('create');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

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
  }, []);

  // Create a new lobby
  const handleCreateLobby = () => {
    if (!playerName) {
      toast({
        title: "Enter Your Name",
        description: "Please enter your name before creating a lobby.",
        variant: "destructive"
      });
      return;
    }
    
    const newLobbyCode = generateLobbyCode();
    setLobbyCode(newLobbyCode);
    setMultiplayerMode('play');
    
    toast({
      title: "Lobby Created",
      description: `Your lobby code is: ${newLobbyCode}`,
    });
  };

  // Join an existing lobby
  const handleJoinLobby = () => {
    if (!playerName) {
      toast({
        title: "Enter Your Name",
        description: "Please enter your name before joining a lobby.",
        variant: "destructive"
      });
      return;
    }
    
    if (!joinLobbyCode) {
      toast({
        title: "Enter Lobby Code",
        description: "Please enter a lobby code to join.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real implementation, this would verify the lobby code with a backend
    // For now, we'll just accept any valid format
    if (joinLobbyCode.length !== 5) {
      toast({
        title: "Invalid Code",
        description: "The lobby code should be 5 characters long.",
        variant: "destructive"
      });
      return;
    }
    
    setLobbyCode(joinLobbyCode.toUpperCase());
    setMultiplayerMode('play');
    
    toast({
      title: "Lobby Joined",
      description: `You've joined lobby: ${joinLobbyCode.toUpperCase()}`,
    });
  };

  // Reset the multiplayer form
  const handleResetLobby = () => {
    setMultiplayerMode('create');
    setLobbyCode('');
    setJoinLobbyCode('');
  };

  // Copy lobby code to clipboard
  const handleCopyLobbyCode = () => {
    navigator.clipboard.writeText(lobbyCode);
    toast({
      title: "Copied!",
      description: "Lobby code copied to clipboard",
    });
  };

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

  return (
    <div className="min-h-screen pb-8">
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
              <FlagIcon className="h-5 w-5 mr-2" />
              <h1 className="text-2xl font-bold">Flag Quiz</h1>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mt-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="solo">Solo Play</TabsTrigger>
            <TabsTrigger value="multiplayer">Multiplayer</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>
          
          {/* Solo Play Tab */}
          <TabsContent value="solo">
            <div className="max-w-3xl mx-auto">
              <div className="mb-4">
                <h2 className="text-xl font-semibold">Single Player Mode</h2>
                <p className="text-muted-foreground">Test your knowledge of world flags. Answer as many questions correctly as you can!</p>
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
                        description: "Set a name in the multiplayer tab to save your score to the leaderboard!",
                      });
                    }
                  }}
                />
              )}
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
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UsersIcon className="h-5 w-5" /> 
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
                        <div>
                          <h3 className="text-base font-medium mb-2">Create a New Game</h3>
                          <Button 
                            className="w-full" 
                            onClick={handleCreateLobby}
                            disabled={!playerName}
                          >
                            Create Lobby
                          </Button>
                        </div>
                        
                        <div>
                          <h3 className="text-base font-medium mb-2">Join an Existing Game</h3>
                          <div className="flex gap-2">
                            <Input
                              placeholder="Enter lobby code"
                              value={joinLobbyCode}
                              onChange={e => setJoinLobbyCode(e.target.value.toUpperCase())}
                              maxLength={5}
                              className="flex-1"
                            />
                            <Button 
                              onClick={handleJoinLobby}
                              disabled={!playerName || !joinLobbyCode}
                            >
                              Join
                            </Button>
                          </div>
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
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrophyIcon className="h-5 w-5" /> 
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
                            <tr key={index} className="border-t">
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
        <p>&copy; {new Date().getFullYear()} Culture Explorer - Flag Quiz</p>
      </footer>
    </div>
  );
};

export default FlagQuiz;
