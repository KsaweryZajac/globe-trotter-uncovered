
import React from 'react';
import { Label } from '@/components/ui/label';
import { Home } from 'lucide-react';
import type { Country } from '@/services/api';

interface HomeCountrySelectorProps {
  homeCountry: string;
  setHomeCountry: (country: string) => void;
  countries: Country[];
}

const HomeCountrySelector: React.FC<HomeCountrySelectorProps> = ({ 
  homeCountry, 
  setHomeCountry, 
  countries 
}) => {
  return (
    <div>
      <Label htmlFor="home-country" className="flex items-center">
        <Home className="h-4 w-4 mr-1" />
        Your Home Country
      </Label>
      <select
        id="home-country"
        value={homeCountry}
        onChange={(e) => setHomeCountry(e.target.value)}
        className="w-full px-3 py-2 mt-1 border rounded-md"
      >
        <option value="">-- Select your home country --</option>
        {countries.map((country) => (
          <option key={country.cca3} value={country.name.common}>
            {country.name.common}
          </option>
        ))}
      </select>
      <p className="text-sm text-muted-foreground mt-1">
        This helps us calculate flight costs and provide relevant travel information
      </p>
    </div>
  );
};

export default HomeCountrySelector;
