import { Badge } from "@/components/ui/badge";
import { Crown, Gamepad2 } from "lucide-react";

export type GamePlanType = "free" | "premium" | "growth" | "scale" | "enterprise" | "all";

// Helper function to check if user's plan can access premium content
const canAccessPremium = (userPlan: GamePlanType): boolean => {
  return ["premium", "growth", "scale", "enterprise"].includes(userPlan);
};

export interface Game {
  id: string;
  title: string;
  image?: string;
  brandName?: string;
  requiredPlan: GamePlanType;
  category?: "game" | "mission" | "ranking";
}

interface GameCardProps {
  game: Game;
  userPlan?: GamePlanType;
  onClick: (gameId: string) => void;
}

const GameCard = ({ game, userPlan = "free", onClick }: GameCardProps) => {
  const isPlanLocked = game.requiredPlan === "premium" && !canAccessPremium(userPlan);

  return (
    <button
      onClick={() => onClick(game.id)}
      className={`relative aspect-square rounded-xl overflow-hidden group transition-all duration-200 hover:scale-[1.02] hover:shadow-xl ${
        isPlanLocked ? "opacity-80" : ""
      }`}
    >
      {/* Game Image */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20">
        {game.image ? (
          <img
            src={game.image}
            alt={game.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary to-secondary/50">
            <Gamepad2 className="h-12 w-12 text-primary/60" />
          </div>
        )}
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Premium Badge */}
      {game.requiredPlan === "premium" && (
        <div className="absolute top-2 right-2">
          <Badge className="text-[10px] px-2 py-0.5 bg-amber-500 hover:bg-amber-500 text-black">
            <Crown className="h-2.5 w-2.5 mr-1" />
            PREMIUM
          </Badge>
        </div>
      )}

      {/* Lock Overlay for Premium */}
      {isPlanLocked && (
        <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px] flex items-center justify-center">
          <div className="bg-amber-500/20 rounded-full p-3">
            <Crown className="h-8 w-8 text-amber-500" />
          </div>
        </div>
      )}

      {/* Title */}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <h3 className="text-sm font-semibold text-white truncate leading-tight">
          {game.title}
        </h3>
        {game.brandName && (
          <p className="text-xs text-white/70 truncate">{game.brandName}</p>
        )}
      </div>
    </button>
  );
};

export default GameCard;