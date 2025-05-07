
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Star, Award, AlertTriangle } from 'lucide-react';

export type DifficultyLevel = 'beginner' | 'easy' | 'medium' | 'hard';

interface FlagQuizDifficultyProps {
  onSelectDifficulty: (difficulty: DifficultyLevel) => void;
  selectedDifficulty: DifficultyLevel;
}

const FlagQuizDifficulty: React.FC<FlagQuizDifficultyProps> = ({
  onSelectDifficulty,
  selectedDifficulty,
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-center">Select Difficulty Level</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button
            variant={selectedDifficulty === 'beginner' ? 'default' : 'outline'}
            className="flex flex-col items-center py-6 h-auto"
            onClick={() => onSelectDifficulty('beginner')}
          >
            <Shield className="h-6 w-6 mb-2" />
            <span className="text-sm font-semibold">Beginner</span>
            <span className="text-xs mt-1">Common countries only</span>
          </Button>
          
          <Button
            variant={selectedDifficulty === 'easy' ? 'default' : 'outline'}
            className="flex flex-col items-center py-6 h-auto"
            onClick={() => onSelectDifficulty('easy')}
          >
            <Star className="h-6 w-6 mb-2" />
            <span className="text-sm font-semibold">Easy</span>
            <span className="text-xs mt-1">Mix of common countries</span>
          </Button>
          
          <Button
            variant={selectedDifficulty === 'medium' ? 'default' : 'outline'}
            className="flex flex-col items-center py-6 h-auto"
            onClick={() => onSelectDifficulty('medium')}
          >
            <Award className="h-6 w-6 mb-2" />
            <span className="text-sm font-semibold">Medium</span>
            <span className="text-xs mt-1">Includes less known flags</span>
          </Button>
          
          <Button
            variant={selectedDifficulty === 'hard' ? 'default' : 'outline'} 
            className="flex flex-col items-center py-6 h-auto"
            onClick={() => onSelectDifficulty('hard')}
          >
            <AlertTriangle className="h-6 w-6 mb-2" />
            <span className="text-sm font-semibold">Hard</span>
            <span className="text-xs mt-1">For flag enthusiasts only!</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FlagQuizDifficulty;
