import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Target, Gift, Medal, UserPlus, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { StoryUser } from "./StoryAvatar";

interface UserStats {
  rankingsParticipated: number;
  bonusLevelsUnlocked: number;
  specialRewardsUnlocked: number;
  podiumFinishes: number;
}

interface StoryAchievementsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: StoryUser | null;
  isFollowing?: boolean;
  onToggleFollow?: (userId: string) => void;
}

const getMockStats = (userId: string): UserStats => {
  const statsMap: Record<string, UserStats> = {
    "1": { rankingsParticipated: 24, bonusLevelsUnlocked: 8, specialRewardsUnlocked: 3, podiumFinishes: 5 },
    "2": { rankingsParticipated: 18, bonusLevelsUnlocked: 5, specialRewardsUnlocked: 2, podiumFinishes: 3 },
    "3": { rankingsParticipated: 32, bonusLevelsUnlocked: 12, specialRewardsUnlocked: 6, podiumFinishes: 9 },
    "4": { rankingsParticipated: 7, bonusLevelsUnlocked: 2, specialRewardsUnlocked: 0, podiumFinishes: 1 },
    "5": { rankingsParticipated: 15, bonusLevelsUnlocked: 6, specialRewardsUnlocked: 1, podiumFinishes: 2 },
    "6": { rankingsParticipated: 4, bonusLevelsUnlocked: 1, specialRewardsUnlocked: 0, podiumFinishes: 0 },
    "7": { rankingsParticipated: 41, bonusLevelsUnlocked: 15, specialRewardsUnlocked: 8, podiumFinishes: 12 },
    "8": { rankingsParticipated: 28, bonusLevelsUnlocked: 10, specialRewardsUnlocked: 4, podiumFinishes: 7 },
  };
  return statsMap[userId] || { rankingsParticipated: 0, bonusLevelsUnlocked: 0, specialRewardsUnlocked: 0, podiumFinishes: 0 };
};

const statCards = [
  { key: "rankingsParticipated" as const, label: "Rankings", icon: Trophy, color: "text-orange-500", bg: "from-orange-500/10 to-orange-500/5" },
  { key: "bonusLevelsUnlocked" as const, label: "Bonus Levels", icon: Target, color: "text-blue-500", bg: "from-blue-500/10 to-blue-500/5" },
  { key: "specialRewardsUnlocked" as const, label: "Special Rewards", icon: Gift, color: "text-purple-500", bg: "from-purple-500/10 to-purple-500/5" },
  { key: "podiumFinishes" as const, label: "Podium", icon: Medal, color: "text-yellow-500", bg: "from-yellow-500/10 to-yellow-500/5" },
];

const StoryAchievementsModal = ({ open, onOpenChange, user, isFollowing = false, onToggleFollow }: StoryAchievementsModalProps) => {
  if (!user) return null;

  const stats = getMockStats(user.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="sr-only">Perfil de {user.username}</DialogTitle>
        </DialogHeader>

        {/* User header */}
        <div className="flex flex-col items-center gap-3 pt-2">
          <Avatar className="h-16 w-16 border-2 border-primary/30">
            <AvatarImage src={user.avatar} alt={user.username} />
            <AvatarFallback className="bg-gradient-to-br from-primary/30 to-accent/30 text-lg font-bold">
              {user.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <p className="font-semibold text-foreground">@{user.username}</p>
            {user.plan !== "free" && (
              <Badge className={cn(
                "text-[10px] mt-1",
                user.plan === "premium" && "bg-plan-elite text-white",
                user.plan === "growth" && "bg-plan-growth text-white",
                user.plan === "scale" && "bg-plan-scale text-white"
              )}>
                {user.plan.toUpperCase()}
              </Badge>
            )}
          </div>
          {onToggleFollow && (
            <Button
              size="sm"
              variant={isFollowing ? "outline" : "default"}
              onClick={() => onToggleFollow(user.id)}
              className="rounded-full px-6"
            >
              {isFollowing ? (
                <>
                  <UserCheck className="h-3.5 w-3.5 mr-1.5" />
                  Following
                </>
              ) : (
                <>
                  <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                  Follow
                </>
              )}
            </Button>
          )}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          {statCards.map(({ key, label, icon: Icon, color, bg }) => (
            <div
              key={key}
              className={cn(
                "rounded-xl border border-border p-3 text-center bg-gradient-to-br",
                bg
              )}
            >
              <Icon className={cn("h-5 w-5 mx-auto mb-1.5", color)} />
              <p className="text-xl font-bold text-foreground">{stats[key]}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StoryAchievementsModal;
