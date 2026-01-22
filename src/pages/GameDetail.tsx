import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Play, 
  RotateCcw, 
  Apple, 
  Smartphone, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Globe,
  Gamepad2,
  ArrowRight,
  X
} from "lucide-react";

// Extended campaign data with game details
interface GameCampaign {
  id: string;
  title: string;
  brandName: string;
  gameImage: string;
  videoUrl?: string; // YouTube embed URL
  hasVideo: boolean;
  description: string;
  aboutGame: string;
  aboutCampaign: string;
  faqs: { question: string; answer: string }[];
  iosUrl?: string;
  androidUrl?: string;
  socialLinks: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    website?: string;
  };
  hasPlayed: boolean;
}

// Mock game data
const mockGameData: Record<string, GameCampaign> = {
  "1": {
    id: "1",
    title: "Turbo Jet Challenge",
    brandName: "REDVOLT LIMIT",
    gameImage: "/placeholder.svg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    hasVideo: true,
    description: "Experience the thrill of high-speed jet racing in this action-packed challenge!",
    aboutGame: "Turbo Jet is an adrenaline-pumping racing game where players navigate through challenging courses at breakneck speeds. Master the controls, avoid obstacles, and climb the leaderboard to win amazing prizes!",
    aboutCampaign: "This campaign is brought to you by REDVOLT LIMIT, the pioneers in energy drinks. Compete against players worldwide and showcase your skills to earn exclusive rewards including codes for free products and merchandise.",
    faqs: [
      { question: "How do I earn points?", answer: "You earn points based on your performance in each race. Faster completion times and fewer crashes result in higher scores." },
      { question: "Can I play on mobile?", answer: "Yes! The game is available on both iOS and Android devices. You can also play directly in your browser." },
      { question: "What are the prizes?", answer: "Top players receive exclusive discount codes, free product samples, and limited edition merchandise from REDVOLT LIMIT." },
      { question: "How long does the campaign last?", answer: "The campaign runs for 7 days from the start date. Check the campaign info for exact dates." },
    ],
    socialLinks: {
      twitter: "https://twitter.com/redvolt",
      instagram: "https://instagram.com/redvolt",
      linkedin: "https://linkedin.com/company/redvolt",
      website: "https://redvolt.com",
    },
    hasPlayed: false,
  },
  "2": {
    id: "2",
    title: "Moto Speed Challenge",
    brandName: "REDVOLT LIMIT",
    gameImage: "/placeholder.svg",
    hasVideo: false,
    description: "Race through the streets on your motorcycle and become the ultimate speed champion!",
    aboutGame: "Moto Speed puts you in control of powerful motorcycles as you weave through traffic and compete for the fastest times. The intuitive controls and stunning graphics make every race an unforgettable experience.",
    aboutCampaign: "Join the Moto Speed Challenge sponsored by REDVOLT LIMIT. Race your way to the top and win incredible prizes while enjoying the rush of high-speed motorcycle racing.",
    faqs: [
      { question: "How do I start playing?", answer: "Download the game from the App Store or Google Play, then join the campaign through this page." },
      { question: "Is there a leaderboard?", answer: "Yes! Your scores are tracked in real-time and displayed on the campaign leaderboard." },
      { question: "Can I compete with friends?", answer: "Absolutely! Share the campaign link with friends and compete to see who reaches the top first." },
    ],
    iosUrl: "https://apps.apple.com",
    androidUrl: "https://play.google.com",
    socialLinks: {
      twitter: "https://twitter.com/redvolt",
      instagram: "https://instagram.com/redvolt",
      website: "https://redvolt.com",
    },
    hasPlayed: true,
  },
};

// Mock new games
const newGames = [
  { id: "3", title: "Space Raiders Tournament", image: "/placeholder.svg" },
  { id: "4", title: "Winter Challenge 2024", image: "/placeholder.svg" },
  { id: "5", title: "Summer Splash Showdown", image: "/placeholder.svg" },
];

const GameDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  
  const [showPreroll, setShowPreroll] = useState(true);
  const [canSkip, setCanSkip] = useState(false);
  const [skipCountdown, setSkipCountdown] = useState(5);
  const skipTimerRef = useRef<NodeJS.Timeout | null>(null);

  const game = id ? mockGameData[id] : null;

  useEffect(() => {
    if (game?.hasVideo && showPreroll) {
      // Start countdown for skip button
      setSkipCountdown(5);
      skipTimerRef.current = setInterval(() => {
        setSkipCountdown((prev) => {
          if (prev <= 1) {
            setCanSkip(true);
            if (skipTimerRef.current) clearInterval(skipTimerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (skipTimerRef.current) clearInterval(skipTimerRef.current);
    };
  }, [game?.hasVideo, showPreroll]);

  if (!game) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header isLoggedIn={isLoggedIn} user={user ? { name: user.name, username: user.username, avatar: user.avatar } : undefined} />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Game not found</p>
        </main>
        <Footer />
      </div>
    );
  }

  const handleSkipVideo = () => {
    if (canSkip) {
      setShowPreroll(false);
    }
  };

  const handleWatchAgain = () => {
    setShowPreroll(true);
    setCanSkip(false);
    setSkipCountdown(5);
  };

  const handlePlayGame = () => {
    // This would navigate to actual game or trigger game start
    console.log("Starting game:", game.id);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header 
        isLoggedIn={isLoggedIn} 
        user={user ? { name: user.name, username: user.username, avatar: user.avatar } : undefined} 
      />

      <main className="flex-1">
        {/* Video Preroll / Game Image Section */}
        <section className="relative">
          {game.hasVideo && showPreroll ? (
            <div className="relative bg-black">
              <div className="container py-0">
                <div className="aspect-video max-h-[70vh] w-full">
                  <iframe
                    src={`${game.videoUrl}?autoplay=1&mute=1`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
              
              {/* Skip Button */}
              <div className="absolute bottom-6 right-6">
                <Button
                  variant={canSkip ? "default" : "secondary"}
                  onClick={handleSkipVideo}
                  disabled={!canSkip}
                  className="gap-2"
                >
                  {canSkip ? (
                    <>
                      Skip <X className="h-4 w-4" />
                    </>
                  ) : (
                    `Skip in ${skipCountdown}s`
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="container py-8 lg:py-12">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                {/* Game Image */}
                <div className="aspect-video rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden flex items-center justify-center">
                  {game.gameImage !== "/placeholder.svg" ? (
                    <img 
                      src={game.gameImage} 
                      alt={game.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-4 p-8">
                      <Gamepad2 className="h-20 w-20 text-primary" />
                      <span className="text-2xl font-bold text-foreground">{game.brandName}</span>
                    </div>
                  )}
                </div>

                {/* Game Info & Actions */}
                <div className="space-y-6">
                  <div>
                    <Badge variant="secondary" className="mb-3">{game.brandName}</Badge>
                    <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">{game.title}</h1>
                    <p className="text-lg text-muted-foreground">{game.description}</p>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <Button 
                      size="lg" 
                      onClick={handlePlayGame}
                      className="gap-2 rounded-full px-8"
                    >
                      <Play className="h-5 w-5" />
                      {game.hasPlayed ? "Continue Playing" : "Play Now"}
                    </Button>
                    
                    {game.hasVideo && (
                      <Button 
                        variant="outline" 
                        size="lg"
                        onClick={handleWatchAgain}
                        className="gap-2 rounded-full"
                      >
                        <RotateCcw className="h-5 w-5" />
                        Watch Video Again
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Download Section - Only show if iOS or Android URLs exist */}
        {(game.iosUrl || game.androidUrl) && (
          <section className="py-8 border-t border-border">
            <div className="container">
              <h2 className="text-xl font-semibold text-foreground mb-6">Available On</h2>
              <div className="flex flex-wrap gap-4">
                {game.iosUrl && (
                  <a href={game.iosUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="lg" className="gap-3 px-6">
                      <Apple className="h-6 w-6" />
                      <div className="text-left">
                        <p className="text-xs text-muted-foreground">Download on the</p>
                        <p className="font-semibold">App Store</p>
                      </div>
                    </Button>
                  </a>
                )}
                {game.androidUrl && (
                  <a href={game.androidUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="lg" className="gap-3 px-6">
                      <Smartphone className="h-6 w-6" />
                      <div className="text-left">
                        <p className="text-xs text-muted-foreground">Get it on</p>
                        <p className="font-semibold">Google Play</p>
                      </div>
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Social Media Section */}
        {Object.values(game.socialLinks).some(Boolean) && (
          <section className="py-8 border-t border-border">
            <div className="container">
              <h2 className="text-xl font-semibold text-foreground mb-6">Follow {game.brandName}</h2>
              <div className="flex flex-wrap gap-4">
                {game.socialLinks.twitter && (
                  <a href={game.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="lg" className="gap-2">
                      <Twitter className="h-5 w-5" />
                      Twitter
                    </Button>
                  </a>
                )}
                {game.socialLinks.instagram && (
                  <a href={game.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="lg" className="gap-2">
                      <Instagram className="h-5 w-5" />
                      Instagram
                    </Button>
                  </a>
                )}
                {game.socialLinks.linkedin && (
                  <a href={game.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="lg" className="gap-2">
                      <Linkedin className="h-5 w-5" />
                      LinkedIn
                    </Button>
                  </a>
                )}
                {game.socialLinks.website && (
                  <a href={game.socialLinks.website} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="lg" className="gap-2">
                      <Globe className="h-5 w-5" />
                      Website
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </section>
        )}

        {/* About Section */}
        <section className="py-12 border-t border-border">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>About the Game</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{game.aboutGame}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>About the Campaign</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{game.aboutCampaign}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQs Section */}
        {game.faqs.length > 0 && (
          <section className="py-12 border-t border-border bg-secondary/30">
            <div className="container">
              <h2 className="text-2xl font-bold text-foreground mb-8">Frequently Asked Questions</h2>
              <div className="max-w-3xl">
                <Accordion type="single" collapsible className="space-y-4">
                  {game.faqs.map((faq, index) => (
                    <AccordionItem 
                      key={index} 
                      value={`faq-${index}`}
                      className="bg-card rounded-lg border border-border px-6"
                    >
                      <AccordionTrigger className="text-left font-medium hover:no-underline">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </section>
        )}

        {/* New Games Section */}
        <section className="py-12 border-t border-border">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-foreground">New Games</h2>
              <Button 
                variant="ghost" 
                className="gap-2"
                onClick={() => navigate("/rankings")}
              >
                View all games
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {newGames
                .filter((g) => g.id !== id)
                .slice(0, 3)
                .map((newGame) => (
                  <Card 
                    key={newGame.id}
                    className="cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => navigate(`/game/${newGame.id}`)}
                  >
                    <CardContent className="p-0">
                      <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-t-lg flex items-center justify-center">
                        <Gamepad2 className="h-12 w-12 text-primary" />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-foreground">{newGame.title}</h3>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default GameDetail;
