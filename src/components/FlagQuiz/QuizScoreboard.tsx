
import React from 'react';
import { QuizResult } from '@/services/flagQuizApi';
import { Trophy, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface QuizScoreboardProps {
  highScores: QuizResult[];
}

const QuizScoreboard: React.FC<QuizScoreboardProps> = ({ highScores }) => {
  // Format time in MM:SS format
  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Sort scores by:
  // 1. Highest score first
  // 2. Fastest time for equal scores
  const sortedScores = [...highScores].sort((a, b) => {
    // First sort by score (descending)
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    // Then by time (ascending)
    return a.timeInSeconds - b.timeInSeconds;
  });

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4">
      {sortedScores.length === 0 ? (
        <p className="text-center text-muted-foreground py-4">No scores yet. Be the first to play!</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 px-2">#</th>
                <th className="text-left py-2">Player</th>
                <th className="text-center py-2">Score</th>
                <th className="text-center py-2">Time</th>
                <th className="text-right py-2 px-2">When</th>
              </tr>
            </thead>
            <tbody>
              {sortedScores.slice(0, 10).map((score, index) => (
                <tr 
                  key={index}
                  className={`border-b border-gray-100 dark:border-gray-800 ${index === 0 ? 'bg-yellow-50 dark:bg-yellow-950/20' : ''}`}
                >
                  <td className="py-2 px-2">
                    {index === 0 ? (
                      <Trophy className="h-5 w-5 text-yellow-500" />
                    ) : (
                      <span className="text-muted-foreground">{index + 1}</span>
                    )}
                  </td>
                  <td className="py-2">
                    <span className={`font-medium ${index === 0 ? 'text-yellow-700 dark:text-yellow-400' : ''}`}>
                      {score.playerName}
                    </span>
                  </td>
                  <td className="py-2 text-center">
                    {score.score}/{score.maxScore}
                  </td>
                  <td className="py-2 text-center flex items-center justify-center">
                    <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                    {formatTime(score.timeInSeconds)}
                  </td>
                  <td className="py-2 text-right text-xs text-muted-foreground px-2">
                    {formatDistanceToNow(new Date(score.date), { addSuffix: true })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default QuizScoreboard;
