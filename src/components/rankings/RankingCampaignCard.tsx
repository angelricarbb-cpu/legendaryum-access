import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, Info, Gamepad2, Users, Clock, Lock, Crown } from "lucide-react";

export type CampaignFilterStatus = "available" | "ongoing" | "finished" | "coming_soon";
export type PlanType = "free" | "premium" | "all";

export interface RankingPlayer {
  position: number;
  username: string;
  avatar?: string;
  points: number;
}

export interface BonusLevel {
  gamesRequired: number;
  reward: string;
  rewardType: "discount" | "item" | "code" | "points" | "mystery";
}

export interface SpecialReward {
  gamesRequired: number;
  reward: string;
  rewardType: "discount" | "item" | "code" | "points" | "mystery";
}

export interface RankingCampaign {
  id: string;
  title: string;
  logo: string;
  brandName: string;
  gameImage?: string;
  topPlayers: RankingPlayer[];
  myPosition: number | null;
  myPoints: number;
  totalPlayers: number;
  maxPlayers: number;
  hasPlayed: boolean;
  startDate: Date;
  endDate: Date;
  status: CampaignFilterStatus;
  hasCode?: boolean;
  requiredPlan?: PlanType;
  bonusLevel?: BonusLevel;
  specialReward?: SpecialReward;
}

interface RankingCampaignCardProps {
  campaign: RankingCampaign;
  userPlan?: PlanType;
  onJoin: (campaignId: string) => void;
  onContinue: (campaignId: string) => void;
  onViewTopPositions: (campaignId: string) => void;
  onViewInfo: (campaignId: string) => void;
  onUpgrade?: () => void;
}

const getPositionIcon = (position: number, size: "sm" | "md" = "sm") => {
  const sizeClass = size === "md" ? "h-5 w-5" : "h-3.5 w-3.5";
  switch (position) {
    case 1:
      return <Trophy className={`${sizeClass} text-ranking-gold`} />;
    case 2:
      return <Medal className={`${sizeClass} text-ranking-silver`} />;
    case 3:
      return <Award className={`${sizeClass} text-ranking-bronze`} />;
    default:
      return <span className="text-xs text-muted-foreground">#{position}</span>;
  }
};

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

const RankingCampaignCard = ({ 
  campaign, 
  userPlan = "free",
  onJoin, 
  onContinue, 
  onViewTopPositions,
  onViewInfo,
  onUpgrade
}: RankingCampaignCardProps) => {
  const formatPoints = (pts: number) => pts.toLocaleString();
  
  const isFull = campaign.totalPlayers >= campaign.maxPlayers;
  const isPlanLocked = campaign.requiredPlan === "premium" && userPlan === "free";
  const canJoin = !isFull && !isPlanLocked && campaign.status === "available";

  return (
    <div className={`bg-card rounded-xl border border-border hover:border-primary/40 transition-all duration-200 overflow-hidden group ${isPlanLocked ? 'opacity-80' : ''}`}>
      {/* Game Image Header */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden">
        {campaign.gameImage ? (
          <img 
            src={campaign.gameImage} 
            alt={campaign.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <Gamepad2 className="h-12 w-12 text-primary/60" />
            <span className="text-sm font-medium text-muted-foreground">{campaign.brandName}</span>
          </div>
        )}
        
        {/* Overlay for locked/full states */}
        {(isPlanLocked || isFull) && campaign.status !== "finished" && (
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
                <span className="text-xs font-medium text-foreground">Capacity Full</span>
              </div>
            ) : null}
          </div>
        )}
        
        {/* Badges overlay */}
        <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
          <div className="flex gap-1.5">
            {campaign.hasCode && (
              <Badge variant="destructive" className="text-[10px] px-2 py-0.5">
                CODE
              </Badge>
            )}
            {campaign.requiredPlan === "premium" && (
              <Badge className="text-[10px] px-2 py-0.5 bg-amber-500 hover:bg-amber-500 text-black">
                <Crown className="h-2.5 w-2.5 mr-1" />
                PREMIUM
              </Badge>
            )}
          </div>
          <button 
            onClick={() => onViewInfo(campaign.id)}
            className="bg-background/80 backdrop-blur-sm rounded-full p-1.5 hover:bg-background transition-colors"
          >
            <Info className="h-4 w-4 text-foreground" />
          </button>
        </div>

        {/* Capacity badge */}
        <div className={`absolute bottom-2 right-2 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 ${isFull ? 'bg-destructive/80' : 'bg-background/80'}`}>
          <Users className="h-3 w-3 text-muted-foreground" />
          <span className={`text-[10px] font-medium ${isFull ? 'text-destructive-foreground' : 'text-foreground'}`}>
            {campaign.totalPlayers.toLocaleString()}/{campaign.maxPlayers.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Title & Brand */}
        <div className="mb-2">
          <h3 className="text-sm font-semibold text-foreground truncate leading-tight">{campaign.title}</h3>
          <p className="text-xs text-muted-foreground truncate">{campaign.brandName}</p>
        </div>

        {/* Countdown Timer */}
        {campaign.status === "coming_soon" && (
          <div className="mb-2 p-2 bg-secondary/30 rounded-lg">
            <CountdownDisplay targetDate={campaign.startDate} label="Starts in" />
          </div>
        )}
        
        {campaign.status === "available" && (
          <div className="mb-2 p-2 bg-secondary/30 rounded-lg">
            <CountdownDisplay targetDate={campaign.endDate} label="Ends in" />
          </div>
        )}

        {campaign.status === "ongoing" && (
          <div className="mb-2 p-2 bg-secondary/30 rounded-lg">
            <CountdownDisplay targetDate={campaign.endDate} label="Ends in" />
          </div>
        )}

        {/* Top 3 - Compact avatars (hidden for coming_soon) */}
        {campaign.status !== "coming_soon" && (
          <button 
            onClick={() => onViewTopPositions(campaign.id)}
            className="w-full mb-3 p-2 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Top 3</span>
              <span className="text-[10px] text-primary">+ Info</span>
            </div>
            <div className="flex items-center justify-center gap-1">
              {campaign.topPlayers.slice(0, 3).map((player) => (
                <div key={player.position} className="flex flex-col items-center">
                  <div className="relative">
                    <Avatar className="h-8 w-8 border-2 border-background">
                      <AvatarImage src={player.avatar} />
                      <AvatarFallback className="text-[10px] bg-secondary">
                        {player.username.slice(1, 3).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5">
                      {getPositionIcon(player.position)}
                    </div>
                  </div>
                </div>
              ))}
              {campaign.topPlayers.length === 0 && (
                <p className="text-[10px] text-muted-foreground italic py-1">Be the first!</p>
              )}
            </div>
          </button>
        )}

        {/* My Stats Row - Hidden for coming_soon */}
        {campaign.status !== "coming_soon" && (
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-secondary/30 rounded-lg p-2 text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">My Score</p>
              <p className="text-sm font-bold text-foreground">
                {campaign.hasPlayed ? formatPoints(campaign.myPoints) : "---"}
              </p>
            </div>
            <div className="bg-secondary/30 rounded-lg p-2 text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Position</p>
              <p className="text-sm font-bold text-foreground">
                {campaign.myPosition ? `#${campaign.myPosition}` : "#--"}
              </p>
            </div>
          </div>
        )}

        {/* Action Button */}
        {campaign.status === "available" && (
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
                Capacity Full
              </Button>
            ) : campaign.hasPlayed ? (
              <Button 
                onClick={() => onContinue(campaign.id)}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
                size="sm"
              >
                Continue
              </Button>
            ) : (
              <Button 
                onClick={() => onJoin(campaign.id)}
                className={`w-full rounded-lg ${
                  campaign.requiredPlan === "premium" 
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                    : "bg-primary hover:bg-primary/90 text-primary-foreground"
                }`}
                size="sm"
              >
                Join now
              </Button>
            )}
          </>
        )}
        
        {campaign.status === "coming_soon" && (
          <CountdownButton targetDate={campaign.startDate} />
        )}
        
        {campaign.status === "ongoing" && (
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
            ) : isFull && !campaign.hasPlayed ? (
              <Button 
                disabled
                variant="outline"
                className="w-full rounded-lg cursor-not-allowed"
                size="sm"
              >
                <Lock className="h-3.5 w-3.5 mr-1.5" />
                Capacity Full
              </Button>
            ) : (
              <Button 
                onClick={() => onContinue(campaign.id)}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
                size="sm"
              >
                Continue
              </Button>
            )}
          </>
        )}
        
        {campaign.status === "finished" && (
          <div className="w-full text-center py-2 bg-secondary/50 rounded-lg border border-border">
            <span className="text-xs font-medium text-muted-foreground">Finished</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RankingCampaignCard;
