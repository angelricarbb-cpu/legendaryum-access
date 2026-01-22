import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, Info, Gamepad2, Users } from "lucide-react";

export type CampaignFilterStatus = "available" | "ongoing" | "finished" | "coming_soon";

export interface RankingPlayer {
  position: number;
  username: string;
  avatar?: string;
  points: number;
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
}

interface RankingCampaignCardProps {
  campaign: RankingCampaign;
  onJoin: (campaignId: string) => void;
  onContinue: (campaignId: string) => void;
  onViewTopPositions: (campaignId: string) => void;
  onViewInfo: (campaignId: string) => void;
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

const RankingCampaignCard = ({ 
  campaign, 
  onJoin, 
  onContinue, 
  onViewTopPositions,
  onViewInfo 
}: RankingCampaignCardProps) => {
  const formatPoints = (pts: number) => pts.toLocaleString();

  return (
    <div className="bg-card rounded-xl border border-border hover:border-primary/40 transition-all duration-200 overflow-hidden group">
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
        
        {/* Badges overlay */}
        <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
          {campaign.hasCode && (
            <Badge variant="destructive" className="text-[10px] px-2 py-0.5">
              CODE
            </Badge>
          )}
          <button 
            onClick={() => onViewInfo(campaign.id)}
            className="ml-auto bg-background/80 backdrop-blur-sm rounded-full p-1.5 hover:bg-background transition-colors"
          >
            <Info className="h-4 w-4 text-foreground" />
          </button>
        </div>

        {/* Capacity badge */}
        <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
          <Users className="h-3 w-3 text-muted-foreground" />
          <span className="text-[10px] font-medium text-foreground">
            {campaign.totalPlayers}/{campaign.maxPlayers.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Title & Brand */}
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-foreground truncate leading-tight">{campaign.title}</h3>
          <p className="text-xs text-muted-foreground truncate">{campaign.brandName}</p>
        </div>

        {/* Top 3 - Compact avatars */}
        <button 
          onClick={() => onViewTopPositions(campaign.id)}
          className="w-full mb-3 p-2 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Top 3</span>
            <span className="text-[10px] text-primary">View all →</span>
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

        {/* My Stats Row */}
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

        {/* Action Button */}
        {campaign.status === "available" && (
          campaign.hasPlayed ? (
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
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
              size="sm"
            >
              Join now
            </Button>
          )
        )}
        
        {campaign.status === "coming_soon" && (
          <div className="w-full text-center py-2 bg-secondary/50 rounded-lg">
            <span className="text-xs font-medium text-muted-foreground">Coming Soon</span>
          </div>
        )}
        
        {campaign.status === "ongoing" && (
          <Button 
            onClick={() => onContinue(campaign.id)}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
            size="sm"
          >
            Continue
          </Button>
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
