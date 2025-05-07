
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import FlagQuizCard from '@/components/FlagQuiz/FlagQuizCard';
import Header from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Timer } from 'lucide-react';
import flagQuizApi, { DifficultyLevel } from '@/services/flagQuizApi';

interface HighScore {
  name: string;
  score: number;
  date: string;
  time?: number; // Time in seconds
  difficulty?: DifficultyLevel; // Added difficulty property
}

const FlagQuiz = () => {
  const [activeTab, setActiveTab] = useState("solo");
  const [userName, setUserName] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>("easy");

  // Solo game state
  const [highScores, setHighScores] = useState<HighScore[]>(() => {
    const saved = localStorage.getItem('flagQuizHighScores');
    return saved ? JSON.parse(saved) : [];
  });

  const handleScoreSubmit = (score: number, timeInSeconds: number) => {
    if (!userName.trim()) return;
    
    const newScore = {
      name: userName,
      score: score,
      date: new Date().toISOString(),
      time: timeInSeconds,
      difficulty: selectedDifficulty
    };
    
    const updatedScores = [...highScores, newScore]
      // Sort primarily by score (highest first), then by time (lowest first if scores are equal)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return (a.time || 999) - (b.time || 999);
      })
      .slice(0, 10);
      
    setHighScores(updatedScores);
    localStorage.setItem('flagQuizHighScores', JSON.stringify(updatedScores));
    setGameStarted(false);
  };
  
  // Flag quiz animation variants
  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Filter scores by difficulty
  const filteredScores = selectedDifficulty 
    ? highScores.filter(score => score.difficulty === selectedDifficulty)
    : highScores;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/90">
      <Header />
      
      <div className="container max-w-6xl mx-auto py-12 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Flag Quiz Challenge
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Test your knowledge of world flags and challenge yourself to beat your high score.
          </p>
        </motion.div>
        
        <Tabs defaultValue="solo" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-8">
            <TabsTrigger value="solo">Solo Play</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>
          
          <TabsContent value="solo" className="space-y-4">
            {!gameStarted ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-md mx-auto"
              >
                <Card className="p-6 shadow-lg border bg-card/50 backdrop-blur-sm">
                  <h2 className="text-2xl font-bold mb-4">Enter Your Name</h2>
                  <p className="mb-4 text-muted-foreground">Enter your name to track your high scores.</p>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Your name"
                    className="w-full p-3 rounded-md border mb-4 bg-background"
                    maxLength={20}
                  />
                  
                  <div className="mb-4">
                    <h3 className="font-medium mb-2">Select Difficulty:</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {(['beginner', 'easy', 'medium', 'hard'] as DifficultyLevel[]).map((difficulty) => (
                        <Button 
                          key={difficulty}
                          variant={selectedDifficulty === difficulty ? "default" : "outline"}
                          onClick={() => setSelectedDifficulty(difficulty)}
                          className="capitalize"
                        >
                          {difficulty}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full gradient-primary text-white" 
                    onClick={() => setGameStarted(true)}
                    disabled={!userName.trim()}
                  >
                    Start Game
                  </Button>
                </Card>
              </motion.div>
            ) : (
              <FlagQuizCard 
                onScoreSubmit={handleScoreSubmit}
                onBackToMenu={() => setGameStarted(false)}
              />
            )}
          </TabsContent>
          
          <TabsContent value="leaderboard">
            <motion.div
              variants={containerAnimation}
              initial="hidden"
              animate="show" 
              className="max-w-2xl mx-auto"
            >
              <Card className="p-6 shadow-lg border border-border/50 bg-card/50 backdrop-blur-sm">
                <h2 className="text-2xl font-bold mb-6 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  High Scores
                </h2>
                
                <div className="mb-4">
                  <Tabs defaultValue="all">
                    <TabsList className="w-full mb-4">
                      <TabsTrigger value="all" onClick={() => setSelectedDifficulty(undefined as any)}>All</TabsTrigger>
                      <TabsTrigger value="beginner" onClick={() => setSelectedDifficulty("beginner")}>Beginner</TabsTrigger>
                      <TabsTrigger value="easy" onClick={() => setSelectedDifficulty("easy")}>Easy</TabsTrigger>
                      <TabsTrigger value="medium" onClick={() => setSelectedDifficulty("medium")}>Medium</TabsTrigger>
                      <TabsTrigger value="hard" onClick={() => setSelectedDifficulty("hard")}>Hard</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                
                {filteredScores.length === 0 ? (
                  <motion.div 
                    variants={itemAnimation}
                    className="text-center p-8"
                  >
                    <p className="text-xl text-muted-foreground">No scores yet. Play a game to set new records!</p>
                  </motion.div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Rank</TableHead>
                          <TableHead>Player</TableHead>
                          <TableHead>Score</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Difficulty</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredScores.map((score, index) => (
                          <motion.tr 
                            variants={itemAnimation}
                            key={index} 
                            className="border-b hover:bg-secondary/50 transition-colors"
                          >
                            <TableCell>
                              <div className="flex items-center">
                                {index === 0 && <span className="text-yellow-500 mr-1">🏆</span>}
                                #{index + 1}
                              </div>
                            </TableCell>
                            <TableCell>{score.name}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <span className="font-bold">{score.score}</span>
                                <div className="ml-2 w-24">
                                  <Progress 
                                    value={filteredScores[0].score > 0 ? (score.score / filteredScores[0].score) * 100 : 0} 
                                    className="h-2" 
                                  />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Timer className="h-3 w-3 mr-1" />
                                {score.time ? `${score.time}s` : 'N/A'}
                              </div>
                            </TableCell>
                            <TableCell className="capitalize">
                              {score.difficulty || 'Unknown'}
                            </TableCell>
                            <TableCell>{new Date(score.date).toLocaleDateString()}</TableCell>
                          </motion.tr>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FlagQuiz;
