import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, Info, Users, Zap, Sparkles, Tag } from "lucide-react";
import { RankingCampaign, RankingPlayer } from "./RankingCampaignCard";

interface TopPositionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: RankingCampaign | null;
  onOpenInfo: () => void;
  onJoin: (campaignId: string) => void;
  onContinue: (campaignId: string) => void;
}

const getPositionIcon = (position: number) => {
  switch (position) {
    case 1:
      return <Trophy className="h-5 w-5 text-ranking-gold" />;
    case 2:
      return <Medal className="h-5 w-5 text-ranking-silver" />;
    case 3:
      return <Award className="h-5 w-5 text-ranking-bronze" />;
    default:
      return <span className="text-sm font-medium text-muted-foreground">#{position}</span>;
  }
};

// Extended mock data for top 10
const getTop10Players = (campaign: RankingCampaign): RankingPlayer[] => {
  const basePlayers = [...campaign.topPlayers];
  const mockNames = ["@ProGamer99", "@NightHawk", "@StarDust", "@Phoenix_X", "@ShadowBlade", "@LunarEclipse", "@DragonSlayer"];
  
  while (basePlayers.length < 10 && basePlayers.length < campaign.totalPlayers) {
    const pos = basePlayers.length + 1;
    basePlayers.push({
      position: pos,
      username: mockNames[pos - 4] || `@Player${pos}`,
      points: Math.max(100, Math.floor((campaign.topPlayers[0]?.points || 10000) / (pos * 1.5))),
    });
  }
  
  return basePlayers.slice(0, 10);
};

const TopPositionsModal = ({ 
  isOpen, 
  onClose, 
  campaign, 
  onOpenInfo,
  onJoin,
  onContinue 
}: TopPositionsModalProps) => {
  if (!campaign) return null;

  const top10 = getTop10Players(campaign);
  const formatPoints = (pts: number) => pts.toLocaleString();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Trophy className="h-6 w-6 text-ranking-gold" />
            {campaign.title} - Top Ranking
          </DialogTitle>
        </DialogHeader>

        {/* Campaign Summary Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-secondary/50 rounded-lg mb-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              <span className="font-semibold text-foreground">{campaign.totalPlayers}</span>
              <span className="text-muted-foreground"> / {campaign.maxPlayers.toLocaleString()} players</span>
            </span>
          </div>
          
          {/* Prize Icons */}
          <div className="flex items-center gap-2">
            {campaign.hasCode && (
              <div className="flex items-center gap-1 p-1.5 bg-primary/20 rounded-lg" title="Has Code Reward">
                <Tag className="h-4 w-4 text-primary" />
              </div>
            )}
            {campaign.bonusLevel && (
              <div className="flex items-center gap-1 p-1.5 bg-purple-500/20 rounded-lg" title="Bonus Level Available">
                <Zap className="h-4 w-4 text-purple-400" />
              </div>
            )}
            {campaign.specialReward && (
              <div className="flex items-center gap-1 p-1.5 bg-amber-500/20 rounded-lg" title="Special Reward Available">
                <Sparkles className="h-4 w-4 text-amber-400" />
              </div>
            )}
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onOpenInfo}
            className="gap-2 text-primary hover:text-primary"
          >
            <Info className="h-4 w-4" />
            + Info
          </Button>
        </div>

        {/* Top 10 Table */}
        <div className="space-y-2">
          {/* Header */}
          <div className="grid grid-cols-10 gap-2 px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
            <div className="col-span-1">Pos</div>
            <div className="col-span-6">Player</div>
            <div className="col-span-3 text-right">Points</div>
          </div>
          
          {/* Players */}
          {top10.map((player) => (
            <div 
              key={player.position}
              className={`grid grid-cols-10 gap-2 px-4 py-3 rounded-lg items-center transition-colors ${
                campaign.myPosition === player.position 
                  ? "bg-primary/20 border border-primary/30" 
                  : "bg-card hover:bg-secondary/50"
              }`}
            >
              <div className="col-span-1 flex items-center justify-center">
                {getPositionIcon(player.position)}
              </div>
              <div className="col-span-6 flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={player.avatar} />
                  <AvatarFallback className="text-xs bg-secondary">
                    {player.username.slice(1, 3).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium truncate">
                  {player.username}
                  {campaign.myPosition === player.position && (
                    <Badge variant="outline" className="ml-2 text-xs">You</Badge>
                  )}
                </span>
              </div>
              <div className="col-span-3 text-right font-semibold">
                {formatPoints(player.points)} pts
              </div>
            </div>
          ))}
        </div>

        {/* My Position Section (if not in top 10) */}
        {campaign.myPosition && campaign.myPosition > 10 && (
          <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
            <p className="text-sm text-muted-foreground mb-2">Your current position</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold">#{campaign.myPosition}</span>
                <span className="text-muted-foreground">of {campaign.totalPlayers} players</span>
              </div>
              <span className="font-semibold">{formatPoints(campaign.myPoints)} pts</span>
            </div>
          </div>
        )}

        {/* User's position if hasn't played */}
        {!campaign.hasPlayed && (
          <div className="mt-4 p-4 bg-secondary/50 rounded-lg text-center">
            <p className="text-muted-foreground mb-2">Your position</p>
            <p className="text-2xl font-bold text-muted-foreground">- - -</p>
            <p className="text-sm text-muted-foreground mt-1">Join to start competing!</p>
          </div>
        )}

        {/* Action Button */}
        <div className="flex justify-center mt-6">
          {campaign.status === "available" && (
            campaign.hasPlayed ? (
              <Button 
                onClick={() => onContinue(campaign.id)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8"
                size="lg"
              >
                Continue Playing
              </Button>
            ) : (
              <Button 
                onClick={() => onJoin(campaign.id)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8"
                size="lg"
              >
                Join Now
              </Button>
            )
          )}
          
          {campaign.status === "ongoing" && (
            <Button 
              onClick={() => onContinue(campaign.id)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8"
              size="lg"
            >
              Continue Playing
            </Button>
          )}
          
          {campaign.status === "coming_soon" && (
            <Badge variant="secondary" className="rounded-full px-6 py-2 text-base">
              Coming Soon
            </Badge>
          )}
          
          {campaign.status === "finished" && (
            <Badge variant="outline" className="rounded-full px-6 py-2 text-base">
              Campaign Finished
            </Badge>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TopPositionsModal;