import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Step1GeneralData } from "./steps/Step1GeneralData";
import { Step2MiniGame } from "./steps/Step2MiniGame";
import { Step3AddOns } from "./steps/Step3AddOns";
import { Step4FAQs } from "./steps/Step4FAQs";
import { Step5BonusLevel } from "./steps/Step5BonusLevel";
import { Step6SpecialReward } from "./steps/Step6SpecialReward";
import { Step7TopRanking } from "./steps/Step7TopRanking";
import { Step8Video } from "./steps/Step8Video";
import { Step9Checkout } from "./steps/Step9Checkout";

export interface CampaignData {
  // Step 1
  authorName: string;
  campaignTitle: string;
  description: string;
  rankingType: "cumulative" | "top_score";
  startDate: Date | null;
  endDate: Date | null;
  // Step 2
  selectedGame: string | null;
  // Step 3
  addOns: {
    extraParticipants: number;
    visibilityBoost: boolean;
    pushNotification: boolean;
  };
  // Step 4
  faqs: { question: string; answer: string }[];
  termsAndConditions: string;
  // Step 5
  bonusLevel: {
    requiredPlays: number;
    prizeType: "code" | "giftcard";
    emailMessage: string;
    prizeDescription: string;
    redeemUrl: string;
    code?: string;
    codeDescription?: string;
    file?: File | null;
  } | null;
  // Step 6
  specialReward: {
    requiredPlays: number;
    prizeType: "code" | "giftcard";
    emailMessage: string;
    prizeDescription: string;
    redeemUrl: string;
    code?: string;
    codeDescription?: string;
    file?: File | null;
  } | null;
  // Step 7
  topRanking: {
    prizeType: "code" | "giftcard";
    topPositions: 1 | 3 | 5 | 10;
    samePrizeForAll: boolean;
    prizes: { position: number; code?: string; description?: string; file?: File | null }[];
  } | null;
  // Step 8
  videoUrl: string;
}

interface CampaignWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userPlan: "GROWTH" | "SCALE";
  onComplete: (data: CampaignData) => void;
}

const STEPS = [
  { title: "Datos generales", number: 1 },
  { title: "Mini-juego", number: 2 },
  { title: "Add-ons", number: 3 },
  { title: "FAQs y T&C", number: 4 },
  { title: "Bonus Level", number: 5 },
  { title: "Special Reward", number: 6 },
  { title: "Top Ranking", number: 7 },
  { title: "Video", number: 8 },
  { title: "Checkout", number: 9 },
];

export const CampaignWizard = ({ open, onOpenChange, userPlan, onComplete }: CampaignWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [campaignData, setCampaignData] = useState<CampaignData>({
    authorName: "",
    campaignTitle: "",
    description: "",
    rankingType: "cumulative",
    startDate: null,
    endDate: null,
    selectedGame: null,
    addOns: {
      extraParticipants: 0,
      visibilityBoost: false,
      pushNotification: false,
    },
    faqs: [],
    termsAndConditions: "",
    bonusLevel: null,
    specialReward: null,
    topRanking: null,
    videoUrl: "",
  });

  const updateCampaignData = (updates: Partial<CampaignData>) => {
    setCampaignData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep < 9) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    onComplete(campaignData);
    onOpenChange(false);
    setCurrentStep(1);
  };

  const progress = (currentStep / 9) * 100;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1GeneralData data={campaignData} onUpdate={updateCampaignData} />;
      case 2:
        return <Step2MiniGame data={campaignData} onUpdate={updateCampaignData} userPlan={userPlan} />;
      case 3:
        return <Step3AddOns data={campaignData} onUpdate={updateCampaignData} userPlan={userPlan} />;
      case 4:
        return <Step4FAQs data={campaignData} onUpdate={updateCampaignData} />;
      case 5:
        return <Step5BonusLevel data={campaignData} onUpdate={updateCampaignData} />;
      case 6:
        return <Step6SpecialReward data={campaignData} onUpdate={updateCampaignData} />;
      case 7:
        return <Step7TopRanking data={campaignData} onUpdate={updateCampaignData} />;
      case 8:
        return <Step8Video data={campaignData} onUpdate={updateCampaignData} />;
      case 9:
        return <Step9Checkout data={campaignData} onComplete={handleComplete} />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-primary">Paso {currentStep}:</span> {STEPS[currentStep - 1].title}
          </DialogTitle>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            {STEPS.map((step) => (
              <span
                key={step.number}
                className={`${currentStep >= step.number ? "text-primary" : ""}`}
              >
                {step.number}
              </span>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto py-4 min-h-[400px]">
          {renderStep()}
        </div>

        {/* Navigation */}
        {currentStep < 9 && (
          <div className="flex justify-between pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Atrás
            </Button>
            <Button onClick={handleNext}>
              Continuar
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
