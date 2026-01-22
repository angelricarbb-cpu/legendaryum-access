import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, Info, Gamepad2 } from "lucide-react";

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

const getPositionIcon = (position: number) => {
  switch (position) {
    case 1:
      return <Trophy className="h-4 w-4 text-ranking-gold" />;
    case 2:
      return <Medal className="h-4 w-4 text-ranking-silver" />;
    case 3:
      return <Award className="h-4 w-4 text-ranking-bronze" />;
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
    <div className="bg-card rounded-xl border border-border hover:border-primary/30 transition-all duration-200 overflow-hidden">
      {/* Header with Game Image and Title */}
      <div className="flex items-center gap-4 p-4 border-b border-border/50">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center overflow-hidden">
            {campaign.gameImage ? (
              <img 
                src={campaign.gameImage} 
                alt={campaign.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <Gamepad2 className="h-6 w-6 text-primary" />
            )}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-foreground truncate">{campaign.title}</h3>
          <p className="text-xs text-muted-foreground">{campaign.brandName}</p>
        </div>

        {campaign.hasCode && (
          <Badge variant="destructive" className="text-xs flex-shrink-0">
            CODE
          </Badge>
        )}
      </div>

      {/* Top 3 Players - Compact */}
      <div className="px-4 py-3 border-b border-border/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Top Players</span>
          <button 
            onClick={() => onViewTopPositions(campaign.id)}
            className="text-primary text-xs hover:underline"
          >
            View all
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          {campaign.topPlayers.slice(0, 3).map((player) => (
            <div key={player.position} className="flex items-center gap-1.5 bg-secondary/50 rounded-full px-2 py-1">
              {getPositionIcon(player.position)}
              <Avatar className="h-5 w-5">
                <AvatarImage src={player.avatar} />
                <AvatarFallback className="text-[10px] bg-secondary">
                  {player.username.slice(1, 3).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-foreground truncate max-w-[60px]">
                {player.username}
              </span>
            </div>
          ))}
          {campaign.topPlayers.length === 0 && (
            <p className="text-xs text-muted-foreground italic">Be the first to play!</p>
          )}
        </div>
      </div>

      {/* My Stats & Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          {/* My Score & Position */}
          <div className="flex items-center gap-4">
            <div>
              <p className="text-xs text-muted-foreground">My Score</p>
              <p className="text-sm font-semibold text-foreground">
                {campaign.hasPlayed ? `${formatPoints(campaign.myPoints)} pts` : "---"}
              </p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div>
              <p className="text-xs text-muted-foreground">My Position</p>
              <p className="text-sm font-semibold text-foreground">
                {campaign.myPosition ? `#${campaign.myPosition}` : "#--"}
              </p>
            </div>
          </div>

          {/* Capacity */}
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Capacity</p>
            <p className="text-sm font-medium text-foreground">
              {campaign.totalPlayers}/{campaign.maxPlayers.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onViewInfo(campaign.id)}
            className="flex items-center justify-center gap-1 px-3 py-2 text-xs text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-secondary/50 transition-colors"
          >
            <Info className="h-3.5 w-3.5" />
            Info
          </button>
          
          <div className="flex-1">
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
              <Badge variant="secondary" className="w-full justify-center rounded-lg py-2">
                Coming Soon
              </Badge>
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
              <Badge variant="outline" className="w-full justify-center rounded-lg py-2">
                Finished
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RankingCampaignCard;
