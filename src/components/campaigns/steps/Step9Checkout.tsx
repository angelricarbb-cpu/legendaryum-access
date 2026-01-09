import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check, CreditCard, FileCheck, Loader2, ShoppingCart } from "lucide-react";
import { CampaignData } from "../CampaignWizard";

interface Step9Props {
  data: CampaignData;
  onComplete: () => void;
}

const PARTICIPANT_PRICES: Record<number, number> = {
  0: 0,
  50000: 49.99,
  100000: 89.99,
  500000: 299.99,
};

const VISIBILITY_BOOST_PRICE = 29.99;
const PUSH_NOTIFICATION_PRICE = 19.99;

export const Step9Checkout = ({ data, onComplete }: Step9Props) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const calculateTotal = () => {
    let total = 0;
    total += PARTICIPANT_PRICES[data.addOns.extraParticipants] || 0;
    if (data.addOns.visibilityBoost) total += VISIBILITY_BOOST_PRICE;
    if (data.addOns.pushNotification) total += PUSH_NOTIFICATION_PRICE;
    return total;
  };

  const total = calculateTotal();
  const hasAddOns = total > 0;

  const handleSubmit = () => {
    setIsProcessing(true);
    
    // Simulate payment/submission processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
    }, 2000);
  };

  if (isComplete) {
    return (
      <div className="text-center py-12 space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
          <Check className="h-10 w-10 text-green-500" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">
            {hasAddOns ? "¡Pago recibido correctamente!" : "¡Campaña enviada!"}
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            {hasAddOns 
              ? "En las próximas 48-72hs revisaremos y activaremos tu campaña. Te notificaremos por correo electrónico."
              : "Tu campaña entra en revisión por 48-72hs para aprobación y subida. Te notificaremos por correo electrónico."}
          </p>
        </div>

        <Button onClick={onComplete} size="lg">
          Volver al Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Campaign Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            Resumen de la campaña
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="text-muted-foreground">Título:</span>
            <span className="font-medium">{data.campaignTitle || "Sin título"}</span>
            
            <span className="text-muted-foreground">Autor:</span>
            <span className="font-medium">{data.authorName || "Sin autor"}</span>
            
            <span className="text-muted-foreground">Mini-juego:</span>
            <span className="font-medium capitalize">{data.selectedGame || "No seleccionado"}</span>
            
            <span className="text-muted-foreground">Tipo de ranking:</span>
            <span className="font-medium">
              {data.rankingType === "cumulative" ? "Acumulativo" : "Top Score"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Add-ons / Cart */}
      {hasAddOns ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Add-ons seleccionados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.addOns.extraParticipants > 0 && (
              <div className="flex justify-between text-sm">
                <span>+{(data.addOns.extraParticipants / 1000).toFixed(0)}k participantes extra</span>
                <span className="font-medium">${PARTICIPANT_PRICES[data.addOns.extraParticipants]}</span>
              </div>
            )}
            
            {data.addOns.visibilityBoost && (
              <div className="flex justify-between text-sm">
                <span>Boost de visibilidad</span>
                <span className="font-medium">${VISIBILITY_BOOST_PRICE}</span>
              </div>
            )}
            
            {data.addOns.pushNotification && (
              <div className="flex justify-between text-sm">
                <span>Push notification</span>
                <span className="font-medium">${PUSH_NOTIFICATION_PRICE}</span>
              </div>
            )}

            <Separator />

            <div className="flex justify-between font-medium">
              <span>Total a pagar</span>
              <Badge variant="secondary" className="text-lg px-4">
                ${total.toFixed(2)}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed">
          <CardContent className="py-8 text-center">
            <Check className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <p className="text-muted-foreground">
              No hay add-ons seleccionados. Tu campaña se enviará sin costo adicional.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={isProcessing}
        className="w-full"
        size="lg"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Procesando...
          </>
        ) : hasAddOns ? (
          <>
            <CreditCard className="mr-2 h-5 w-5" />
            Pagar con Stripe
          </>
        ) : (
          <>
            <Check className="mr-2 h-5 w-5" />
            Enviar campaña a revisión
          </>
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        {hasAddOns 
          ? "Se te redirigirá a Stripe para completar el pago de forma segura"
          : "Tu campaña será revisada en un plazo de 48-72 horas"}
      </p>
    </div>
  );
};
