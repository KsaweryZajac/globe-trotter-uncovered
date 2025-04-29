
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const SearchBar = ({ onSearch, isLoading }: SearchBarProps) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-lg gap-2">
      <Input
        type="text"
        placeholder="Search for a country (e.g. Japan, Brazil)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-grow"
        aria-label="Country name"
      />
      <Button 
        type="submit" 
        disabled={!query.trim() || isLoading}
        className="flex-shrink-0"
      >
        <SearchIcon className="h-4 w-4 mr-2" />
        {isLoading ? 'Searching...' : 'Search'}
      </Button>
    </form>
  );
};

export default SearchBar;
