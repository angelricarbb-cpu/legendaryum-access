import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Gift, Upload } from "lucide-react";
import { CampaignData } from "../CampaignWizard";

interface Step5Props {
  data: CampaignData;
  onUpdate: (updates: Partial<CampaignData>) => void;
}

export const Step5BonusLevel = ({ data, onUpdate }: Step5Props) => {
  const [isEnabled, setIsEnabled] = useState(data.bonusLevel !== null);

  const handleToggle = (enabled: boolean) => {
    setIsEnabled(enabled);
    if (!enabled) {
      onUpdate({ bonusLevel: null });
    } else {
      onUpdate({
        bonusLevel: {
          requiredPlays: 5,
          prizeType: "code",
          emailMessage: "",
          prizeDescription: "",
          redeemUrl: "",
          code: "",
          codeDescription: "",
        }
      });
    }
  };

  const updateBonusLevel = (updates: Partial<NonNullable<CampaignData['bonusLevel']>>) => {
    if (data.bonusLevel) {
      onUpdate({ bonusLevel: { ...data.bonusLevel, ...updates } });
    }
  };

  return (
    <div className="space-y-6">
      {/* Enable Toggle */}
      <div className="flex items-center justify-between p-4 rounded-lg border border-border">
        <div className="flex items-center gap-3">
          <Gift className="h-5 w-5 text-primary" />
          <div>
            <Label className="text-base font-medium">Habilitar Bonus Level</Label>
            <p className="text-sm text-muted-foreground">
              Premio que desbloquean los usuarios al alcanzar un número de partidas
            </p>
          </div>
        </div>
        <Switch checked={isEnabled} onCheckedChange={handleToggle} />
      </div>

      {isEnabled && data.bonusLevel && (
        <div className="space-y-6">
          {/* Required Plays */}
          <div className="space-y-2">
            <Label htmlFor="requiredPlays">Cantidad de partidas requeridas para desbloqueo</Label>
            <Input
              id="requiredPlays"
              type="number"
              min={1}
              value={data.bonusLevel.requiredPlays}
              onChange={(e) => updateBonusLevel({ requiredPlays: Number(e.target.value) })}
              className="bg-background/50 w-32"
            />
          </div>

          {/* Prize Type */}
          <div className="space-y-3">
            <Label>Tipo de premio</Label>
            <RadioGroup
              value={data.bonusLevel.prizeType}
              onValueChange={(value: "code" | "giftcard") => updateBonusLevel({ prizeType: value })}
              className="grid grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2 p-4 rounded-lg border border-border hover:border-primary/50 cursor-pointer transition-colors">
                <RadioGroupItem value="code" id="code" />
                <Label htmlFor="code" className="cursor-pointer">
                  <div className="font-medium">Código de descuento</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 rounded-lg border border-border hover:border-primary/50 cursor-pointer transition-colors">
                <RadioGroupItem value="giftcard" id="giftcard" />
                <Label htmlFor="giftcard" className="cursor-pointer">
                  <div className="font-medium">Archivo descargable (Giftcard)</div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Common Fields */}
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="emailMessage">Mensaje del email</Label>
              <Textarea
                id="emailMessage"
                value={data.bonusLevel.emailMessage}
                onChange={(e) => updateBonusLevel({ emailMessage: e.target.value })}
                placeholder="Mensaje que recibirá el usuario por email..."
                className="bg-background/50 resize-none"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prizeDescription">Descripción del premio</Label>
              <Input
                id="prizeDescription"
                value={data.bonusLevel.prizeDescription}
                onChange={(e) => updateBonusLevel({ prizeDescription: e.target.value })}
                placeholder="Ej: 25% de descuento en tu próxima compra"
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="redeemUrl">URL de canje</Label>
              <Input
                id="redeemUrl"
                value={data.bonusLevel.redeemUrl}
                onChange={(e) => updateBonusLevel({ redeemUrl: e.target.value })}
                placeholder="https://tu-tienda.com/canjear"
                className="bg-background/50"
              />
            </div>
          </div>

          {/* Code Specific Fields */}
          {data.bonusLevel.prizeType === "code" && (
            <Card>
              <CardContent className="pt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Código único global</Label>
                  <Input
                    id="code"
                    value={data.bonusLevel.code || ""}
                    onChange={(e) => updateBonusLevel({ code: e.target.value })}
                    placeholder="Ej: 25OFFBRAND"
                    className="bg-background/50 font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="codeDescription">Descripción del código</Label>
                  <Input
                    id="codeDescription"
                    value={data.bonusLevel.codeDescription || ""}
                    onChange={(e) => updateBonusLevel({ codeDescription: e.target.value })}
                    placeholder="Ej: Válido hasta el 31/12/2024"
                    className="bg-background/50"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Giftcard Specific Fields */}
          {data.bonusLevel.prizeType === "giftcard" && (
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
            📌 El mismo código/archivo se entrega a todos los usuarios que desbloquean el bonus.
          </p>
        </div>
      )}
    </div>
  );
};
