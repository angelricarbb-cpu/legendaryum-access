import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Trophy, Gift, FileText, Calendar, Users, Award } from "lucide-react";
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
    { position: "1st Place", reward: campaign.hasCode ? "Exclusive Code + $500 Gift Card" : "$500 Gift Card", icon: Trophy },
    { position: "2nd Place", reward: campaign.hasCode ? "Exclusive Code + $250 Gift Card" : "$250 Gift Card", icon: Award },
    { position: "3rd Place", reward: campaign.hasCode ? "Exclusive Code + $100 Gift Card" : "$100 Gift Card", icon: Award },
    { position: "4th - 10th", reward: campaign.hasCode ? "Exclusive Discount Code" : "Mystery Box", icon: Gift },
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
            <div className="w-16 h-16 bg-gradient-to-br from-destructive to-ranking-gold rounded-lg flex items-center justify-center">
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

        {/* Description */}
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

        {/* Prizes */}
        <div>
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Gift className="h-4 w-4" />
            Prizes
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

        {/* Prize Type Badge */}
        {campaign.hasCode && (
          <div className="mt-4 flex justify-center">
            <Badge variant="secondary" className="bg-primary/20 text-primary px-4 py-1">
              This campaign rewards with exclusive CODES
            </Badge>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CampaignInfoModal;
