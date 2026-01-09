import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Upload, FileSpreadsheet } from "lucide-react";
import { CampaignData } from "../CampaignWizard";

interface Step7Props {
  data: CampaignData;
  onUpdate: (updates: Partial<CampaignData>) => void;
}

const POSITION_OPTIONS: (1 | 3 | 5 | 10)[] = [1, 3, 5, 10];

export const Step7TopRanking = ({ data, onUpdate }: Step7Props) => {
  const [isEnabled, setIsEnabled] = useState(data.topRanking !== null);

  const handleToggle = (enabled: boolean) => {
    setIsEnabled(enabled);
    if (!enabled) {
      onUpdate({ topRanking: null });
    } else {
      onUpdate({
        topRanking: {
          prizeType: "code",
          topPositions: 1,
          samePrizeForAll: true,
          prizes: [{ position: 1, code: "", description: "" }]
        }
      });
    }
  };

  const updateTopRanking = (updates: Partial<NonNullable<CampaignData['topRanking']>>) => {
    if (data.topRanking) {
      onUpdate({ topRanking: { ...data.topRanking, ...updates } });
    }
  };

  const handlePositionsChange = (positions: 1 | 3 | 5 | 10) => {
    const prizes = Array.from({ length: positions }, (_, i) => ({
      position: i + 1,
      code: "",
      description: ""
    }));
    updateTopRanking({ topPositions: positions, prizes });
  };

  const updatePrize = (index: number, updates: { code?: string; description?: string }) => {
    if (data.topRanking) {
      const newPrizes = [...data.topRanking.prizes];
      newPrizes[index] = { ...newPrizes[index], ...updates };
      updateTopRanking({ prizes: newPrizes });
    }
  };

  return (
    <div className="space-y-6">
      {/* Enable Toggle */}
      <div className="flex items-center justify-between p-4 rounded-lg border border-border">
        <div className="flex items-center gap-3">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <div>
            <Label className="text-base font-medium">Premio final para Top Ranking</Label>
            <p className="text-sm text-muted-foreground">
              Configura el incentivo principal para los mejores del ranking
            </p>
          </div>
        </div>
        <Switch checked={isEnabled} onCheckedChange={handleToggle} />
      </div>

      {isEnabled && data.topRanking && (
        <div className="space-y-6">
          {/* Prize Type */}
          <div className="space-y-3">
            <Label>Tipo de premio</Label>
            <RadioGroup
              value={data.topRanking.prizeType}
              onValueChange={(value: "code" | "giftcard") => updateTopRanking({ prizeType: value })}
              className="grid grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2 p-4 rounded-lg border border-border hover:border-primary/50 cursor-pointer transition-colors">
                <RadioGroupItem value="code" id="tr-code" />
                <Label htmlFor="tr-code" className="cursor-pointer">
                  <div className="font-medium">Código de descuento</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 rounded-lg border border-border hover:border-primary/50 cursor-pointer transition-colors">
                <RadioGroupItem value="giftcard" id="tr-giftcard" />
                <Label htmlFor="tr-giftcard" className="cursor-pointer">
                  <div className="font-medium">Giftcard</div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Top Positions */}
          <div className="space-y-3">
            <Label>Posiciones premiadas</Label>
            <RadioGroup
              value={String(data.topRanking.topPositions)}
              onValueChange={(value) => handlePositionsChange(Number(value) as 1 | 3 | 5 | 10)}
              className="grid grid-cols-4 gap-4"
            >
              {POSITION_OPTIONS.map((pos) => (
                <div
                  key={pos}
                  className="flex items-center space-x-2 p-4 rounded-lg border border-border hover:border-primary/50 cursor-pointer transition-colors"
                >
                  <RadioGroupItem value={String(pos)} id={`pos-${pos}`} />
                  <Label htmlFor={`pos-${pos}`} className="cursor-pointer">
                    Top {pos}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Same Prize Toggle */}
          <div className="flex items-center justify-between p-4 rounded-lg border border-border">
            <div>
              <Label className="font-medium">Mismo premio para todos</Label>
              <p className="text-sm text-muted-foreground">
                O configura premios diferenciados por posición
              </p>
            </div>
            <Switch
              checked={data.topRanking.samePrizeForAll}
              onCheckedChange={(checked) => updateTopRanking({ samePrizeForAll: checked })}
            />
          </div>

          {/* Prize Configuration */}
          {data.topRanking.samePrizeForAll ? (
            <Card>
              <CardContent className="pt-4 space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  Premio para todos los ganadores
                </div>
                {data.topRanking.prizeType === "code" ? (
                  <>
                    <div className="space-y-2">
                      <Label>Código</Label>
                      <Input
                        value={data.topRanking.prizes[0]?.code || ""}
                        onChange={(e) => updatePrize(0, { code: e.target.value })}
                        placeholder="Ej: WINNER2024"
                        className="bg-background/50 font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Descripción</Label>
                      <Input
                        value={data.topRanking.prizes[0]?.description || ""}
                        onChange={(e) => updatePrize(0, { description: e.target.value })}
                        placeholder="Ej: 50% de descuento"
                        className="bg-background/50"
                      />
                    </div>
                  </>
                ) : (
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Subir archivo giftcard</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {data.topRanking.prizes.map((prize, index) => (
                <Card key={index}>
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-sm font-bold">{index + 1}</span>
                      </div>
                      <span className="font-medium">
                        {index === 0 ? "1er lugar" : index === 1 ? "2do lugar" : index === 2 ? "3er lugar" : `${index + 1}to lugar`}
                      </span>
                    </div>
                    {data.topRanking!.prizeType === "code" ? (
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          value={prize.code || ""}
                          onChange={(e) => updatePrize(index, { code: e.target.value })}
                          placeholder="Código"
                          className="bg-background/50 font-mono"
                        />
                        <Input
                          value={prize.description || ""}
                          onChange={(e) => updatePrize(index, { description: e.target.value })}
                          placeholder="Descripción"
                          className="bg-background/50"
                        />
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors cursor-pointer">
                        <Upload className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">Subir giftcard</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* CSV Upload Option */}
          <Card className="border-dashed">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Carga masiva con CSV</p>
                    <p className="text-sm text-muted-foreground">Sube códigos en lote para mayor rapidez</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Subir CSV
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
