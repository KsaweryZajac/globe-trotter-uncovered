
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import flagQuizApi, { QuizQuestion, QuizResult, DifficultyLevel } from '@/services/flagQuizApi';
import { Country } from '@/services/api';
import QuizScoreboard from './QuizScoreboard';
import PlayerNameInput from './PlayerNameInput';
import QuizGameBoard from './QuizGameBoard';
import QuizResultScreen from './QuizResultScreen';
import FlagQuizDifficulty from './FlagQuizDifficulty';

type GameState = 'name_input' | 'select_difficulty' | 'playing' | 'game_over';

// Define the animation variants
const variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } }
};

const FlagQuiz: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('name_input');
  const [playerName, setPlayerName] = useState<string>('');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('easy');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [highScores, setHighScores] = useState<QuizResult[]>([]);
  const [selectedScoreDifficulty, setSelectedScoreDifficulty] = useState<DifficultyLevel>('easy');
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);

  // Load high scores when component mounts
  useEffect(() => {
    const scores = flagQuizApi.getHighScores();
    setHighScores(scores);
  }, []);

  // Function to handle player name submission
  const handleNameSubmit = (name: string) => {
    setPlayerName(name);
    setGameState('select_difficulty');
  };

  // Function to handle difficulty selection
  const handleDifficultySelect = async (selectedDifficulty: DifficultyLevel) => {
    try {
      setDifficulty(selectedDifficulty);
      setCurrentQuestionIndex(0);
      setScore(0);
      
      // Start timer
      const now = Date.now();
      setStartTime(now);
            
      // Generate quiz questions based on difficulty
      const quizQuestions = await flagQuizApi.generateQuiz(10, selectedDifficulty);
      setQuestions(quizQuestions);
      setGameState('playing');
      
    } catch (error) {
      console.error('Failed to generate quiz:', error);
    }
  };

  // Function to handle answer selection
  const handleAnswerSelect = (selectedCountry: Country) => {
    if (currentQuestionIndex >= questions.length) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedCountry.cca3 === currentQuestion.correctCountry.cca3;
    
    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
    }
    
    // Move to next question or end game
    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      }, 1500); // Give time to see the result
    } else {
      // Game over - record end time
      setEndTime(Date.now());
      setGameState('game_over');
      
      // Save score
      const timeInSeconds = Math.floor((Date.now() - startTime) / 1000);
      const result: QuizResult = {
        playerName,
        score,
        maxScore: questions.length,
        timeInSeconds,
        date: new Date().toISOString(),
        difficulty
      };
      flagQuizApi.saveScore(result);
      
      // Update high scores list
      setHighScores(flagQuizApi.getHighScores());
    }
  };

  // Function to handle restart game
  const handleRestartGame = () => {
    setGameState('select_difficulty');
    setCurrentQuestionIndex(0);
    setScore(0);
  };

  // Function to handle viewing scoreboard
  const handleViewScoreboard = () => {
    // Update high scores list
    setHighScores(flagQuizApi.getHighScores());
    setGameState('name_input');
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={variants}
          className="bg-card rounded-lg shadow-lg p-6"
        >
          {gameState === 'name_input' && (
            <>
              <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">
                Flag Recognition Quiz
              </h1>
              
              <Tabs defaultValue="play" className="mx-auto max-w-md">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="play">Play Quiz</TabsTrigger>
                  <TabsTrigger value="scores">High Scores</TabsTrigger>
                </TabsList>
                
                <TabsContent value="play" className="mt-6">
                  <PlayerNameInput onSubmit={handleNameSubmit} />
                </TabsContent>
                
                <TabsContent value="scores" className="mt-6">
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">Leaderboard</h2>
                    <div className="flex justify-center mb-4">
                      <TabsList>
                        <TabsTrigger 
                          value="beginner"
                          className={selectedScoreDifficulty === 'beginner' ? 'bg-primary text-primary-foreground' : ''}
                          onClick={() => setSelectedScoreDifficulty('beginner')}
                        >
                          Beginner
                        </TabsTrigger>
                        <TabsTrigger 
                          value="easy"
                          className={selectedScoreDifficulty === 'easy' ? 'bg-primary text-primary-foreground' : ''}
                          onClick={() => setSelectedScoreDifficulty('easy')}
                        >
                          Easy
                        </TabsTrigger>
                        <TabsTrigger 
                          value="medium"
                          className={selectedScoreDifficulty === 'medium' ? 'bg-primary text-primary-foreground' : ''}
                          onClick={() => setSelectedScoreDifficulty('medium')}
                        >
                          Medium
                        </TabsTrigger>
                        <TabsTrigger 
                          value="hard"
                          className={selectedScoreDifficulty === 'hard' ? 'bg-primary text-primary-foreground' : ''}
                          onClick={() => setSelectedScoreDifficulty('hard')}
                        >
                          Hard
                        </TabsTrigger>
                      </TabsList>
                    </div>
                    <QuizScoreboard highScores={highScores.filter(score => score.difficulty === selectedScoreDifficulty)} />
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}

          {gameState === 'select_difficulty' && (
            <>
              <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">
                Select Difficulty Level
              </h1>
              <FlagQuizDifficulty 
                onSelectDifficulty={handleDifficultySelect}
                selectedDifficulty={difficulty}
              />
              <div className="text-center mt-4">
                <Button variant="outline" onClick={() => setGameState('name_input')}>
                  Back
                </Button>
              </div>
            </>
          )}

          {gameState === 'playing' && questions.length > 0 && (
            <QuizGameBoard
              question={questions[currentQuestionIndex]}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              onSelectAnswer={handleAnswerSelect}
              score={score}
            />
          )}

          {gameState === 'game_over' && (
            <QuizResultScreen
              score={score}
              totalQuestions={questions.length}
              playerName={playerName}
              difficulty={difficulty}
              timeInSeconds={Math.floor((endTime - startTime) / 1000)}
              onRestart={handleRestartGame}
              onViewScoreboard={handleViewScoreboard}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default FlagQuiz;
