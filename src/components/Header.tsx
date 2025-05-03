
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  GlobeIcon, 
  HeartIcon, 
  MapIcon, 
  FlagIcon, 
  MenuIcon, 
  SearchIcon, 
  UserIcon,
  HomeIcon
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  // Add scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'py-2 bg-background/80 backdrop-blur-lg shadow-md' : 'py-4 bg-background/50 backdrop-blur-sm'}`}>
      <div className="container flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <span className="animate-float text-3xl">🌍</span>
            <h1 className={`font-bold transition-all duration-300 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent ${scrolled ? 'text-xl' : 'text-2xl'}`}>
              Culture Explorer
            </h1>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/">
                  <Button variant={isActive('/') ? "default" : "ghost"} className="px-4">
                    <HomeIcon className="mr-2 h-4 w-4" />
                    Home
                  </Button>
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link to="/search">
                  <Button variant={isActive('/search') ? "default" : "ghost"} className="px-4">
                    <SearchIcon className="mr-2 h-4 w-4" />
                    Search
                  </Button>
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link to="/favorites">
                  <Button variant={isActive('/favorites') ? "default" : "ghost"} className="px-4">
                    <HeartIcon className="mr-2 h-4 w-4" />
                    Favorites
                  </Button>
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link to="/trip-planner">
                  <Button variant={isActive('/trip-planner') ? "default" : "ghost"} className="px-4">
                    <MapIcon className="mr-2 h-4 w-4" />
                    Trip Planner
                  </Button>
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link to="/flag-quiz">
                  <Button variant={isActive('/flag-quiz') ? "default" : "ghost"} className="px-4">
                    <FlagIcon className="mr-2 h-4 w-4" />
                    Flag Quiz
                  </Button>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <ThemeToggle />
        </div>
        
        {/* Mobile Menu */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="ml-2">
                <MenuIcon className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80%] max-w-sm">
              <div className="flex flex-col gap-4 py-4">
                <Link to="/" className="flex items-center gap-2 pb-4 border-b">
                  <span className="text-2xl">🌍</span>
                  <h2 className="text-lg font-semibold">Culture Explorer</h2>
                </Link>
                
                <Link to="/" className={cn("flex items-center gap-3 py-2 px-3 rounded-md", isActive('/') && "bg-primary/10")}>
                  <HomeIcon className="h-5 w-5 text-primary" />
                  <span>Home</span>
                </Link>
                
                <Link to="/search" className={cn("flex items-center gap-3 py-2 px-3 rounded-md", isActive('/search') && "bg-primary/10")}>
                  <SearchIcon className="h-5 w-5 text-primary" />
                  <span>Search Countries</span>
                </Link>
                
                <Link to="/favorites" className={cn("flex items-center gap-3 py-2 px-3 rounded-md", isActive('/favorites') && "bg-primary/10")}>
                  <HeartIcon className="h-5 w-5 text-primary" />
                  <span>Favorites</span>
                </Link>
                
                <Link to="/trip-planner" className={cn("flex items-center gap-3 py-2 px-3 rounded-md", isActive('/trip-planner') && "bg-primary/10")}>
                  <MapIcon className="h-5 w-5 text-primary" />
                  <span>Trip Planner</span>
                </Link>
                
                <Link to="/flag-quiz" className={cn("flex items-center gap-3 py-2 px-3 rounded-md", isActive('/flag-quiz') && "bg-primary/10")}>
                  <FlagIcon className="h-5 w-5 text-primary" />
                  <span>Flag Quiz</span>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
