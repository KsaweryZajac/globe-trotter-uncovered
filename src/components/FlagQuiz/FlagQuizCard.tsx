
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { ArrowRightIcon, FlagIcon, XIcon, CheckIcon, HeartIcon, Timer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import flagQuizApi from '@/services/flagQuizApi';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

export interface FlagQuizProps {
  onBackToMenu: () => void;
  onScoreSubmit: (score: number, timeInSeconds: number) => void;
}

const FlagQuizCard: React.FC<FlagQuizProps> = ({ onBackToMenu, onScoreSubmit }) => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [quizComplete, setQuizComplete] = useState(false);
  const [streak, setStreak] = useState(0);
  const [flagLoaded, setFlagLoaded] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const { toast } = useToast();

  // Initialize timer when questions load
  useEffect(() => {
    if (questions.length > 0 && !isTimerRunning) {
      setStartTime(Date.now());
      setIsTimerRunning(true);
    }
  }, [questions]);

  // Update timer every second
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (isTimerRunning && !quizComplete) {
      intervalId = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isTimerRunning, startTime, quizComplete]);

  useEffect(() => {
    loadQuestions();
  }, []);
  
  // Auto advance to next question after correct answer
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (isCorrect === true) {
      timeoutId = setTimeout(() => {
        nextQuestion();
      }, 1000); // Auto advance after 1 second
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isCorrect]);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const quizQuestions = await flagQuizApi.generateQuiz(10);
      // Transform the questions into the format we need
      const formattedQuestions = quizQuestions.map(question => ({
        flag: question.correctCountry.flags.png || question.correctCountry.flags.svg,
        correctAnswer: question.correctCountry.name.common,
        options: question.options.map(option => option.name.common)
      }));
      setQuestions(formattedQuestions);
    } catch (error) {
      console.error("Failed to load questions:", error);
      toast({
        title: "Error",
        description: "Failed to load questions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (option: string) => {
    setSelectedOption(option);
    const correct = option === questions[currentQuestionIndex].correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      setScore(score + 1);
      setStreak(streak + 1);
      // We'll only show a toast for incorrect answers now
    } else {
      setStreak(0);
      toast({
        title: "Incorrect",
        description: `The correct answer was ${questions[currentQuestionIndex].correctAnswer}`,
        variant: "destructive",
      });
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setIsCorrect(null);
      setFlagLoaded(false);
    } else {
      setQuizComplete(true);
      setIsTimerRunning(false);
      onScoreSubmit(score, elapsedTime);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setScore(0);
    setQuizComplete(false);
    setStreak(0);
    setStartTime(Date.now());
    setElapsedTime(0);
    setIsTimerRunning(true);
    loadQuestions();
  };

  const handleImageLoad = () => {
    setFlagLoaded(true);
  };

  const currentQuestion = questions[currentQuestionIndex];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const cardVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, x: 50, transition: { duration: 0.3 } },
  };

  const buttonVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delay: 0.5, duration: 0.3 } },
  };

  return (
    <Card className="min-h-[500px] shadow-md overflow-hidden">
      <CardHeader className="flex flex-col space-y-1.5 p-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">Flag Quiz</CardTitle>
          <div className="flex items-center gap-2">
            {/* Timer display */}
            <div className="flex items-center text-sm text-muted-foreground">
              <Timer className="h-4 w-4 mr-1" />
              {formatTime(elapsedTime)}
            </div>
            <Button variant="ghost" size="sm" onClick={onBackToMenu}>
              <XIcon className="h-4 w-4 mr-2" />
              Back to Menu
            </Button>
          </div>
        </div>
        <Progress value={(currentQuestionIndex / questions.length) * 100} />
      </CardHeader>
      <CardContent className="p-4 relative">
        {loading ? (
          <div className="flex flex-col space-y-4 items-center justify-center h-full">
            <Skeleton className="w-32 h-20 rounded-md" />
            <Skeleton className="w-48 h-8 rounded-md" />
            <Skeleton className="w-full h-10 rounded-md" />
            <Skeleton className="w-full h-10 rounded-md" />
            <Skeleton className="w-full h-10 rounded-md" />
          </div>
        ) : quizComplete ? (
          <div className="flex flex-col space-y-4 items-center justify-center h-full">
            <h2 className="text-2xl font-bold">Quiz Complete!</h2>
            <p className="text-lg">Your Score: {score} / {questions.length}</p>
            <p className="text-md flex items-center">
              <Timer className="h-4 w-4 mr-1" />
              Your Time: {formatTime(elapsedTime)}
            </p>
            <Button onClick={resetQuiz}>Play Again</Button>
          </div>
        ) : currentQuestion ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col space-y-4"
            >
              <div className="flex justify-center">
                {!flagLoaded && <Skeleton className="w-60 h-40 rounded-md absolute" />}
                <img
                  src={currentQuestion.flag}
                  alt="Flag"
                  className={`w-60 h-36 object-contain rounded-md transition-opacity duration-300 ${flagLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={handleImageLoad}
                />
              </div>
              <div className="text-center mb-4">
                <h3 className="font-medium">Which country does this flag belong to?</h3>
              </div>
              <div className="flex flex-col space-y-2">
                {currentQuestion.options.map((option: string) => (
                  <Button
                    key={option}
                    variant="outline"
                    className={`w-full justify-start ${selectedOption === option ? (isCorrect ? 'bg-green-500 text-white hover:bg-green-700' : 'bg-red-500 text-white hover:bg-red-700') : ''
                      }`}
                    onClick={() => handleAnswer(option)}
                    disabled={selectedOption !== null}
                  >
                    {option}
                  </Button>
                ))}
              </div>
              {isCorrect === false && (
                <motion.div
                  variants={buttonVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex justify-end"
                >
                  <Button onClick={nextQuestion}>
                    Next Question
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="flex flex-col space-y-4 items-center justify-center h-full">
            <h2 className="text-2xl font-bold">No questions available</h2>
            <Button onClick={resetQuiz}>Try Again</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FlagQuizCard;
