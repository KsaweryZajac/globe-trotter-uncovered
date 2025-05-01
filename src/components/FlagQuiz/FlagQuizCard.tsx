
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FlagIcon, CheckIcon, XIcon, RefreshCwIcon } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import type { Country } from '@/services/api';

interface FlagQuizProps {
  countries: Country[];
}

const FlagQuizCard: React.FC<FlagQuizProps> = ({ countries }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [quizCountries, setQuizCountries] = useState<Country[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [optionsCount, setOptionsCount] = useState(4); // Default 4 options
  const [quizOptions, setQuizOptions] = useState<Country[]>([]);
  
  const { toast } = useToast();

  // Initialize the quiz
  useEffect(() => {
    if (countries.length > 0) {
      initializeQuiz();
    }
  }, [countries]);

  // Generate random options when current index changes
  useEffect(() => {
    if (quizCountries.length > 0) {
      generateOptions();
    }
  }, [currentIndex, quizCountries, optionsCount]);

  const initializeQuiz = () => {
    setIsLoading(true);
    
    // Get a random subset of countries for the quiz
    const shuffled = [...countries].sort(() => 0.5 - Math.random());
    setQuizCountries(shuffled.slice(0, 10)); // 10 questions per quiz
    setCurrentIndex(0);
    setScore(0);
    setTotalAnswered(0);
    setUserAnswer('');
    setResult(null);
    
    setIsLoading(false);
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
      toast({
        title: "Quiz completed!",
        description: `Your final score: ${score + (result === 'correct' ? 1 : 0)} out of ${quizCountries.length}`,
      });
      
      // Reset for a new quiz
      initializeQuiz();
    }
  };

  const handleOptionCountChange = (count: number) => {
    setOptionsCount(count);
    toast({
      title: "Options updated",
      description: `Quiz now has ${count} options per question`,
    });
    
    // Regenerate options
    generateOptions();
  };

  if (isLoading || !quizCountries.length) {
    return (
      <Card className="w-full shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FlagIcon className="h-5 w-5" />
            Flag Quiz
          </CardTitle>
          <CardDescription>Loading quiz...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-48">
            <p>Loading questions...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentCountry = quizCountries[currentIndex];
  const isQuizEnded = totalAnswered === quizCountries.length;

  return (
    <Card className="w-full shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FlagIcon className="h-5 w-5" />
          Flag Quiz
        </CardTitle>
        <CardDescription>
          Test your knowledge of world flags! Score: {score}/{totalAnswered}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isQuizEnded && (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Question {currentIndex + 1} of {quizCountries.length}</p>
              <div className="flex justify-center mb-4">
                <div className="relative h-36 w-52 border shadow-sm rounded overflow-hidden">
                  <img 
                    src={currentCountry.flags.png || currentCountry.flags.svg} 
                    alt="Country flag"
                    className="w-full h-full object-cover"
                  />
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
                  {currentIndex < quizCountries.length - 1 ? 'Next Question' : 'Start New Quiz'}
                </Button>
              </div>
            )}
          </div>
        )}
        
        {isQuizEnded && (
          <div className="text-center space-y-4">
            <p className="font-medium text-lg">Quiz Complete!</p>
            <p>Your score: {score} out of {quizCountries.length}</p>
            <Button onClick={initializeQuiz}>
              <RefreshCwIcon className="h-4 w-4 mr-2" />
              Play Again
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start space-y-2">
        <p className="text-sm font-medium">Quiz Options</p>
        <div className="flex flex-wrap gap-2">
          <p className="text-xs text-muted-foreground mr-2 self-center">Number of options:</p>
          {[2, 3, 4, 5, 6].map((count) => (
            <Button
              key={count}
              variant={optionsCount === count ? "default" : "outline"}
              size="sm"
              onClick={() => handleOptionCountChange(count)}
              className="h-7 px-3"
            >
              {count}
            </Button>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
};

export default FlagQuizCard;
