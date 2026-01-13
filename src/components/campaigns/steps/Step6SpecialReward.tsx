import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Upload } from "lucide-react";
import { CampaignData } from "../CampaignWizard";

interface Step6Props {
  data: CampaignData;
  onUpdate: (updates: Partial<CampaignData>) => void;
}

export const Step6SpecialReward = ({ data, onUpdate }: Step6Props) => {
  const [isEnabled, setIsEnabled] = useState(data.specialReward !== null);

  const handleToggle = (enabled: boolean) => {
    setIsEnabled(enabled);
    if (!enabled) {
      onUpdate({ specialReward: null });
    } else {
      onUpdate({
        specialReward: {
          requiredPlays: 10,
          prizeType: "code",
          notificationTitle: "",
          prizeDescription: "",
          redeemUrl: "",
          code: "",
          codeDescription: "",
        }
      });
    }
  };

  const updateSpecialReward = (updates: Partial<NonNullable<CampaignData['specialReward']>>) => {
    if (data.specialReward) {
      onUpdate({ specialReward: { ...data.specialReward, ...updates } });
    }
  };

  return (
    <div className="space-y-6">
      {/* Enable Toggle */}
      <div className="flex items-center justify-between p-4 rounded-lg border border-border">
        <div className="flex items-center gap-3">
          <Star className="h-5 w-5 text-amber-500" />
          <div>
            <Label className="text-base font-medium">Habilitar Special Reward</Label>
            <p className="text-sm text-muted-foreground">
              Segundo nivel de premio con diferente umbral de partidas
            </p>
          </div>
        </div>
        <Switch checked={isEnabled} onCheckedChange={handleToggle} />
      </div>

      {isEnabled && data.specialReward && (
        <div className="space-y-6">
          {/* Required Plays */}
          <div className="space-y-2">
            <Label htmlFor="requiredPlays">Cantidad de partidas mínimas para desbloqueo</Label>
            <Input
              id="requiredPlays"
              type="number"
              min={1}
              value={data.specialReward.requiredPlays}
              onChange={(e) => updateSpecialReward({ requiredPlays: Number(e.target.value) })}
              className="bg-background/50 w-32"
            />
            <p className="text-xs text-muted-foreground">
              Debe ser diferente al Bonus Level
            </p>
          </div>

          {/* Prize Type */}
          <div className="space-y-3">
            <Label>Tipo de premio</Label>
            <RadioGroup
              value={data.specialReward.prizeType}
              onValueChange={(value: "code" | "giftcard") => updateSpecialReward({ prizeType: value })}
              className="grid grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2 p-4 rounded-lg border border-border hover:border-primary/50 cursor-pointer transition-colors">
                <RadioGroupItem value="code" id="sr-code" />
                <Label htmlFor="sr-code" className="cursor-pointer">
                  <div className="font-medium">Código de descuento</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 rounded-lg border border-border hover:border-primary/50 cursor-pointer transition-colors">
                <RadioGroupItem value="giftcard" id="sr-giftcard" />
                <Label htmlFor="sr-giftcard" className="cursor-pointer">
                  <div className="font-medium">Archivo descargable (Giftcard)</div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Common Fields */}
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="sr-notificationTitle">Notification Title</Label>
              <Input
                id="sr-notificationTitle"
                value={data.specialReward.notificationTitle || ""}
                onChange={(e) => updateSpecialReward({ notificationTitle: e.target.value })}
                placeholder="Título de la notificación que recibirá el usuario..."
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sr-prizeDescription">Descripción del premio</Label>
              <Input
                id="sr-prizeDescription"
                value={data.specialReward.prizeDescription}
                onChange={(e) => updateSpecialReward({ prizeDescription: e.target.value })}
                placeholder="Ej: Giftcard de $50"
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sr-redeemUrl">URL de canje</Label>
              <Input
                id="sr-redeemUrl"
                value={data.specialReward.redeemUrl}
                onChange={(e) => updateSpecialReward({ redeemUrl: e.target.value })}
                placeholder="https://tu-tienda.com/canjear"
                className="bg-background/50"
              />
            </div>
          </div>

          {/* Code Specific Fields */}
          {data.specialReward.prizeType === "code" && (
            <Card>
              <CardContent className="pt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sr-code">Código único global</Label>
                  <Input
                    id="sr-code"
                    value={data.specialReward.code || ""}
                    onChange={(e) => updateSpecialReward({ code: e.target.value })}
                    placeholder="Ej: SPECIAL50OFF"
                    className="bg-background/50 font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sr-codeDescription">Descripción del código</Label>
                  <Input
                    id="sr-codeDescription"
                    value={data.specialReward.codeDescription || ""}
                    onChange={(e) => updateSpecialReward({ codeDescription: e.target.value })}
                    placeholder="Ej: Válido hasta el 31/12/2024"
                    className="bg-background/50"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Giftcard Specific Fields */}
          {data.specialReward.prizeType === "giftcard" && (
            <Card>
              <CardContent className="pt-4">
                <Label>Subir archivo descargable</Label>
                <div className="mt-2 border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Arrastra tu archivo aquí o haz clic para seleccionar
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF, PNG, JPG hasta 10MB
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <p className="text-xs text-muted-foreground">
            📌 Este premio debe ser diferente al Bonus Level.
          </p>
        </div>
      )}
    </div>
  );
};
