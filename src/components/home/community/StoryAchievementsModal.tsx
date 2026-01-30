import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target, Gamepad2, Award, Star, Flame, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { StoryUser } from "./StoryAvatar";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: "trophy" | "target" | "gamepad" | "award" | "star" | "flame" | "zap";
  rarity: "common" | "rare" | "epic" | "legendary";
  unlockedAt: Date;
}

interface StoryAchievementsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: StoryUser | null;
}

const iconMap = {
  trophy: Trophy,
  target: Target,
  gamepad: Gamepad2,
  award: Award,
  star: Star,
  flame: Flame,
  zap: Zap,
};

const rarityStyles = {
  common: "bg-muted text-muted-foreground border-border",
  rare: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  epic: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  legendary: "bg-gradient-to-br from-yellow-500/20 to-orange-500/20 text-yellow-400 border-yellow-500/30",
};

const rarityLabels = {
  common: "Común",
  rare: "Raro",
  epic: "Épico",
  legendary: "Legendario",
};

// Mock achievements based on user
const getMockAchievements = (userId: string): Achievement[] => {
  const baseAchievements: Achievement[] = [
    { id: "1", name: "Primera Victoria", description: "Ganaste tu primera partida", icon: "trophy", rarity: "common", unlockedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    { id: "2", name: "Racha de Fuego", description: "5 victorias consecutivas", icon: "flame", rarity: "rare", unlockedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) },
    { id: "3", name: "Maestro del Trivia", description: "100% en un quiz de 20 preguntas", icon: "star", rarity: "epic", unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
  ];

  // Add legendary for premium+ users
  if (userId === "1" || userId === "7") {
    baseAchievements.push({
      id: "4",
      name: "Leyenda Absoluta",
      description: "Top 1 en rankings globales",
      icon: "award",
      rarity: "legendary",
      unlockedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    });
  }

  // Vary achievements by user
  if (userId === "2" || userId === "5") {
    baseAchievements.push({
      id: "5",
      name: "Velocista",
      description: "Completaste 10 misiones en un día",
      icon: "zap",
      rarity: "rare",
      unlockedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    });
  }

  if (userId === "3" || userId === "8") {
    baseAchievements.push({
      id: "6",
      name: "Cazador de Dragones",
      description: "Derrotaste al jefe final",
      icon: "target",
      rarity: "epic",
      unlockedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    });
  }

  return baseAchievements;
};

const StoryAchievementsModal = ({ open, onOpenChange, user }: StoryAchievementsModalProps) => {
  if (!user) return null;

  const achievements = getMockAchievements(user.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar} alt={user.username} />
              <AvatarFallback className="bg-gradient-to-br from-primary/30 to-accent/30 text-sm">
                {user.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <span className="block">@{user.username}</span>
              <span className="text-xs text-muted-foreground font-normal">
                {achievements.length} logros desbloqueados
              </span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          {achievements.map((achievement) => {
            const Icon = iconMap[achievement.icon];
            return (
              <div
                key={achievement.id}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg border transition-all hover:scale-[1.02]",
                  rarityStyles[achievement.rarity]
                )}
              >
                <div className="p-2 rounded-lg bg-background/50">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-sm">{achievement.name}</h4>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                      {rarityLabels[achievement.rarity]}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {achievement.description}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Desbloqueado {achievement.unlockedAt.toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StoryAchievementsModal;
