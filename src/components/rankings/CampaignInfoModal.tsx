import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Trophy, Gift, FileText, Calendar, Users, Award, Zap, Target, Sparkles, CreditCard } from "lucide-react";
import { RankingCampaign } from "./RankingCampaignCard";
import { format } from "date-fns";

interface CampaignInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: RankingCampaign | null;
}

// Mock extended campaign info
const getCampaignDetails = (campaign: RankingCampaign) => ({
  description: `Join the exciting ${campaign.title} and compete against players worldwide! Test your skills, climb the leaderboard, and win amazing prizes. This campaign is brought to you by ${campaign.brandName}.`,
  termsAndConditions: [
    "Must be 18 years or older to participate",
    "One account per person",
    "Prizes will be distributed within 7 days after campaign ends",
    "Cheating or exploiting bugs will result in disqualification",
    "The organizer reserves the right to modify rules at any time",
    "By participating, you agree to receive promotional communications",
  ],
  prizes: [
    { position: "1st Place", reward: "$100 Gift Card", icon: Trophy },
    { position: "2nd Place", reward: "$50 Gift Card", icon: Award },
    { position: "3rd Place", reward: "$25 Gift Card", icon: Award },
    { position: "4th - 10th", reward: "$10 Gift Card", icon: Gift },
  ],
});

const CampaignInfoModal = ({ isOpen, onClose, campaign }: CampaignInfoModalProps) => {
  if (!campaign) return null;

  const details = getCampaignDetails(campaign);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/50 to-accent/50 rounded-lg flex items-center justify-center">
              <span className="text-xs font-bold text-foreground text-center leading-tight px-1">
                {campaign.brandName}
              </span>
            </div>
            <div>
              <DialogTitle className="text-xl">{campaign.title}</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">by {campaign.brandName}</p>
            </div>
          </div>
        </DialogHeader>

        {/* Campaign Stats */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center p-3 bg-secondary/50 rounded-lg">
            <Calendar className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
            <p className="text-xs text-muted-foreground">Start Date</p>
            <p className="text-sm font-medium">{format(campaign.startDate, "MMM dd, yyyy")}</p>
          </div>
          <div className="text-center p-3 bg-secondary/50 rounded-lg">
            <Calendar className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
            <p className="text-xs text-muted-foreground">End Date</p>
            <p className="text-sm font-medium">{format(campaign.endDate, "MMM dd, yyyy")}</p>
          </div>
          <div className="text-center p-3 bg-secondary/50 rounded-lg">
            <Users className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
            <p className="text-xs text-muted-foreground">Players</p>
            <p className="text-sm font-medium">{campaign.totalPlayers} / {campaign.maxPlayers.toLocaleString()}</p>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Description - Moved to top */}
        <div>
          <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Description
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {details.description}
          </p>
        </div>

        <Separator className="my-4" />

        {/* Bonus Level & Special Reward */}
        {(campaign.bonusLevel || campaign.specialReward) && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Bonus Level - Discount Code related */}
              {campaign.bonusLevel && (
                <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Zap className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Bonus Level</h4>
                      <p className="text-xs text-muted-foreground">Discount code reward</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🏷️</span>
                        <span className="text-sm font-medium text-foreground">
                          {campaign.bonusLevel.reward.includes('%') ? campaign.bonusLevel.reward : `${campaign.bonusLevel.reward} Discount`}
                        </span>
                      </div>
                      <Badge variant="secondary" className="text-[10px] bg-purple-500/20 text-purple-400">
                        Code
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-purple-400" />
                      <span className="text-xs text-muted-foreground">Games to unlock:</span>
                      <span className="text-sm font-bold text-purple-400">{campaign.bonusLevel.gamesRequired} games</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Special Reward - Gift Card related */}
              {campaign.specialReward && (
                <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-600/5 border border-amber-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-amber-500/20 rounded-lg">
                      <Sparkles className="h-5 w-5 text-amber-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Special Reward</h4>
                      <p className="text-xs text-muted-foreground">Gift card prize</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-amber-400" />
                        <span className="text-sm font-medium text-foreground">
                          {campaign.specialReward.reward.includes('Gift') ? campaign.specialReward.reward : `${campaign.specialReward.reward} Gift Card`}
                        </span>
                      </div>
                      <Badge variant="secondary" className="text-[10px] bg-amber-500/20 text-amber-400">
                        Gift Card
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-amber-400" />
                      <span className="text-xs text-muted-foreground">Games to unlock:</span>
                      <span className="text-sm font-bold text-amber-400">{campaign.specialReward.gamesRequired} games</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Separator className="my-4" />
          </>
        )}

        {/* Top Ranking Prizes */}
        <div>
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Top Ranking Prizes
          </h3>
          <div className="space-y-2">
            {details.prizes.map((prize, index) => (
              <div 
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  index === 0 
                    ? "bg-ranking-gold/10 border border-ranking-gold/30" 
                    : index === 1 
                    ? "bg-ranking-silver/10 border border-ranking-silver/30"
                    : index === 2
                    ? "bg-ranking-bronze/10 border border-ranking-bronze/30"
                    : "bg-secondary/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <prize.icon className={`h-5 w-5 ${
                    index === 0 ? "text-ranking-gold" : 
                    index === 1 ? "text-ranking-silver" : 
                    index === 2 ? "text-ranking-bronze" : "text-muted-foreground"
                  }`} />
                  <span className="font-medium">{prize.position}</span>
                </div>
                <span className="text-sm text-muted-foreground">{prize.reward}</span>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-4" />

        {/* Terms and Conditions */}
        <div>
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Terms & Conditions
          </h3>
          <ul className="space-y-2">
            {details.termsAndConditions.map((term, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                {term}
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CampaignInfoModal;