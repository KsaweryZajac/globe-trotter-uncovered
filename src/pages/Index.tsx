
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { GlobeIcon, HeartIcon, MapIcon, FlagIcon, MenuIcon, Plane as PlaneIcon } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import CountryOfTheDay from '@/components/CountryOfTheDay';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Index = () => {
  const [scrolled, setScrolled] = useState(false);
  
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

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      } 
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/90">
      {/* Header */}
      <header className={`sticky top-0 z-10 modern-nav transition-all duration-300 ${scrolled ? 'py-2 shadow-md' : 'py-4'}`}>
        <div className="container flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="animate-float text-3xl">🌍</span>
            <h1 className={`font-bold transition-all duration-300 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent ${scrolled ? 'text-xl' : 'text-2xl'}`}>
              Culture Explorer
            </h1>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-background/50 dark:bg-background/20">Explore</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid grid-cols-2 gap-3 p-4 w-[400px]">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link to="/search" className="flex p-3 items-start gap-3 rounded-md hover:bg-accent/20 transition-colors">
                            <GlobeIcon className="h-5 w-5 text-primary" />
                            <div>
                              <div className="font-medium">Search Countries</div>
                              <p className="text-sm text-muted-foreground">Explore details about any country</p>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link to="/favorites" className="flex p-3 items-start gap-3 rounded-md hover:bg-accent/20 transition-colors">
                            <HeartIcon className="h-5 w-5 text-primary" />
                            <div>
                              <div className="font-medium">Favorites</div>
                              <p className="text-sm text-muted-foreground">Your saved countries</p>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link to="/trip-planner" className="flex p-3 items-start gap-3 rounded-md hover:bg-accent/20 transition-colors">
                            <MapIcon className="h-5 w-5 text-primary" />
                            <div>
                              <div className="font-medium">Trip Planner</div>
                              <p className="text-sm text-muted-foreground">Plan your next adventure</p>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link to="/flag-quiz" className="flex p-3 items-start gap-3 rounded-md hover:bg-accent/20 transition-colors">
                            <FlagIcon className="h-5 w-5 text-primary" />
                            <div>
                              <div className="font-medium">Flag Quiz</div>
                              <p className="text-sm text-muted-foreground">Test your knowledge</p>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
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
                <Button variant="outline" size="icon">
                  <MenuIcon className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col gap-4 py-4">
                  <Link to="/" className="flex items-center gap-2 pb-4 border-b">
                    <span className="text-2xl">🌍</span>
                    <h2 className="text-lg font-semibold">Culture Explorer</h2>
                  </Link>
                  <Link to="/search" className="flex items-center gap-3 py-2">
                    <GlobeIcon className="h-5 w-5 text-primary" />
                    <span>Search Countries</span>
                  </Link>
                  <Link to="/favorites" className="flex items-center gap-3 py-2">
                    <HeartIcon className="h-5 w-5 text-primary" />
                    <span>Favorites</span>
                  </Link>
                  <Link to="/trip-planner" className="flex items-center gap-3 py-2">
                    <MapIcon className="h-5 w-5 text-primary" />
                    <span>Trip Planner</span>
                  </Link>
                  <Link to="/flag-quiz" className="flex items-center gap-3 py-2">
                    <FlagIcon className="h-5 w-5 text-primary" />
                    <span>Flag Quiz</span>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-container">
        <div className="hero-pattern"></div>
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Discover the World's Cultures
            </h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Embark on a journey to explore diverse countries, plan your adventures, 
              and expand your global knowledge with Culture Explorer.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/search">
                <Button size="lg" className="btn-shine gradient-primary text-white">
                  <GlobeIcon className="h-5 w-5 mr-2" />
                  Start Exploring
                </Button>
              </Link>
              <Link to="/flag-quiz">
                <Button size="lg" variant="outline" className="border-primary/30 hover:border-primary/60">
                  <FlagIcon className="h-5 w-5 mr-2" />
                  Test Your Knowledge
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container py-16 px-4">
        {/* Features Section */}
        <motion.div 
          className="mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4 gradient-text">Explore Our Features</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover the world's cultures, languages, and stories through our interactive tools.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <motion.div variants={cardVariants}>
              <Card className="h-full modern-card hover:border-primary/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GlobeIcon className="h-5 w-5 text-primary" />
                    Search Countries
                  </CardTitle>
                  <CardDescription>
                    Explore countries around the world
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Search for any country by name or discover a random one. 
                    View detailed information and get interesting translations.
                  </p>
                </CardContent>
                <CardFooter>
                  <Link to="/search" className="w-full">
                    <Button className="w-full btn-shine">
                      Start Searching
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
            
            <motion.div variants={cardVariants}>
              <Card className="h-full modern-card hover:border-primary/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HeartIcon className="h-5 w-5 text-primary" />
                    Favorite Countries
                  </CardTitle>
                  <CardDescription>
                    Access your favorite countries
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    View and manage your favorite countries. Quickly access detailed information 
                    about the places that interest you most.
                  </p>
                </CardContent>
                <CardFooter>
                  <Link to="/favorites" className="w-full">
                    <Button className="w-full" variant="outline">
                      View Favorites
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
            
            <motion.div variants={cardVariants}>
              <Card className="h-full modern-card hover:border-primary/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapIcon className="h-5 w-5 text-primary" />
                    Trip Planner
                  </CardTitle>
                  <CardDescription>
                    Plan your next adventure
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Create detailed travel itineraries, explore destinations, 
                    check weather forecasts, and estimate costs for your trips.
                  </p>
                </CardContent>
                <CardFooter>
                  <Link to="/trip-planner" className="w-full">
                    <Button className="w-full" variant="outline">
                      Plan a Trip
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
            
            <motion.div variants={cardVariants}>
              <Card className="h-full modern-card hover:border-primary/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FlagIcon className="h-5 w-5 text-primary" />
                    Flag Quiz
                  </CardTitle>
                  <CardDescription>
                    Test your flag knowledge
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Play solo or multiplayer flag quizzes. Challenge friends with 
                    our interactive multiplayer mode and compete for the high score.
                  </p>
                </CardContent>
                <CardFooter>
                  <Link to="/flag-quiz" className="w-full">
                    <Button className="w-full" variant="outline">
                      Play Quiz
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </motion.div>

        {/* Country of the Day Section */}
        <motion.div 
          className="max-w-4xl mx-auto mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-4 gradient-text">Country of the Day</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover a new country every day and expand your knowledge of our diverse world.
            </p>
          </div>
          <CountryOfTheDay />
        </motion.div>

        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <div className="text-7xl mb-6 animate-float">🗺️</div>
          <h3 className="text-3xl font-bold mb-3 gradient-text">Ready to explore?</h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start your cultural journey by searching for a country, planning a trip, 
            or testing your knowledge with our flag quiz.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/search">
              <Button size="lg" className="gap-2 btn-shine">
                <GlobeIcon className="h-5 w-5" />
                Search Countries
              </Button>
            </Link>
            <Link to="/favorites">
              <Button size="lg" variant="outline" className="gap-2">
                <HeartIcon className="h-5 w-5" />
                View Favorites
              </Button>
            </Link>
            <Link to="/flag-quiz">
              <Button size="lg" variant="outline" className="gap-2">
                <FlagIcon className="h-5 w-5" />
                Play Flag Quiz
              </Button>
            </Link>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="modern-footer mt-12">
        <div className="container flex flex-col md:flex-row justify-between items-center py-6 px-4">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <span className="text-2xl">🌍</span>
            <span className="text-lg font-semibold gradient-text">Culture Explorer</span>
          </div>
          <div className="flex flex-col md:flex-row gap-6 md:items-center text-sm">
            <Link to="/search" className="text-muted-foreground hover:text-foreground transition-colors">
              Search
            </Link>
            <Link to="/favorites" className="text-muted-foreground hover:text-foreground transition-colors">
              Favorites
            </Link>
            <Link to="/trip-planner" className="text-muted-foreground hover:text-foreground transition-colors">
              Trip Planner
            </Link>
            <Link to="/flag-quiz" className="text-muted-foreground hover:text-foreground transition-colors">
              Flag Quiz
            </Link>
          </div>
          <div className="text-sm text-muted-foreground mt-4 md:mt-0">
            &copy; {new Date().getFullYear()} Culture Explorer - Zajac Ksawery
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
