
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface TripTitleInputProps {
  title: string;
  setTitle: (title: string) => void;
}

const TripTitleInput: React.FC<TripTitleInputProps> = ({ title, setTitle }) => {
  return (
    <div>
      <Label htmlFor="trip-title">Trip Title</Label>
      <Input 
        id="trip-title"
        placeholder="My Amazing Adventure"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mt-1"
      />
    </div>
  );
};

export default TripTitleInput;
