
import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useThemeToggle } from "@/hooks/useLocalStorage";
import { motion } from "framer-motion";

const ThemeToggle = () => {
  const [theme, toggleTheme] = useThemeToggle();

  return (
    <Button 
      variant="outline" 
      size="icon" 
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      className="rounded-full bg-gradient-to-br from-transparent to-primary/10 border-primary/20 hover:border-primary/40"
    >
      {theme === 'light' ? (
        <MoonIcon className="h-5 w-5 text-primary transition-all" />
      ) : (
        <SunIcon className="h-5 w-5 text-primary transition-all" />
      )}
    </Button>
  );
};

export default ThemeToggle;
