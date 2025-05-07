
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface PlayerNameInputProps {
  onSubmit: (name: string) => void;
}

const PlayerNameInput: React.FC<PlayerNameInputProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="playerName" className="block font-medium">
                Your Name
              </label>
              <Input
                id="playerName"
                placeholder="Enter your name to start"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
                autoFocus
                maxLength={20}
              />
            </div>
            <Button type="submit" className="w-full" disabled={!name.trim()}>
              Continue to Difficulty Selection
            </Button>
          </form>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default PlayerNameInput;
