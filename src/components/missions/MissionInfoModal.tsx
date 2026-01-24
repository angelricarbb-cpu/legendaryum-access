import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Target, Clock, Users, Gift, Crown, Calendar } from "lucide-react";
import { Mission } from "./MissionCard";

interface MissionInfoModalProps {
  mission: Mission | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStart?: (missionId: string) => void;
  userPlan?: "free" | "premium" | "all";
}

const formatTimeToComplete = (seconds: number): string => {
  if (seconds === 0) return "No time limit";
  if (seconds < 60) return `${seconds} seconds`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes`;
  return `${Math.floor(seconds / 3600)} hours`;
};

const MissionInfoModal = ({ 
  mission, 
  open, 
  onOpenChange,
  onStart,
  userPlan = "free"
}: MissionInfoModalProps) => {
  if (!mission) return null;

  const progressPercentage = (mission.completedCount / mission.maxParticipants) * 100;
  const isPlanLocked = mission.requiredPlan === "premium" && userPlan === "free";
  const isFull = mission.completedCount >= mission.maxParticipants;
  const canStart = !isFull && !isPlanLocked && mission.status === "available" && !mission.hasCompleted;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <DialogTitle className="text-lg">{mission.brandName}</DialogTitle>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4">
            {/* Mission Title & Description */}
            <div>
              <h3 className="text-xl font-bold text-foreground mb-2">{mission.title}</h3>
              <p className="text-sm text-muted-foreground">{mission.description}</p>
            </div>

            {/* Participants Progress */}
            <div className="bg-secondary/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  Participation
                </span>
                <span className="text-sm font-bold">{mission.completedCount} / {mission.maxParticipants}</span>
              </div>
              <div className="relative h-3 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="absolute inset-y-0 left-0 bg-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
                <div 
                  className="absolute inset-y-0 bg-primary/30 rounded-full"
                  style={{ left: `${progressPercentage}%`, right: 0 }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Green = Completed | Blue = Available slots
              </p>
            </div>

            {/* Mission Details */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-secondary/30 rounded-lg p-3 text-center">
                <Clock className="h-4 w-4 text-primary mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Time Limit</p>
                <p className="text-sm font-medium">{formatTimeToComplete(mission.timeToComplete)}</p>
              </div>
              <div className="bg-secondary/30 rounded-lg p-3 text-center">
                <Calendar className="h-4 w-4 text-primary mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Enabled</p>
                <p className="text-sm font-medium">{mission.startDate.toLocaleDateString()}</p>
              </div>
            </div>

            {/* Reward Section */}
            {mission.reward && (
              <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Gift className="h-5 w-5 text-amber-500" />
                  <span className="font-semibold text-foreground">Mission Reward</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-foreground">WIN</span>
                  <Badge variant="destructive" className="text-xs px-2 py-0.5">
                    {mission.rewardType?.toUpperCase() || "REWARD"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{mission.reward}</p>
              </div>
            )}

            {/* Plan Badge */}
            {mission.requiredPlan === "premium" && (
              <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <Crown className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-medium text-amber-500">Premium Mission</span>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Action Button */}
        <div className="pt-4 border-t border-border">
          {mission.status === "available" && canStart && onStart && (
            <Button 
              onClick={() => {
                onStart(mission.id);
                onOpenChange(false);
              }}
              className={`w-full ${
                mission.requiredPlan === "premium" 
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                  : "bg-primary hover:bg-primary/90 text-primary-foreground"
              }`}
            >
              Start Mission
            </Button>
          )}
          {mission.hasCompleted && (
            <div className="w-full text-center py-2 bg-green-500/20 rounded-lg border border-green-500/50">
              <span className="text-sm font-medium text-green-500">✓ Mission Completed</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MissionInfoModal;