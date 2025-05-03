
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import FlagQuizCard from '@/components/FlagQuiz/FlagQuizCard';
import Header from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const FlagQuiz = () => {
  const [activeTab, setActiveTab] = useState("solo");
  const [userName, setUserName] = useState("");
  const [gameStarted, setGameStarted] = useState(false);

  // Solo game state
  const [highScores, setHighScores] = useState(() => {
    const saved = localStorage.getItem('flagQuizHighScores');
    return saved ? JSON.parse(saved) : [];
  });

  const handleScoreSubmit = (score: number) => {
    if (!userName.trim()) return;
    
    const newScore = {
      name: userName,
      score: score,
      date: new Date().toISOString(),
    };
    
    const updatedScores = [...highScores, newScore].sort((a, b) => b.score - a.score).slice(0, 10);
    setHighScores(updatedScores);
    localStorage.setItem('flagQuizHighScores', JSON.stringify(updatedScores));
    setGameStarted(false);
  };

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
          <TabsList className="grid grid-cols-1 md:grid-cols-2 w-full max-w-md mx-auto mb-8">
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
                <Card className="p-6">
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
                playerName={userName}
                onScoreSubmit={handleScoreSubmit}
                onBackToMenu={() => setGameStarted(false)}
              />
            )}
          </TabsContent>
          
          <TabsContent value="leaderboard">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mx-auto"
            >
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-6">High Scores</h2>
                
                {highScores.length === 0 ? (
                  <div className="text-center p-8">
                    <p className="text-xl text-muted-foreground">No scores yet. Play a game to set new records!</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Rank</th>
                          <th className="text-left py-3 px-4">Player</th>
                          <th className="text-left py-3 px-4">Score</th>
                          <th className="text-left py-3 px-4">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {highScores.map((score, index) => (
                          <tr key={index} className="border-b hover:bg-secondary/50 transition-colors">
                            <td className="py-3 px-4">#{index + 1}</td>
                            <td className="py-3 px-4">{score.name}</td>
                            <td className="py-3 px-4">{score.score}</td>
                            <td className="py-3 px-4">{new Date(score.date).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
