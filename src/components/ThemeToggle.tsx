
import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useThemeToggle } from "@/hooks/useLocalStorage";

const ThemeToggle = () => {
  const [theme, toggleTheme] = useThemeToggle();

  return (
    <Button 
      variant="outline" 
      size="icon" 
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      className="rounded-full"
    >
      {theme === 'light' ? (
        <MoonIcon className="h-5 w-5 transition-all" />
      ) : (
        <SunIcon className="h-5 w-5 transition-all" />
      )}
    </Button>
  );
};

export default ThemeToggle;
