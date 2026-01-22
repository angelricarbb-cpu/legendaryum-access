import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, Info } from "lucide-react";

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

const RankingCampaignCard = ({ campaign, onJoin, onContinue, onViewInfo }: RankingCampaignCardProps) => {
  const formatPoints = (pts: number) => pts.toLocaleString();

  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-6 p-4 lg:p-6 bg-card rounded-xl border border-border hover:border-primary/30 transition-colors">
      {/* Logo Section */}
      <div className="flex-shrink-0 w-full lg:w-auto flex justify-center lg:justify-start">
        <div className="w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-destructive to-ranking-gold rounded-lg flex items-center justify-center p-2">
          <div className="text-center">
            <span className="text-xs font-bold text-foreground leading-tight block">{campaign.brandName}</span>
          </div>
        </div>
      </div>

      {/* Campaign Info */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
          <h3 className="text-lg font-semibold text-foreground">{campaign.title}</h3>
          <button 
            onClick={() => onViewInfo(campaign.id)}
            className="text-primary text-sm hover:underline inline-flex items-center gap-1"
          >
            View top positions
          </button>
        </div>

        {/* Top Players */}
        <div className="space-y-2">
          {campaign.topPlayers.slice(0, 3).map((player) => (
            <div key={player.position} className="flex items-center gap-3">
              <div className="flex items-center gap-2 min-w-[24px]">
                {getPositionIcon(player.position)}
              </div>
              <Avatar className="h-6 w-6">
                <AvatarImage src={player.avatar} />
                <AvatarFallback className="text-xs bg-secondary">
                  {player.username.slice(1, 3).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground truncate max-w-[120px]">
                {player.username}
              </span>
              <span className="text-sm font-medium text-foreground ml-auto">
                {formatPoints(player.points)} pts
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* My Position Section */}
      <div className="flex-shrink-0 text-center px-4 py-2 bg-secondary/50 rounded-lg min-w-[120px]">
        <p className="text-xs text-muted-foreground mb-1">My position</p>
        <p className="text-2xl font-bold text-foreground">
          {campaign.myPosition ? `#${campaign.myPosition}` : "#--"}
        </p>
        <p className="text-xs text-muted-foreground">
          of {campaign.totalPlayers} players
        </p>
        <p className="text-sm font-medium text-foreground mt-1">
          {formatPoints(campaign.myPoints)} pts
        </p>
      </div>

      {/* Actions Section */}
      <div className="flex flex-col items-center gap-2 min-w-[120px]">
        {campaign.hasCode && (
          <Badge variant="destructive" className="text-xs">
            CODE
          </Badge>
        )}
        <p className="text-sm text-muted-foreground">
          {campaign.totalPlayers} / {campaign.maxPlayers.toLocaleString()}
        </p>
        <button 
          onClick={() => onViewInfo(campaign.id)}
          className="text-primary text-xs hover:underline flex items-center gap-1"
        >
          <Info className="h-3 w-3" />
          + Info
        </button>
        
        {campaign.status === "available" && (
          campaign.hasPlayed ? (
            <Button 
              onClick={() => onContinue(campaign.id)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6"
            >
              Continue
            </Button>
          ) : (
            <Button 
              onClick={() => onJoin(campaign.id)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6"
            >
              Join now
            </Button>
          )
        )}
        
        {campaign.status === "coming_soon" && (
          <Badge variant="secondary" className="rounded-full px-4 py-1">
            Coming Soon
          </Badge>
        )}
        
        {campaign.status === "ongoing" && (
          <Button 
            onClick={() => onContinue(campaign.id)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6"
          >
            Continue
          </Button>
        )}
        
        {campaign.status === "finished" && (
          <Badge variant="outline" className="rounded-full px-4 py-1">
            Finished
          </Badge>
        )}
      </div>
    </div>
  );
};

export default RankingCampaignCard;
