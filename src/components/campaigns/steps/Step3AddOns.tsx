import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Users, Megaphone, Bell, ShoppingCart } from "lucide-react";
import { CampaignData } from "../CampaignWizard";

interface Step3Props {
  data: CampaignData;
  onUpdate: (updates: Partial<CampaignData>) => void;
  userPlan: "GROWTH" | "SCALE";
}

const PARTICIPANT_OPTIONS = [
  { value: 0, label: "Usar límite incluido", price: 0 },
  { value: 50000, label: "+50k participantes", price: 49.99 },
  { value: 100000, label: "+100k participantes", price: 89.99 },
  { value: 500000, label: "+500k participantes", price: 299.99 },
];

const VISIBILITY_BOOST_PRICE = 29.99;
const PUSH_NOTIFICATION_PRICE = 19.99;

export const Step3AddOns = ({ data, onUpdate, userPlan }: Step3Props) => {
  const baseParticipants = userPlan === "SCALE" ? 20000 : 10000;
  
  const calculateTotal = () => {
    let total = 0;
    const selectedParticipant = PARTICIPANT_OPTIONS.find(o => o.value === data.addOns.extraParticipants);
    if (selectedParticipant) total += selectedParticipant.price;
    if (data.addOns.visibilityBoost) total += VISIBILITY_BOOST_PRICE;
    if (data.addOns.pushNotification) total += PUSH_NOTIFICATION_PRICE;
    return total;
  };

  const updateAddOn = (key: keyof CampaignData['addOns'], value: number | boolean) => {
    onUpdate({
      addOns: { ...data.addOns, [key]: value }
    });
  };

  const total = calculateTotal();

  return (
    <div className="space-y-6">
      {/* Plan Limit Info */}
      <div className="p-4 rounded-lg bg-muted/50 border border-border">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <span className="font-medium">
            Tu plan {userPlan} permite hasta {baseParticipants.toLocaleString()} participantes por campaña
          </span>
        </div>
      </div>

      {/* Extra Participants */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5" />
            Expandir alcance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={String(data.addOns.extraParticipants)}
            onValueChange={(value) => updateAddOn('extraParticipants', Number(value))}
            className="space-y-3"
          >
            {PARTICIPANT_OPTIONS.map((option) => (
              <div
                key={option.value}
                className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value={String(option.value)} id={`participants-${option.value}`} />
                  <Label htmlFor={`participants-${option.value}`} className="cursor-pointer">
                    {option.label}
                  </Label>
                </div>
                <span className="font-medium">
                  {option.price === 0 ? "Incluido" : `$${option.price}`}
                </span>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Visibility Boost */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Checkbox
                id="visibilityBoost"
                checked={data.addOns.visibilityBoost}
                onCheckedChange={(checked) => updateAddOn('visibilityBoost', !!checked)}
              />
              <Label htmlFor="visibilityBoost" className="cursor-pointer">
                <div className="flex items-center gap-2">
                  <Megaphone className="h-4 w-4 text-primary" />
                  <span className="font-medium">Boost de visibilidad</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Tu campaña aparecerá como sugerida en la plataforma
                </p>
              </Label>
            </div>
            <span className="font-medium">${VISIBILITY_BOOST_PRICE}</span>
          </div>
        </CardContent>
      </Card>

      {/* Push Notification */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Checkbox
                id="pushNotification"
                checked={data.addOns.pushNotification}
                onCheckedChange={(checked) => updateAddOn('pushNotification', !!checked)}
              />
              <Label htmlFor="pushNotification" className="cursor-pointer">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-primary" />
                  <span className="font-medium">Push notification</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Notificación push a todos los usuarios de la plataforma
                </p>
              </Label>
            </div>
            <span className="font-medium">${PUSH_NOTIFICATION_PRICE}</span>
          </div>
        </CardContent>
      </Card>

      {/* Cart Summary */}
      {total > 0 && (
        <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
              <span className="font-medium">Total add-ons</span>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-1">
              ${total.toFixed(2)}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Se pagará al finalizar el flujo con Stripe
          </p>
        </div>
      )}
    </div>
  );
};
