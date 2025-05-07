
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';

// Define types to make TypeScript happy
interface Player {
  id: string;
  name: string;
  score: number;
  isHost: boolean;
  avatar: string;
}

interface Lobby {
  code: string;
  players: Player[];
  started: boolean;
}

// Simplified version - this component isn't being used actively in the app
const FlagQuizMultiplayer: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Multiplayer Flag Quiz</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <div className="p-8 flex flex-col items-center gap-4">
          <Info className="h-10 w-10 text-muted-foreground" />
          <p>Multiplayer mode is currently in development.</p>
          <Button variant="outline">Back to Single Player</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FlagQuizMultiplayer;
