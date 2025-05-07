
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QuizQuestion } from '@/services/flagQuizApi';
import { Progress } from '@/components/ui/progress';
import { Country } from '@/services/api';
import { CheckIcon, XIcon } from 'lucide-react';

interface QuizGameBoardProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  onSelectAnswer: (country: Country) => void;
  score: number;
}

const QuizGameBoard: React.FC<QuizGameBoardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  onSelectAnswer,
  score
}) => {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [flagLoaded, setFlagLoaded] = useState<boolean>(false);
  
  const handleSelectAnswer = (country: Country) => {
    if (selectedCountry) return; // Prevent multiple selections
    setSelectedCountry(country);
    onSelectAnswer(country);
  };

  const isCorrectAnswer = (country: Country): boolean => {
    return selectedCountry !== null && country.cca3 === question.correctCountry.cca3;
  };

  const isIncorrectSelection = (country: Country): boolean => {
    return selectedCountry !== null && 
           selectedCountry.cca3 === country.cca3 && 
           country.cca3 !== question.correctCountry.cca3;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Flag Quiz</CardTitle>
          <div className="text-sm">
            Question {questionNumber} of {totalQuestions} • Score: {score}
          </div>
        </div>
        <Progress value={(questionNumber / totalQuestions) * 100} className="h-2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex justify-center">
            {!flagLoaded && (
              <div className="w-64 h-40 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-md"></div>
            )}
            <img
              src={question.correctCountry.flags.png || question.correctCountry.flags.svg}
              alt="Flag"
              className={`max-h-40 object-contain rounded ${flagLoaded ? 'block' : 'hidden'}`}
              onLoad={() => setFlagLoaded(true)}
            />
          </div>

          <div className="text-center mb-4">
            <h3 className="font-medium">Which country does this flag belong to?</h3>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {question.options.map((country) => (
              <motion.div key={country.cca3} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant={
                    isCorrectAnswer(country) ? "default" :
                    isIncorrectSelection(country) ? "destructive" : 
                    "outline"
                  }
                  className="w-full justify-between text-left"
                  onClick={() => handleSelectAnswer(country)}
                  disabled={selectedCountry !== null}
                >
                  <span>{country.name.common}</span>
                  {isCorrectAnswer(country) && <CheckIcon className="h-4 w-4" />}
                  {isIncorrectSelection(country) && <XIcon className="h-4 w-4" />}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizGameBoard;
