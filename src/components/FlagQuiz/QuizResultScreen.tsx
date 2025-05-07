
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DifficultyLevel } from '@/services/flagQuizApi';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Award, RotateCw, Trophy } from 'lucide-react';

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
  onViewScoreboard,
}) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Get result message based on score
  const getMessage = (): string => {
    if (percentage >= 90) return "Excellent! You're a flag expert!";
    if (percentage >= 70) return "Great job! You know your flags well!";
    if (percentage >= 50) return "Good effort! Keep learning those flags!";
    return "Nice try! Practice makes perfect!";
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
        <CardTitle className="text-center">Quiz Complete!</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center"
          >
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">{getMessage()}</h3>
              <p className="text-muted-foreground">
                {playerName}, you completed the {difficulty} difficulty quiz!
              </p>
            </div>
            
            <div className="w-40 h-40 relative mt-6 mb-8">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold">{score}/{totalQuestions}</div>
                  <div className="text-sm text-muted-foreground">{percentage}%</div>
                </div>
              </div>
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle 
                  cx="50" cy="50" r="45" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeOpacity="0.1" 
                  strokeWidth="10"
                />
                <circle 
                  cx="50" cy="50" r="45" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeDasharray={`${percentage * 2.83} 283`} 
                  strokeDashoffset="0" 
                  strokeLinecap="round" 
                  strokeWidth="10"
                  transform="rotate(-90 50 50)"
                />
              </svg>
            </div>
          </motion.div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center p-4 bg-muted/30 rounded-lg">
              <Clock className="h-6 w-6 mb-2 text-primary" />
              <span className="text-sm font-medium">Time</span>
              <span className="text-2xl font-bold">{formatTime(timeInSeconds)}</span>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-muted/30 rounded-lg">
              <Award className="h-6 w-6 mb-2 text-primary" />
              <span className="text-sm font-medium">Difficulty</span>
              <span className="text-2xl font-bold capitalize">{difficulty}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-6">
            <Button variant="outline" onClick={onRestart} className="w-full">
              <RotateCw className="h-4 w-4 mr-2" />
              Play Again
            </Button>
            <Button onClick={onViewScoreboard} className="w-full">
              <Trophy className="h-4 w-4 mr-2" />
              View Scores
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizResultScreen;
