import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Info, Gamepad2, Users, Clock, Lock, Crown, Target } from "lucide-react";

export type MissionFilterStatus = "available" | "finished" | "completed" | "coming_soon";
export type PlanType = "free" | "premium" | "all";

export interface Mission {
  id: string;
  title: string;
  description: string;
  logo: string;
  brandName: string;
  gameImage?: string;
  completedCount: number;
  maxParticipants: number;
  timeToComplete: number; // in seconds, 0 means no time limit
  startDate: Date;
  endDate: Date;
  status: MissionFilterStatus;
  hasCode?: boolean;
  requiredPlan?: PlanType;
  hasCompleted?: boolean; // User has completed this mission
  reward?: string;
  rewardType?: "code" | "item" | "discount";
}

interface MissionCardProps {
  mission: Mission;
  userPlan?: PlanType;
  onStart: (missionId: string) => void;
  onViewInfo: (missionId: string) => void;
  onUpgrade?: () => void;
}

const useCountdown = (targetDate: Date) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
};

const CountdownDisplay = ({ targetDate, label }: { targetDate: Date; label: string }) => {
  const timeLeft = useCountdown(targetDate);

  const formatUnit = (value: number, unit: string) => {
    return `${value}${unit}`;
  };

  return (
    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
      <Clock className="h-3 w-3" />
      <span>{label}:</span>
      <span className="font-medium text-foreground">
        {timeLeft.days > 0 && formatUnit(timeLeft.days, "d ")}
        {formatUnit(timeLeft.hours, "h ")}
        {formatUnit(timeLeft.minutes, "m")}
      </span>
    </div>
  );
};

const CountdownButton = ({ targetDate }: { targetDate: Date }) => {
  const timeLeft = useCountdown(targetDate);

  const formatUnit = (value: number, unit: string) => {
    return `${value}${unit}`;
  };

  return (
    <div className="w-full text-center py-2 bg-secondary/50 rounded-lg">
      <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Clock className="h-3.5 w-3.5" />
        <span>
          {timeLeft.days > 0 && formatUnit(timeLeft.days, "d ")}
          {formatUnit(timeLeft.hours, "h ")}
          {formatUnit(timeLeft.minutes, "m ")}
          {formatUnit(timeLeft.seconds, "s")}
        </span>
      </div>
    </div>
  );
};

const formatTimeToComplete = (seconds: number): string => {
  if (seconds === 0) return "No time limit";
  if (seconds < 60) return `${seconds} seconds`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes`;
  return `${Math.floor(seconds / 3600)} hours`;
};

const MissionCard = ({ 
  mission, 
  userPlan = "free",
  onStart, 
  onViewInfo,
  onUpgrade
}: MissionCardProps) => {
  const isFull = mission.completedCount >= mission.maxParticipants;
  const isPlanLocked = mission.requiredPlan === "premium" && userPlan === "free";
  const canStart = !isFull && !isPlanLocked && mission.status === "available" && !mission.hasCompleted;
  
  // Progress percentage for capacity bar
  const progressPercentage = (mission.completedCount / mission.maxParticipants) * 100;

  return (
    <div className={`bg-card rounded-xl border border-border hover:border-primary/40 transition-all duration-200 overflow-hidden group ${isPlanLocked ? 'opacity-80' : ''}`}>
      {/* Game Image Header */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden">
        {mission.gameImage ? (
          <img 
            src={mission.gameImage} 
            alt={mission.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <Target className="h-12 w-12 text-primary/60" />
            <span className="text-sm font-medium text-muted-foreground">{mission.brandName}</span>
          </div>
        )}
        
        {/* Overlay for locked/full states */}
        {(isPlanLocked || isFull) && mission.status !== "finished" && mission.status !== "completed" && (
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
            {isPlanLocked ? (
              <div className="flex flex-col items-center gap-2 text-center px-4">
                <div className="bg-amber-500/20 rounded-full p-3">
                  <Crown className="h-6 w-6 text-amber-500" />
                </div>
                <span className="text-xs font-medium text-foreground">Premium Only</span>
              </div>
            ) : isFull ? (
              <div className="flex flex-col items-center gap-2 text-center px-4">
                <div className="bg-destructive/20 rounded-full p-3">
                  <Lock className="h-6 w-6 text-destructive" />
                </div>
                <span className="text-xs font-medium text-foreground">Mission Full</span>
              </div>
            ) : null}
          </div>
        )}
        
        {/* Badges overlay */}
        <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
          <div className="flex gap-1.5">
            {mission.hasCode && (
              <Badge variant="destructive" className="text-[10px] px-2 py-0.5">
                CODE
              </Badge>
            )}
            {mission.requiredPlan === "premium" && (
              <Badge className="text-[10px] px-2 py-0.5 bg-amber-500 hover:bg-amber-500 text-black">
                <Crown className="h-2.5 w-2.5 mr-1" />
                PREMIUM
              </Badge>
            )}
          </div>
          <button 
            onClick={() => onViewInfo(mission.id)}
            className="bg-background/80 backdrop-blur-sm rounded-full p-1.5 hover:bg-background transition-colors"
          >
            <Info className="h-4 w-4 text-foreground" />
          </button>
        </div>

        {/* Title overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
          <h3 className="text-sm font-semibold text-white truncate leading-tight">{mission.title}</h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Description */}
        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{mission.description}</p>

        {/* Participants Progress Bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              Users who completed it:
            </span>
            <span className="font-medium text-foreground">
              {mission.completedCount} / {mission.maxParticipants}
            </span>
          </div>
          <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className="absolute inset-y-0 left-0 bg-green-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
            <div 
              className="absolute inset-y-0 bg-primary/30 rounded-full"
              style={{ left: `${progressPercentage}%`, right: 0 }}
            />
          </div>
        </div>

        {/* Countdown Timer */}
        {mission.status === "coming_soon" && (
          <div className="mb-2 p-2 bg-secondary/30 rounded-lg">
            <CountdownDisplay targetDate={mission.startDate} label="Starts in" />
          </div>
        )}
        
        {mission.status === "available" && (
          <div className="mb-2 p-2 bg-secondary/30 rounded-lg flex items-center justify-between">
            <CountdownDisplay targetDate={mission.endDate} label="Ends in" />
            {mission.timeToComplete > 0 && (
              <span className="text-[10px] text-muted-foreground">
                Time limit: <span className="font-medium text-foreground">{formatTimeToComplete(mission.timeToComplete)}</span>
              </span>
            )}
          </div>
        )}

        {/* Reward Display */}
        {mission.reward && (
          <div className="mb-3 flex items-center justify-center gap-2">
            <span className="text-xs text-muted-foreground">WIN</span>
            <Badge variant="destructive" className="text-[10px] px-2 py-0.5">
              {mission.rewardType?.toUpperCase() || "REWARD"}
            </Badge>
          </div>
        )}

        {/* Action Button */}
        {mission.status === "available" && (
          <>
            {isPlanLocked ? (
              <Button 
                onClick={onUpgrade}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg"
                size="sm"
              >
                <Crown className="h-3.5 w-3.5 mr-1.5" />
                Upgrade to Premium
              </Button>
            ) : isFull ? (
              <Button 
                disabled
                variant="outline"
                className="w-full rounded-lg cursor-not-allowed"
                size="sm"
              >
                <Lock className="h-3.5 w-3.5 mr-1.5" />
                Mission Full
              </Button>
            ) : mission.hasCompleted ? (
              <div className="w-full text-center py-2 bg-green-500/20 rounded-lg border border-green-500/50">
                <span className="text-xs font-medium text-green-500">✓ Completed</span>
              </div>
            ) : (
              <Button 
                onClick={() => onStart(mission.id)}
                className={`w-full rounded-lg ${
                  mission.requiredPlan === "premium" 
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                    : "bg-primary hover:bg-primary/90 text-primary-foreground"
                }`}
                size="sm"
              >
                Start Mission
              </Button>
            )}
          </>
        )}
        
        {mission.status === "coming_soon" && (
          <CountdownButton targetDate={mission.startDate} />
        )}
        
        {mission.status === "finished" && (
          <div className="w-full text-center py-2 bg-secondary/50 rounded-lg border border-border">
            <span className="text-xs font-medium text-muted-foreground">Finished</span>
          </div>
        )}

        {mission.status === "completed" && (
          <div className="w-full text-center py-2 bg-green-500/20 rounded-lg border border-green-500/50">
            <span className="text-xs font-medium text-green-500">✓ Completed</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MissionCard;