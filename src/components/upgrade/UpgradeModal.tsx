import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, Check, Loader2, CreditCard, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgradeSuccess: () => void;
  targetPlan?: "premium" | "growth" | "scale";
}

const planDetails = {
  premium: {
    name: "Premium",
    price: "$9.99",
    period: "/mes",
    features: [
      "Acceso a Rankings Premium",
      "Acceso a Misiones Premium",
      "Acceso a Games Premium",
      "Acceso a Events Premium",
      "Insignias exclusivas",
    ],
  },
  growth: {
    name: "Growth",
    price: "$99.99",
    period: "/mes",
    features: [
      "Todo lo de Premium",
      "Crear campañas personalizadas",
      "Analytics básicos",
      "Hasta 10 campañas activas",
    ],
  },
  scale: {
    name: "Scale",
    price: "$199.99",
    period: "/mes",
    features: [
      "Todo lo de Growth",
      "Campañas ilimitadas",
      "Analytics avanzados",
      "Soporte prioritario",
    ],
  },
};

const UpgradeModal = ({
  isOpen,
  onClose,
  onUpgradeSuccess,
  targetPlan = "premium",
}: UpgradeModalProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const plan = planDetails[targetPlan];

  const handleUpgrade = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    toast.success(`¡Bienvenido a ${plan.name}! Tu plan ha sido actualizado.`);
    onUpgradeSuccess();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="bg-gradient-to-br from-amber-500 to-orange-500 p-2 rounded-lg">
              <Crown className="h-5 w-5 text-white" />
            </div>
            Upgrade a {plan.name}
          </DialogTitle>
          <DialogDescription>
            Desbloquea acceso completo a contenido premium
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Price */}
          <div className="text-center">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-4xl font-bold text-foreground">{plan.price}</span>
              <span className="text-muted-foreground">{plan.period}</span>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-3">
            {plan.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="bg-green-500/20 rounded-full p-1">
                  <Check className="h-3.5 w-3.5 text-green-500" />
                </div>
                <span className="text-sm text-foreground">{feature}</span>
              </div>
            ))}
          </div>

          {/* Simulated Card */}
          <div className="bg-secondary/50 rounded-lg p-4 border border-border">
            <div className="flex items-center gap-3 mb-3">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">Método de pago</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-background rounded-md p-2.5 border border-border">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Card</p>
                <p className="text-sm font-mono">•••• 4242</p>
              </div>
              <div className="bg-background rounded-md p-2.5 border border-border">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Expiry</p>
                <p className="text-sm font-mono">12/26</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <Button
              onClick={handleUpgrade}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Confirmar Upgrade
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={isProcessing}
              className="w-full"
            >
              Cancelar
            </Button>
          </div>

          {/* Footer note */}
          <p className="text-[10px] text-muted-foreground text-center">
            Podrás cancelar tu suscripción en cualquier momento desde tu Dashboard.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeModal;
