import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  X,
  Heart,
  Send,
  Star,
  ChevronRight,
  Trophy,
  Gift
} from "lucide-react";

// Player interface for ranking
interface RankingPlayer {
  position: number;
  username: string;
  avatar?: string;
  points: number;
}

// Extended campaign data with game details
interface GameCampaign {
  id: string;
  title: string;
  brandName: string;
  brandLogo?: string;
  brandUsername: string;
  gameImage: string;
  category: string;
  videoUrl?: string;
  hasVideo: boolean;
  description: string;
  aboutGame: string;
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
  bonusLevel: { current: number; total: number };
  specialReward: { current: number; total: number };
  topPlayers: RankingPlayer[];
}

// Mock game data
const mockGameData: Record<string, GameCampaign> = {
  "1": {
    id: "1",
    title: "Turbo Jet Challenge",
    brandName: "Redvolt Limit",
    brandUsername: "@legendaryum-admin",
    gameImage: "/placeholder.svg",
    category: "Action",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    hasVideo: true,
    description: "A fast-paced endless runner where speed never stops increasing. Dodge obstacles, stay alive, and push your reflexes to the limit to achieve the highest score possible.",
    aboutGame: "Turbo Jet is an adrenaline-pumping racing game where players navigate through challenging courses at breakneck speeds. Master the controls, avoid obstacles, and climb the leaderboard to win amazing prizes!",
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
    bonusLevel: { current: 2, total: 5 },
    specialReward: { current: 1, total: 1 },
    topPlayers: [
      { position: 1, username: "@red-yoda-thai", points: 55088, avatar: "" },
      { position: 2, username: "@LegendAR11", points: 20622, avatar: "" },
      { position: 3, username: "@MiguelLegend", points: 5525, avatar: "" },
    ],
  },
  "2": {
    id: "2",
    title: "Moto Speed Challenge",
    brandName: "Redvolt Limit",
    brandUsername: "@legendaryum-admin",
    gameImage: "/placeholder.svg",
    category: "Racing",
    hasVideo: false,
    description: "A fast-paced endless runner where speed never stops increasing. Dodge obstacles, stay alive, and push your reflexes to the limit to achieve the highest score possible.",
    aboutGame: "Moto Speed puts you in control of powerful motorcycles as you weave through traffic and compete for the fastest times. The intuitive controls and stunning graphics make every race an unforgettable experience.",
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
    bonusLevel: { current: 3, total: 5 },
    specialReward: { current: 1, total: 1 },
    topPlayers: [
      { position: 1, username: "@red-yoda-thai", points: 55088, avatar: "" },
      { position: 2, username: "@LegendAR11", points: 20622, avatar: "" },
      { position: 3, username: "@MiguelLegend", points: 5525, avatar: "" },
    ],
  },
};

// Mock new games with more variety
const newGames = [
  { id: "3", title: "Glow Lashes", subtitle: "Glow Lashes", image: "/placeholder.svg" },
  { id: "4", title: "Sort Ville", subtitle: "Los Pitufos", image: "/placeholder.svg" },
  { id: "5", title: "Turbo Jet", subtitle: "Foto Impresion 2.0", image: "/placeholder.svg" },
  { id: "6", title: "Tap to Smash", subtitle: "Tap to Smash", image: "/placeholder.svg" },
  { id: "7", title: "IZ Awards", subtitle: "MEMO GAME 'La Cumbre'", image: "/placeholder.svg" },
  { id: "8", title: "Skull Squad", subtitle: "Mobile", image: "/placeholder.svg" },
  { id: "9", title: "Perfect Shot", subtitle: "Perfect Shot", image: "/placeholder.svg" },
  { id: "10", title: "Solitaire", subtitle: "Solitaire", image: "/placeholder.svg" },
];

// Position colors for ranking cards
const getPositionStyles = (position: number) => {
  switch (position) {
    case 1:
      return "bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-ranking-gold";
    case 2:
      return "bg-gradient-to-r from-slate-400/20 to-gray-300/20 border-ranking-silver";
    case 3:
      return "bg-gradient-to-r from-orange-600/20 to-amber-600/20 border-ranking-bronze";
    default:
      return "bg-secondary border-border";
  }
};

const getPositionIcon = (position: number) => {
  switch (position) {
    case 1:
      return <Trophy className="h-4 w-4 text-ranking-gold" />;
    case 2:
      return <Gift className="h-4 w-4 text-ranking-silver" />;
    case 3:
      return <Star className="h-4 w-4 text-ranking-bronze" />;
    default:
      return null;
  }
};

const GameDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  
  const [showPreroll, setShowPreroll] = useState(true);
  const [canSkip, setCanSkip] = useState(false);
  const [skipCountdown, setSkipCountdown] = useState(5);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const skipTimerRef = useRef<NodeJS.Timeout | null>(null);

  const game = id ? mockGameData[id] : null;

  useEffect(() => {
    if (game?.hasVideo && showPreroll) {
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
    console.log("Starting game:", game.id);
  };

  const bonusProgress = (game.bonusLevel.current / game.bonusLevel.total) * 100;
  const rewardProgress = (game.specialReward.current / game.specialReward.total) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header 
        isLoggedIn={isLoggedIn} 
        user={user ? { name: user.name, username: user.username, avatar: user.avatar } : undefined} 
      />

      <main className="flex-1">
        {/* Video Preroll Mode */}
        {game.hasVideo && showPreroll ? (
          <section className="relative bg-black">
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
          </section>
        ) : (
          <>
            {/* Breadcrumb */}
            <div className="container py-4">
              <nav className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
                <ChevronRight className="h-4 w-4" />
                <Link to="/rankings" className="hover:text-foreground transition-colors">Experience</Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-foreground">{game.brandName}</span>
              </nav>
            </div>

            {/* Main Game Area with Sidebar */}
            <section className="container pb-6">
              <div className="grid lg:grid-cols-[1fr,320px] gap-6">
                {/* Game Display */}
                <div className="space-y-4">
                  {/* Game Image/Logo */}
                  <div className="aspect-video rounded-xl bg-gradient-to-br from-amber-900/50 to-orange-900/50 border border-border overflow-hidden flex items-center justify-center relative">
                    {game.gameImage !== "/placeholder.svg" ? (
                      <img 
                        src={game.gameImage} 
                        alt={game.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <Gamepad2 className="h-32 w-32 text-primary opacity-50" />
                        <span className="text-4xl font-bold text-foreground mt-4">{game.brandName}</span>
                      </div>
                    )}
                  </div>

                  {/* Bottom Action Bar */}
                  <div className="flex items-center justify-between py-4 border-t border-border">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-primary">
                        <AvatarImage src={game.brandLogo} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {game.brandName.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-foreground">{game.brandName}</p>
                        <p className="text-sm text-muted-foreground">{game.brandUsername}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setIsLiked(!isLiked)}
                        className="flex flex-col items-center gap-1 h-auto py-2"
                      >
                        <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                        <span className="text-xs">Like</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="flex flex-col items-center gap-1 h-auto py-2"
                      >
                        <Send className="h-5 w-5" />
                        <span className="text-xs">Share</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setIsFavorite(!isFavorite)}
                        className="flex flex-col items-center gap-1 h-auto py-2"
                      >
                        <Star className={`h-5 w-5 ${isFavorite ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                        <span className="text-xs">Favorite</span>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                  {/* Bonus Level Progress */}
                  <Card className="bg-secondary/50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">
                          Bonus Level: {game.bonusLevel.current}/{game.bonusLevel.total}
                        </span>
                        <span className="text-sm text-muted-foreground">{bonusProgress.toFixed(0)}%</span>
                      </div>
                      <Progress value={bonusProgress} className="h-2 bg-muted" />
                    </CardContent>
                  </Card>

                  {/* Special Reward Progress */}
                  <Card className="bg-secondary/50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">
                          Special Reward: {game.specialReward.current}/{game.specialReward.total}
                        </span>
                        <span className="text-sm text-muted-foreground">{rewardProgress.toFixed(0)}%</span>
                      </div>
                      <Progress value={rewardProgress} className="h-2 bg-muted [&>div]:bg-gradient-to-r [&>div]:from-purple-500 [&>div]:to-pink-500" />
                    </CardContent>
                  </Card>

                  {/* Position in Ranking */}
                  <Card className="bg-secondary/50">
                    <CardContent className="p-4">
                      <h3 className="text-sm font-medium text-foreground mb-4">Position in the ranking</h3>
                      <div className="space-y-3">
                        {game.topPlayers.map((player) => (
                          <div
                            key={player.position}
                            className={`rounded-lg border p-3 ${getPositionStyles(player.position)}`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-lg font-bold text-foreground">#{player.position}</span>
                              <span className="text-sm font-medium text-foreground">{player.points.toLocaleString()} pts</span>
                              {getPositionIcon(player.position)}
                            </div>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={player.avatar} />
                                <AvatarFallback className="text-xs bg-muted">
                                  {player.username.slice(1, 3).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-muted-foreground">{player.username}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Play Button */}
                  <div className="flex flex-col gap-2">
                    <Button 
                      size="lg" 
                      onClick={handlePlayGame}
                      className="w-full gap-2"
                    >
                      <Play className="h-5 w-5" />
                      {game.hasPlayed ? "Continue Playing" : "Play Now"}
                    </Button>
                    
                    {game.hasVideo && (
                      <Button 
                        variant="outline" 
                        size="lg"
                        onClick={handleWatchAgain}
                        className="w-full gap-2"
                      >
                        <RotateCcw className="h-5 w-5" />
                        Watch Video Again
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* Download Section */}
        {(game.iosUrl || game.androidUrl) && !showPreroll && (
          <section className="py-12 border-t border-border">
            <div className="container">
              <h2 className="text-xl font-semibold text-foreground text-center mb-8">
                Select the game download platform
              </h2>
              <div className="flex justify-center">
                <div className="bg-secondary/50 rounded-xl p-6 inline-flex items-center gap-6">
                  <span className="font-medium text-foreground">Mobile</span>
                  {game.androidUrl && (
                    <a href={game.androidUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="secondary" size="lg" className="gap-3 px-6 bg-card hover:bg-card/80">
                        <Play className="h-5 w-5" />
                        Google Play
                      </Button>
                    </a>
                  )}
                  {game.iosUrl && (
                    <a href={game.iosUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="secondary" size="lg" className="gap-3 px-6 bg-card hover:bg-card/80">
                        <Apple className="h-5 w-5" />
                        App Store
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* About the Game Section */}
        {!showPreroll && (
          <section className="py-12 border-t border-border">
            <div className="container">
              <h2 className="text-xl font-semibold text-foreground text-center mb-8">About the game</h2>
              <div className="grid md:grid-cols-2 gap-8 items-center max-w-4xl mx-auto">
                {/* Brand Logo */}
                <div className="flex items-center justify-center">
                  <div className="w-64 h-64 rounded-xl bg-gradient-to-br from-amber-900/50 to-orange-900/50 flex items-center justify-center">
                    <Gamepad2 className="h-24 w-24 text-primary opacity-50" />
                  </div>
                </div>
                
                {/* About Content */}
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">{game.brandName}</h3>
                  <Badge variant="secondary" className="mb-4">{game.category}</Badge>
                  <p className="text-muted-foreground">{game.description}</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Social Media Section */}
        {Object.values(game.socialLinks).some(Boolean) && !showPreroll && (
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

        {/* FAQs Section */}
        {game.faqs.length > 0 && !showPreroll && (
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
        {!showPreroll && (
          <section className="py-12 border-t border-border">
            <div className="container">
              <div className="flex items-center gap-2 mb-8">
                <h2 className="text-2xl font-bold text-foreground">New Games</h2>
                <Gamepad2 className="h-6 w-6 text-primary" />
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {newGames
                  .filter((g) => g.id !== id)
                  .slice(0, 10)
                  .map((newGame) => (
                    <Card 
                      key={newGame.id}
                      className="cursor-pointer hover:border-primary/50 transition-colors bg-secondary/30 border-transparent"
                      onClick={() => navigate(`/game/${newGame.id}`)}
                    >
                      <CardContent className="p-0">
                        <div className="aspect-square rounded-t-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                          <Gamepad2 className="h-10 w-10 text-primary opacity-50" />
                        </div>
                        <div className="p-3">
                          <h3 className="font-semibold text-foreground text-sm">{newGame.title}</h3>
                          <p className="text-xs text-muted-foreground truncate">{newGame.subtitle}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default GameDetail;
