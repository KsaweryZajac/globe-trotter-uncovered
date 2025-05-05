
import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { 
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem
} from "@/components/ui/command";
import api from "@/services/api";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const SearchBar = ({ onSearch, isLoading }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoadingSuggestions(true);
      try {
        // Using the existing API to get suggestions
        const results = await api.searchCountries(query);
        const countryNames = results.map(country => country.name.common);
        setSuggestions(countryNames);
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoadingSuggestions(false);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setShowSuggestions(true);
  };

  const handleClearInput = () => {
    setQuery('');
    setSuggestions([]);
  };

  return (
    <div className="w-full relative">
      <form onSubmit={handleSubmit} className="flex w-full max-w-lg gap-2">
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="Search for a country (e.g. Japan, Brazil)"
            value={query}
            onChange={handleInputChange}
            onFocus={() => query.trim() && setShowSuggestions(true)}
            className="flex-grow pr-8"
            aria-label="Country name"
          />
          {query && (
            <button
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={handleClearInput}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button 
          type="submit" 
          disabled={!query.trim() || isLoading}
          className="flex-shrink-0"
        >
          <Search className="h-4 w-4 mr-2" />
          {isLoading ? 'Searching...' : 'Search'}
        </Button>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-md">
          <Command className="rounded-lg border shadow-md">
            <CommandList>
              {isLoadingSuggestions ? (
                <div className="p-2 text-sm text-muted-foreground">Loading suggestions...</div>
              ) : (
                <>
                  <CommandEmpty>No results found</CommandEmpty>
                  <CommandGroup>
                    {suggestions.map((suggestion, index) => (
                      <CommandItem 
                        key={index}
                        onSelect={() => handleSuggestionClick(suggestion)}
                        className="cursor-pointer"
                      >
                        {suggestion}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
