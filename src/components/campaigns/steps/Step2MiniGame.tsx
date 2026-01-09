import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Check } from "lucide-react";
import { CampaignData } from "../CampaignWizard";

interface Step2Props {
  data: CampaignData;
  onUpdate: (updates: Partial<CampaignData>) => void;
  userPlan: "GROWTH" | "SCALE";
}

const MINI_GAMES = [
  { id: "memory", name: "Memory Match", type: "memory", plan: "GROWTH", image: "🧠" },
  { id: "runner", name: "Endless Runner", type: "runner", plan: "GROWTH", image: "🏃" },
  { id: "puzzle", name: "Puzzle Slide", type: "puzzle", plan: "GROWTH", image: "🧩" },
  { id: "quiz", name: "Trivia Quiz", type: "quiz", plan: "GROWTH", image: "❓" },
  { id: "shooter", name: "Space Shooter", type: "shooter", plan: "SCALE", image: "🚀" },
  { id: "racing", name: "Racing Pro", type: "racing", plan: "SCALE", image: "🏎️" },
  { id: "arcade", name: "Arcade Classic", type: "arcade", plan: "SCALE", image: "🕹️" },
  { id: "adventure", name: "Adventure Quest", type: "adventure", plan: "SCALE", image: "⚔️" },
];

export const Step2MiniGame = ({ data, onUpdate, userPlan }: Step2Props) => {
  const canAccess = (gamePlan: string) => {
    if (userPlan === "SCALE") return true;
    return gamePlan === "GROWTH";
  };

  const handleSelect = (gameId: string, gamePlan: string) => {
    if (canAccess(gamePlan)) {
      onUpdate({ selectedGame: gameId });
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">
        Selecciona el mini-juego para tu campaña. Los juegos disponibles dependen de tu plan.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {MINI_GAMES.map((game) => {
          const hasAccess = canAccess(game.plan);
          const isSelected = data.selectedGame === game.id;

          return (
            <Card
              key={game.id}
              className={`cursor-pointer transition-all hover:scale-105 relative ${
                isSelected
                  ? "ring-2 ring-primary border-primary"
                  : hasAccess
                    ? "hover:border-primary/50"
                    : "opacity-60"
              }`}
              onClick={() => handleSelect(game.id, game.plan)}
            >
              <CardContent className="p-4 text-center">
                {!hasAccess && (
                  <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-lg">
                    <div className="text-center">
                      <Lock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">Requiere SCALE</p>
                    </div>
                  </div>
                )}
                
                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                )}

                <div className="text-4xl mb-2">{game.image}</div>
                <h3 className="font-medium text-sm">{game.name}</h3>
                <p className="text-xs text-muted-foreground capitalize">{game.type}</p>
                <Badge
                  variant="outline"
                  className={`mt-2 text-xs ${
                    game.plan === "SCALE" ? "border-plan-scale text-plan-scale" : "border-plan-growth text-plan-growth"
                  }`}
                >
                  {game.plan}
                </Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {data.selectedGame && (
        <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
          <p className="text-sm">
            <span className="font-medium">Juego seleccionado:</span>{" "}
            {MINI_GAMES.find(g => g.id === data.selectedGame)?.name}
          </p>
        </div>
      )}
    </div>
  );
};
