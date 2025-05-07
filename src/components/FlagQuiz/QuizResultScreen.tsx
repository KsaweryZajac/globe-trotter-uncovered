
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Trophy, Timer, RotateCw, List } from 'lucide-react';
import { DifficultyLevel } from '@/services/flagQuizApi';

interface QuizResultScreenProps {
  score: number;
  totalQuestions: number;
  playerName: string;
  difficulty: DifficultyLevel;
  timeInSeconds: number;
  onRestart: () => void;
  onViewScoreboard: () => void;
}

const QuizResultScreen: React.FC<QuizResultScreenProps> = ({
  score,
  totalQuestions,
  playerName,
  difficulty,
  timeInSeconds,
  onRestart,
  onViewScoreboard
}) => {
  // Format time in MM:SS format
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Calculate percentage score
  const percentage = Math.round((score / totalQuestions) * 100);
  
  // Feedback based on score
  const getFeedback = (): { message: string; icon: React.ReactNode } => {
    if (percentage >= 90) {
      return {
        message: "Outstanding! You're a flag expert!",
        icon: <Trophy className="h-12 w-12 text-yellow-500" />
      };
    } else if (percentage >= 70) {
      return {
        message: "Great job! Your geography knowledge is impressive!",
        icon: <Trophy className="h-12 w-12 text-blue-500" />
      };
    } else if (percentage >= 50) {
      return {
        message: "Good effort! Keep learning those flags!",
        icon: <Trophy className="h-12 w-12 text-green-500" />
      };
    } else {
      return {
        message: "Nice try! With practice, you'll improve!",
        icon: <Trophy className="h-12 w-12 text-slate-500" />
      };
    }
  };

  const feedback = getFeedback();

  return (
    <Card>
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl">{playerName}'s Results</CardTitle>
        <CardDescription>Difficulty: {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {feedback.icon}
          </motion.div>
        </div>
        
        <div className="text-center">
          <motion.h2 
            className="text-3xl font-bold"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {score} / {totalQuestions}
          </motion.h2>
          <p className="text-lg text-muted-foreground">{percentage}% Correct</p>
        </div>
        
        <motion.div 
          className="flex items-center justify-center text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Timer className="h-4 w-4 mr-1" />
          <span>Time: {formatTime(timeInSeconds)}</span>
        </motion.div>
        
        <p className="text-center font-medium">{feedback.message}</p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Button variant="outline" onClick={onRestart} className="flex items-center gap-2">
            <RotateCw className="h-4 w-4" />
            Play Again
          </Button>
          <Button onClick={onViewScoreboard} className="flex items-center gap-2">
            <List className="h-4 w-4" />
            View Leaderboard
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizResultScreen;
