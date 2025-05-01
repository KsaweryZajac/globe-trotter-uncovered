import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { FlagIcon, UsersIcon, CheckIcon, XIcon, RefreshCwIcon, TrophyIcon } from 'lucide-react';
import type { Country } from '@/services/api';

// Generate a random lobby code
const generateLobbyCode = () => {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoiding similar looking characters
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

// Mock player data for demo purposes
const mockPlayers = [
  { id: '1', name: 'Player1', score: 0, avatar: '👨‍💻' },
  { id: '2', name: 'Player2', score: 0, avatar: '👩‍💻' },
];

interface Player {
  id: string;
  name: string;
  score: number;
  avatar: string;
}

interface FlagQuizMultiplayerProps {
  countries: Country[];
  playerName?: string;
  lobbyCode?: string;
  onGameComplete?: (score: number, total: number) => void;
  isLoading?: boolean;
  initialLobbyCode?: string | null;
}

const FlagQuizMultiplayer: React.FC<FlagQuizMultiplayerProps> = ({ 
  countries, 
  playerName = '',
  lobbyCode: initialLobbyCodeProp = '',
  onGameComplete,
  isLoading = false,
  initialLobbyCode = null
}) => {
  const [gameState, setGameState] = useState<'join' | 'lobby' | 'playing' | 'results'>(
    initialLobbyCode ? 'lobby' : 'join'
  );
  const [lobbyCode, setLobbyCode] = useState<string>(initialLobbyCodeProp || initialLobbyCode || '');
  const [joinCode, setJoinCode] = useState<string>('');
  const [localPlayerName, setLocalPlayerName] = useState<string>(playerName);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isHost, setIsHost] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quizCountries, setQuizCountries] = useState<Country[]>([]);
  const [userAnswer, setUserAnswer] = useState('');
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [quizOptions, setQuizOptions] = useState<Country[]>([]);
  const [optionsCount, setOptionsCount] = useState(4);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);

  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Initialize quiz on state change
  useEffect(() => {
    if (gameState === 'playing' && countries.length > 0) {
      initializeQuiz();
    }
  }, [gameState, countries]);

  // Initialize lobby on joining with code
  useEffect(() => {
    if (initialLobbyCode && gameState === 'lobby' && players.length === 0) {
      // Simulate joining an existing lobby
      setPlayers(mockPlayers);
      setIsHost(false);
      
      toast({
        title: "Joined Lobby",
        description: `You've joined lobby ${initialLobbyCode}`,
      });
    }
  }, [initialLobbyCode, gameState, players.length, toast]);
  
  // Generate options when current question changes
  useEffect(() => {
    if (quizCountries.length > 0 && gameState === 'playing') {
      generateOptions();
    }
  }, [currentIndex, quizCountries, optionsCount]);

  // Timer for the quiz
  useEffect(() => {
    if (gameState === 'playing' && gameStartTime) {
      const timer = setInterval(() => {
        const secondsElapsed = Math.floor((Date.now() - gameStartTime) / 1000);
        const timeRemaining = 120 - secondsElapsed; // 2 minutes total
        
        if (timeRemaining <= 0) {
          clearInterval(timer);
          setTimeLeft(0);
          endGame();
        } else {
          setTimeLeft(timeRemaining);
        }
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [gameState, gameStartTime]);

  const initializeQuiz = () => {
    // Get a random subset of countries for the quiz
    const shuffled = [...countries].sort(() => 0.5 - Math.random());
    setQuizCountries(shuffled.slice(0, 10)); // 10 questions per quiz
    setCurrentIndex(0);
    setScore(0);
    setTotalAnswered(0);
    setUserAnswer('');
    setResult(null);
    setGameStartTime(Date.now());
    setTimeLeft(120); // 2 minutes
  };

  const generateOptions = () => {
    if (!quizCountries[currentIndex]) return;
    
    // Current correct country
    const correctCountry = quizCountries[currentIndex];
    
    // Get random wrong options (don't include the correct answer)
    const wrongOptions = [...countries]
      .filter(c => c.cca3 !== correctCountry.cca3)
      .sort(() => 0.5 - Math.random())
      .slice(0, optionsCount - 1);
    
    // Combine and shuffle all options
    const allOptions = [correctCountry, ...wrongOptions].sort(() => 0.5 - Math.random());
    
    setQuizOptions(allOptions);
  };

  const handleCreateLobby = () => {
    if (!localPlayerName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name to create a lobby",
        variant: "destructive"
      });
      return;
    }
    
    // Generate new lobby code
    const newLobbyCode = generateLobbyCode();
    setLobbyCode(newLobbyCode);
    
    // Create the lobby with the current player as host
    setPlayers([{
      id: '0',
      name: localPlayerName,
      score: 0,
      avatar: '👑'
    }]);
    
    setIsHost(true);
    setGameState('lobby');
    
    toast({
      title: "Lobby Created",
      description: `Share the code "${newLobbyCode}" with friends to join!`,
    });
  };

  const handleJoinLobby = () => {
    if (!localPlayerName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name to join a lobby",
        variant: "destructive"
      });
      return;
    }
    
    if (!joinCode.trim() || joinCode.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a valid 6-character lobby code",
        variant: "destructive"
      });
      return;
    }
    
    // In a real implementation, we would verify the lobby exists here
    setLobbyCode(joinCode.toUpperCase());
    
    // Add the player to the mock lobby
    setPlayers([
      ...mockPlayers,
      {
        id: '3',
        name: localPlayerName,
        score: 0,
        avatar: '🧑'
      }
    ]);
    
    setIsHost(false);
    setGameState('lobby');
    
    // Update URL with lobby code
    navigate(`/flag-quiz?lobby=${joinCode.toUpperCase()}`);
    
    toast({
      title: "Joined Lobby",
      description: `You've joined lobby ${joinCode.toUpperCase()}`,
    });
  };

  const handleStartGame = () => {
    if (players.length < 1) {
      toast({
        title: "Not Enough Players",
        description: "Need at least 1 player to start the game",
        variant: "destructive"
      });
      return;
    }
    
    setGameState('playing');
    toast({
      title: "Game Starting",
      description: "The quiz has begun! Good luck!",
    });
  };

  const handleOptionSelect = (country: Country) => {
    const correctCountry = quizCountries[currentIndex];
    const isCorrect = country.cca3 === correctCountry.cca3;
    
    setResult(isCorrect ? 'correct' : 'incorrect');
    setUserAnswer(country.name.common);
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      toast({
        title: "Correct!",
        description: `${country.name.common} is the right answer!`,
      });
      
      // Update player score
      setPlayers(players.map(p => 
        p.name === localPlayerName ? { ...p, score: p.score + 1 } : p
      ));
    } else {
      toast({
        title: "Incorrect",
        description: `The correct answer was ${correctCountry.name.common}`,
        variant: "destructive"
      });
    }
    
    setTotalAnswered(prev => prev + 1);
  };

  const handleNextQuestion = () => {
    if (currentIndex < quizCountries.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setUserAnswer('');
      setResult(null);
    } else {
      // End of quiz
      endGame();
    }
  };
  
  const endGame = () => {
    // Sort players by score
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
    setPlayers(sortedPlayers);
    
    // Go to results screen
    setGameState('results');
    
    // Call onGameComplete if provided
    if (onGameComplete) {
      onGameComplete(score, quizCountries.length);
    }
    
    toast({
      title: "Quiz completed!",
      description: `Your final score: ${score} out of ${quizCountries.length}`,
    });
  };
  
  const handlePlayAgain = () => {
    // Reset scores for everyone
    setPlayers(players.map(p => ({ ...p, score: 0 })));
    
    // Go back to lobby
    setGameState('lobby');
  };
  
  const handleLeaveLobby = () => {
    // Clear all game state
    setPlayers([]);
    setLobbyCode('');
    setJoinCode('');
    setIsHost(false);
    setGameState('join');
    navigate('/flag-quiz');
  };

  if (isLoading) {
    return (
      <Card className="w-full shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="flex justify-center items-center h-48">
          <p>Loading quiz...</p>
        </CardContent>
      </Card>
    );
  }

  // Join/create lobby view
  if (gameState === 'join') {
    return (
      <Card className="w-full shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UsersIcon className="h-5 w-5" />
            Multiplayer Flag Quiz
          </CardTitle>
          <CardDescription>Play with friends! Create or join a lobby.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Name</label>
            <Input 
              placeholder="Enter your name" 
              value={localPlayerName} 
              onChange={(e) => setLocalPlayerName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg space-y-4">
              <h3 className="font-semibold">Create a Lobby</h3>
              <p className="text-sm text-muted-foreground">
                Start a new game and invite friends to join.
              </p>
              <Button 
                className="w-full" 
                onClick={handleCreateLobby}
                disabled={!localPlayerName.trim()}
              >
                Create Lobby
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg space-y-4">
              <h3 className="font-semibold">Join a Lobby</h3>
              <div className="space-y-2">
                <Input 
                  placeholder="Enter 6-character lobby code" 
                  value={joinCode} 
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  maxLength={6}
                />
                <Button 
                  variant="secondary" 
                  className="w-full"
                  onClick={handleJoinLobby}
                  disabled={!localPlayerName.trim() || !joinCode.trim() || joinCode.length !== 6}
                >
                  Join Lobby
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Lobby waiting room view
  if (gameState === 'lobby') {
    return (
      <Card className="w-full shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UsersIcon className="h-5 w-5" />
            Lobby: {lobbyCode}
          </CardTitle>
          <CardDescription>
            {isHost ? 'You are the host. Start the game when everyone is ready.' : 'Waiting for host to start the game.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3">Players ({players.length})</h3>
            <div className="space-y-2">
              {players.map((player) => (
                <div key={player.id} className="flex items-center justify-between p-2 bg-background border rounded">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{player.avatar}</span>
                    <span>{player.name}</span>
                    {player.id === '0' && <span className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 px-2 py-0.5 rounded">Host</span>}
                  </div>
                  <div>Score: {player.score}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="border rounded-lg p-4 bg-muted/50">
            <h3 className="font-semibold mb-2">Share Lobby Code</h3>
            <div className="flex items-center justify-between">
              <div className="text-xl font-mono tracking-wide">{lobbyCode}</div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(lobbyCode);
                  toast({
                    title: "Code Copied",
                    description: "Lobby code copied to clipboard!",
                  });
                }}
              >
                Copy
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2 justify-between">
          <Button 
            variant="outline" 
            onClick={handleLeaveLobby}
          >
            Leave Lobby
          </Button>
          
          {isHost && (
            <Button onClick={handleStartGame}>
              Start Game
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  }

  // Results view
  if (gameState === 'results') {
    return (
      <Card className="w-full shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <TrophyIcon className="h-6 w-6 text-yellow-500" />
            Game Results
          </CardTitle>
          <CardDescription>
            The quiz is complete! Here are the final scores.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border rounded-lg p-6 bg-muted/30">
            <h3 className="font-semibold text-center text-lg mb-6">Leaderboard</h3>
            <div className="space-y-3">
              {players.map((player, index) => (
                <div 
                  key={player.id} 
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    index === 0 ? 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800' : 
                    'bg-background'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 text-center font-bold">{index + 1}</div>
                    <span className="text-xl">{player.avatar}</span>
                    <span className="font-medium">{player.name}</span>
                    {index === 0 && <span className="text-yellow-600 dark:text-yellow-400">👑 Winner!</span>}
                  </div>
                  <div className="font-bold">{player.score} pts</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-2 justify-center">
          {isHost ? (
            <>
              <Button variant="outline" onClick={handleLeaveLobby}>
                Exit to Menu
              </Button>
              <Button onClick={handlePlayAgain}>
                Play Again
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={handleLeaveLobby}>
              Exit to Menu
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  }

  // Playing view
  return (
    <Card className="w-full shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <FlagIcon className="h-5 w-5" />
            Multiplayer Quiz
          </CardTitle>
          <div className="text-sm font-medium">
            Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>
        </div>
        <CardDescription>
          Question {currentIndex + 1} of {quizCountries.length} • Score: {score}/{totalAnswered}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="relative h-36 w-52 border shadow-sm rounded overflow-hidden">
                {quizCountries[currentIndex] && (
                  <img 
                    src={quizCountries[currentIndex].flags.png || quizCountries[currentIndex].flags.svg} 
                    alt="Country flag"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
            <p className="font-medium">Which country does this flag belong to?</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {quizOptions.map((option) => (
              <Button
                key={option.cca3}
                variant={
                  result === null ? "outline" :
                  option.cca3 === quizCountries[currentIndex].cca3 ? "default" :
                  userAnswer === option.name.common ? "destructive" : "outline"
                }
                className="justify-start"
                onClick={() => result === null && handleOptionSelect(option)}
                disabled={result !== null}
              >
                {option.name.common}
                {result !== null && option.cca3 === quizCountries[currentIndex].cca3 && (
                  <CheckIcon className="ml-auto h-4 w-4" />
                )}
                {result === 'incorrect' && userAnswer === option.name.common && (
                  <XIcon className="ml-auto h-4 w-4" />
                )}
              </Button>
            ))}
          </div>
          
          {result !== null && (
            <div className="flex justify-center mt-4">
              <Button onClick={handleNextQuestion}>
                {currentIndex < quizCountries.length - 1 ? 'Next Question' : 'See Results'}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex-col space-y-2">
        <div className="w-full border-t pt-2">
          <h4 className="text-sm font-medium mb-2">Players</h4>
          <div className="flex flex-wrap gap-2">
            {players.map(player => (
              <div 
                key={player.id} 
                className="text-xs px-2 py-1 bg-muted rounded-full flex items-center gap-1"
              >
                <span>{player.avatar}</span>
                <span>{player.name}: {player.score}</span>
              </div>
            ))}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default FlagQuizMultiplayer;
