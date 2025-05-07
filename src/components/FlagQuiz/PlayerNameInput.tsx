
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface PlayerNameInputProps {
  onSubmit: (name: string) => void;
}

const PlayerNameInput: React.FC<PlayerNameInputProps> = ({ onSubmit }) => {
  const [name, setName] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="playerName" className="text-sm font-medium block mb-1">
                Your Name
              </label>
              <Input
                id="playerName"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
                maxLength={20}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full"
              disabled={!name.trim()}
            >
              Start Quiz
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PlayerNameInput;
