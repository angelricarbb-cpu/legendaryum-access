import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import GameCard, { Game, GamePlanType } from "@/components/games/GameCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import useRequireAuth from "@/hooks/useRequireAuth";
import { Gamepad2, Sparkles, Trophy, Target } from "lucide-react";
import { toast } from "sonner";

// Mock data for games
const mockGames: Game[] = [
  // Free games
  { id: "g1", title: "Redvolt Limit", brandName: "Racing Studio", requiredPlan: "all", category: "game" },
  { id: "g2", title: "Redvolt Limit UTN", brandName: "Racing Studio", requiredPlan: "all", category: "game" },
  { id: "g3", title: "Glow Lashes", brandName: "Beauty Games", requiredPlan: "all", category: "game" },
  { id: "g4", title: "Sort Ville Los Pitufos", brandName: "Puzzle Games", requiredPlan: "all", category: "game" },
  { id: "g5", title: "Turbo Jet Foto Impresion", brandName: "Action Games", requiredPlan: "all", category: "ranking" },
  { id: "g6", title: "Tap to Smash", brandName: "Arcade Games", requiredPlan: "all", category: "game" },
  { id: "g7", title: "Iz Awards Memo Game La Cumbre", brandName: "Memory Games", requiredPlan: "all", category: "mission" },
  { id: "g8", title: "Iz Awards Memo Game", brandName: "Memory Games", requiredPlan: "all", category: "mission" },
  { id: "g9", title: "Perfect Shot", brandName: "Sports Games", requiredPlan: "all", category: "game" },
  { id: "g10", title: "Solitaire", brandName: "Card Games", requiredPlan: "all", category: "game" },
  // Premium games
  { id: "g11", title: "Skull Squad Survive Tournament", brandName: "Action Games", requiredPlan: "premium", category: "ranking" },
  { id: "g12", title: "Skull Squad Mission 1", brandName: "Action Games", requiredPlan: "premium", category: "mission" },
  { id: "g13", title: "Skull Squad The Cementery", brandName: "Action Games", requiredPlan: "premium", category: "game" },
  { id: "g14", title: "Skull Squad Ice Royale", brandName: "Action Games", requiredPlan: "premium", category: "ranking" },
  { id: "g15", title: "Skull Squad Survive", brandName: "Action Games", requiredPlan: "premium", category: "game" },
  { id: "g16", title: "Taste Adventure", brandName: "Casual Games", requiredPlan: "all", category: "game" },
  { id: "g17", title: "Patience", brandName: "Card Games", requiredPlan: "all", category: "game" },
  { id: "g18", title: "Crowd Route", brandName: "Puzzle Games", requiredPlan: "all", category: "mission" },
  { id: "g19", title: "Teddy Conveyor", brandName: "Casual Games", requiredPlan: "premium", category: "game" },
  { id: "g20", title: "One Touch Goal", brandName: "Sports Games", requiredPlan: "all", category: "game" },
];

type FilterType = "all" | "missions" | "rankings";

const Games = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, user } = useAuth();
  const { redirectToAuthWithReturn, redirectToPricingWithMessage, canAccessPlan } = useRequireAuth();
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<string>("games");

  const filteredGames = mockGames.filter((game) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "missions") return game.category === "mission";
    if (activeFilter === "rankings") return game.category === "ranking";
    return true;
  });

  const handleGameClick = (gameId: string) => {
    const game = mockGames.find(g => g.id === gameId);
    if (!game) return;

    const isPlanLocked = game.requiredPlan === "premium" && !canAccessPlan("premium");

    if (isPlanLocked) {
      if (!isLoggedIn) {
        redirectToAuthWithReturn(location.pathname);
        return;
      }
      redirectToPricingWithMessage("Premium");
      return;
    }

    // Navigate to game detail
    navigate(`/game/${gameId}`);
  };

  const handleUpgrade = () => {
    navigate("/pricing");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header 
        isLoggedIn={isLoggedIn} 
        user={user ? { name: user.name, username: user.username, avatar: user.avatar } : undefined} 
      />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-8 lg:py-12">
          <div className="container">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <button onClick={() => navigate("/")} className="hover:text-foreground transition-colors">
                Home
              </button>
              <span>&gt;</span>
              <span className="text-primary">Games</span>
            </nav>

            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              {/* Hero Image */}
              <div className="relative w-full lg:w-2/5 max-w-md">
                <div className="aspect-[16/10] rounded-2xl bg-gradient-to-br from-orange-500/20 via-yellow-500/20 to-red-500/20 p-1 overflow-hidden">
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-orange-900/50 to-red-900/50 flex items-center justify-center relative overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,146,60,0.4),transparent_50%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(239,68,68,0.3),transparent_50%)]" />
                    
                    {/* Central icon */}
                    <div className="relative z-10 flex flex-col items-center gap-3">
                      <div className="bg-gradient-to-br from-orange-500 to-red-600 p-5 rounded-2xl shadow-2xl">
                        <Gamepad2 className="h-12 w-12 text-white" />
                      </div>
                      <div className="flex gap-2">
                        <div className="bg-amber-500/20 p-1.5 rounded-full">
                          <Trophy className="h-4 w-4 text-amber-500" />
                        </div>
                        <div className="bg-green-500/20 p-1.5 rounded-full">
                          <Sparkles className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="bg-purple-500/20 p-1.5 rounded-full">
                          <Target className="h-4 w-4 text-purple-500" />
                        </div>
                      </div>
                    </div>

                    {/* Floating elements */}
                    <div className="absolute top-3 left-3 w-6 h-6 bg-orange-400 rounded-full animate-pulse opacity-60" />
                    <div className="absolute top-6 right-6 w-4 h-4 bg-yellow-400 rounded-full animate-pulse opacity-60 delay-300" />
                    <div className="absolute bottom-4 left-6 w-3 h-3 bg-red-400 rounded-full animate-pulse opacity-60 delay-500" />
                  </div>
                </div>
              </div>

              {/* Hero Text */}
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-foreground mb-3 leading-tight">
                  Play and enjoy interactive{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                    games
                  </span>{" "}
                  created for entertainment and engagement.
                </h1>
                <p className="text-base text-muted-foreground max-w-xl">
                  Games are designed to provide engaging gameplay experiences across different themes and formats.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Filter & Grid Section */}
        <section className="py-6 lg:py-8">
          <div className="container">
            {/* Filters Row */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              {/* Left: Sort dropdown & All filter */}
              <div className="flex items-center gap-3">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[120px] bg-secondary/50 border-border">
                    <SelectValue placeholder="Games" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="games">Games</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="popular">Popular</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant={activeFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter("all")}
                  className={`rounded-full px-4 ${
                    activeFilter === "all" 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-transparent border-border hover:bg-secondary"
                  }`}
                >
                  All
                </Button>
              </div>

              {/* Right: Category filters */}
              <div className="flex items-center gap-2">
                <Button
                  variant={activeFilter === "missions" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter("missions")}
                  className={`rounded-full px-4 ${
                    activeFilter === "missions" 
                      ? "bg-purple-600 hover:bg-purple-700 text-white" 
                      : "bg-transparent border-border hover:bg-secondary"
                  }`}
                >
                  Missions
                </Button>
                <Button
                  variant={activeFilter === "rankings" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter("rankings")}
                  className={`rounded-full px-4 ${
                    activeFilter === "rankings" 
                      ? "bg-purple-600 hover:bg-purple-700 text-white" 
                      : "bg-transparent border-border hover:bg-secondary"
                  }`}
                >
                  Rankings
                </Button>
              </div>
            </div>

            {/* Games Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 lg:gap-4">
              {filteredGames.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  userPlan={user?.subscription?.plan as GamePlanType || "free"}
                  onClick={handleGameClick}
                />
              ))}
            </div>

            {/* Empty state */}
            {filteredGames.length === 0 && (
              <div className="text-center py-16">
                <Gamepad2 className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No games found</h3>
                <p className="text-muted-foreground">
                  There are no {activeFilter === "all" ? "" : activeFilter} games available at the moment.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Games;