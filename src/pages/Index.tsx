
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Globe, 
  Heart, 
  Map, 
  Flag, 
  Search,
  Utensils,
  Users,
  History
} from 'lucide-react';
import Header from '@/components/Header';
import CountryOfTheDay from '@/components/CountryOfTheDay';
import api, { Country } from '@/services/api';

const Index = () => {
  const navigate = useNavigate();
  const [featuredCountry, setFeaturedCountry] = useState<Country | null>(null);
  const [featuredCountryLoading, setFeaturedCountryLoading] = useState<boolean>(true);
  const [featuredCountryError, setFeaturedCountryError] = useState<string | null>(null);
  
  // Fetch country of the day on component mount
  useEffect(() => {
    const fetchFeaturedCountry = async () => {
      try {
        setFeaturedCountryLoading(true);
        setFeaturedCountryError(null);
        const randomCountry = await api.getRandomCountry();
        setFeaturedCountry(randomCountry);
      } catch (error) {
        console.error("Failed to fetch featured country:", error);
        setFeaturedCountryError("Failed to load country of the day");
      } finally {
        setFeaturedCountryLoading(false);
      }
    };
    
    fetchFeaturedCountry();
  }, []);
  
  const handleExploreCountry = (countryName: string) => {
    // Store the country name in sessionStorage to be used in the Search page
    sessionStorage.setItem('preselectedCountry', countryName);
    navigate('/search');
  };

  // Pass the handler to the CountryOfTheDay component
  const countryOfTheDayProps = {
    onExploreClick: handleExploreCountry
  };

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
      <Header />

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
                  <Search className="h-5 w-5 mr-2" />
                  Search Countries
                </Button>
              </Link>
              <Link to="/trip-planner">
                <Button size="lg" variant="outline" className="border-primary/30 hover:border-primary/60">
                  <Map className="h-5 w-5 mr-2" />
                  Plan Your Trip
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
              <Card className="h-full modern-card hover:border-primary/30 flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5 text-primary" />
                    Search Countries
                  </CardTitle>
                  <CardDescription>
                    Explore countries around the world
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground">
                    Search for any country by name or discover a random one. 
                    View detailed information and get interesting translations.
                  </p>
                </CardContent>
                <CardFooter className="mt-auto">
                  <Link to="/search" className="w-full">
                    <Button className="w-full btn-shine">
                      Start Searching
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
            
            <motion.div variants={cardVariants}>
              <Card className="h-full modern-card hover:border-primary/30 flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    Favorite Countries
                  </CardTitle>
                  <CardDescription>
                    Access your favorite countries
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground">
                    View and manage your favorite countries. Quickly access detailed information 
                    about the places that interest you most.
                  </p>
                </CardContent>
                <CardFooter className="mt-auto">
                  <Link to="/favorites" className="w-full">
                    <Button className="w-full" variant="outline">
                      View Favorites
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
            
            <motion.div variants={cardVariants}>
              <Card className="h-full modern-card hover:border-primary/30 flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Map className="h-5 w-5 text-primary" />
                    Trip Planner
                  </CardTitle>
                  <CardDescription>
                    Plan your next adventure
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground">
                    Create detailed travel itineraries, explore destinations, 
                    check weather forecasts, and estimate costs for your trips.
                  </p>
                </CardContent>
                <CardFooter className="mt-auto">
                  <Link to="/trip-planner" className="w-full">
                    <Button className="w-full" variant="outline">
                      Plan a Trip
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
            
            <motion.div variants={cardVariants}>
              <Card className="h-full modern-card hover:border-primary/30 flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Flag className="h-5 w-5 text-primary" />
                    Flag Quiz
                  </CardTitle>
                  <CardDescription>
                    Test your flag knowledge
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground">
                    Play our interactive flag quiz and challenge yourself to recognize
                    flags from around the world. Track your high scores and improve your knowledge.
                  </p>
                </CardContent>
                <CardFooter className="mt-auto">
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
          <CountryOfTheDay 
            country={featuredCountry}
            loading={featuredCountryLoading}
            error={featuredCountryError}
            onExploreClick={handleExploreCountry}
          />
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
                <Search className="h-5 w-5" />
                Search Countries
              </Button>
            </Link>
            <Link to="/trip-planner">
              <Button size="lg" variant="outline" className="gap-2">
                <Map className="h-5 w-5" />
                Plan a Trip
              </Button>
            </Link>
            <Link to="/favorites">
              <Button size="lg" variant="outline" className="gap-2">
                <Heart className="h-5 w-5" />
                View Favorites
              </Button>
            </Link>
            <Link to="/flag-quiz">
              <Button size="lg" variant="outline" className="gap-2">
                <Flag className="h-5 w-5" />
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
