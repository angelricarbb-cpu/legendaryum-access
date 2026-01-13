import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, Medal, Crown, Star, Gift, 
  Tv, ShoppingBag, Gamepad2, Zap, Target, Award,
  Copy, Check, ExternalLink
} from "lucide-react";
import { toast } from "sonner";

interface Achievement {
  id: string;
  title: string;
  description: string;
  campaign: string;
  position?: number;
  date: Date;
  icon: "trophy" | "medal" | "crown" | "star" | "target";
}

interface Benefit {
  id: string;
  title: string;
  discount: string;
  brand: string;
  icon: "tv" | "shopping" | "gaming" | "zap";
  validUntil: Date;
  code?: string;
  redeemUrl?: string;
  source: "bonus_level" | "special_reward" | "final_prize";
  used: boolean;
}

interface AchievementsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock data for achievements - Renombrado a "Reconocimientos"
const mockAchievements: Achievement[] = [
  {
    id: "1",
    title: "🥇 Campeón Absoluto",
    description: "1er puesto en el ranking global",
    campaign: "Summer Challenge 2025",
    position: 1,
    date: new Date("2025-08-15"),
    icon: "crown",
  },
  {
    id: "2",
    title: "🥈 Subcampeón",
    description: "2do puesto en el ranking global",
    campaign: "Winter Quest 2025",
    position: 2,
    date: new Date("2025-12-20"),
    icon: "trophy",
  },
  {
    id: "3",
    title: "🥉 Podio de Bronce",
    description: "3er puesto en el ranking global",
    campaign: "Holiday Special",
    position: 3,
    date: new Date("2025-12-31"),
    icon: "medal",
  },
  {
    id: "4",
    title: "⭐ Elite Player",
    description: "5to puesto en el ranking",
    campaign: "Spring Promo",
    position: 5,
    date: new Date("2025-04-10"),
    icon: "star",
  },
  {
    id: "5",
    title: "⭐ Top Performer",
    description: "8vo puesto en el ranking",
    campaign: "Autumn Festival",
    position: 8,
    date: new Date("2025-10-05"),
    icon: "star",
  },
  {
    id: "6",
    title: "🎯 Participante Destacado",
    description: "Completaste el reto con éxito",
    campaign: "Black Friday Rush",
    position: 15,
    date: new Date("2025-11-25"),
    icon: "target",
  },
];

const mockBenefits: Benefit[] = [
  {
    id: "1",
    title: "Descuento en Samsung TV",
    discount: "25% OFF",
    brand: "Samsung",
    icon: "tv",
    validUntil: new Date("2026-06-30"),
    code: "LEGEND25TV",
    redeemUrl: "https://samsung.com/redeem",
    source: "final_prize",
    used: false,
  },
  {
    id: "2",
    title: "Gaming Setup Premium",
    discount: "15% OFF",
    brand: "Razer",
    icon: "gaming",
    validUntil: new Date("2026-03-31"),
    code: "RAZER15PRO",
    redeemUrl: "https://razer.com/redeem",
    source: "special_reward",
    used: false,
  },
  {
    id: "3",
    title: "Suscripción Premium",
    discount: "3 meses gratis",
    brand: "Spotify",
    icon: "zap",
    validUntil: new Date("2026-02-28"),
    code: "SPOTIFYLEG",
    redeemUrl: "https://spotify.com/redeem",
    source: "bonus_level",
    used: false,
  },
  {
    id: "4",
    title: "Envío gratis + 10% OFF",
    discount: "Envío + 10%",
    brand: "Amazon",
    icon: "shopping",
    validUntil: new Date("2025-12-15"),
    code: "AMAZLEG10",
    redeemUrl: "https://amazon.com/redeem",
    source: "bonus_level",
    used: true,
  },
  {
    id: "5",
    title: "Accesorios Gaming",
    discount: "20% OFF",
    brand: "Logitech",
    icon: "gaming",
    validUntil: new Date("2025-11-30"),
    code: "LOGI20LEG",
    redeemUrl: "https://logitech.com/redeem",
    source: "special_reward",
    used: true,
  },
  {
    id: "6",
    title: "Auriculares Premium",
    discount: "30% OFF",
    brand: "Sony",
    icon: "zap",
    validUntil: new Date("2025-10-15"),
    code: "SONY30HEAD",
    redeemUrl: "https://sony.com/redeem",
    source: "bonus_level",
    used: false,
  },
  {
    id: "7",
    title: "Smart Watch",
    discount: "20% OFF",
    brand: "Garmin",
    icon: "zap",
    validUntil: new Date("2025-09-30"),
    code: "GARMIN20W",
    redeemUrl: "https://garmin.com/redeem",
    source: "special_reward",
    used: false,
  },
];

export const AchievementsModal = ({ open, onOpenChange }: AchievementsModalProps) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const now = new Date();
  
  // Beneficios activos: no usados Y no expirados
  const activeBenefits = mockBenefits.filter(b => !b.used && b.validUntil > now);
  // Beneficios finalizados: usados O expirados
  const finishedBenefits = mockBenefits.filter(b => b.used || b.validUntil <= now);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getPositionColor = (position?: number) => {
    if (!position) return "bg-muted";
    if (position === 1) return "bg-yellow-500";
    if (position === 2) return "bg-gray-400";
    if (position === 3) return "bg-amber-600";
    if (position <= 10) return "bg-primary";
    return "bg-violet-500";
  };

  const getPositionIcon = (icon: string) => {
    switch (icon) {
      case "crown": return Crown;
      case "trophy": return Trophy;
      case "medal": return Medal;
      case "target": return Target;
      default: return Star;
    }
  };

  const getBenefitIcon = (icon: string) => {
    switch (icon) {
      case "tv": return Tv;
      case "shopping": return ShoppingBag;
      case "gaming": return Gamepad2;
      default: return Zap;
    }
  };

  const getSourceLabel = (source: string) => {
    switch (source) {
      case "bonus_level": return { label: "Bonus Level", color: "bg-violet-500/20 text-violet-400 border-violet-500/30" };
      case "special_reward": return { label: "Special Reward", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" };
      case "final_prize": return { label: "Ranking Final", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" };
      default: return { label: "Reward", color: "bg-primary/20 text-primary border-primary/30" };
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success("Código copiado al portapapeles");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleOpenRedeemUrl = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/*
        Scroll robusto: hacemos que el propio DialogContent sea el contenedor scrollable.
        Esto evita problemas de altura/min-h-0 con Tabs/ScrollArea en algunos navegadores.
      */}
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto overscroll-contain">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Logros y Beneficios
          </DialogTitle>
          <DialogDescription>
            Tus reconocimientos de ranking y beneficios conseguidos
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="achievements" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-secondary/50">
            <TabsTrigger value="achievements" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Trophy className="h-4 w-4 mr-2" />
              Reconocimientos ({mockAchievements.length})
            </TabsTrigger>
            <TabsTrigger value="benefits" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Gift className="h-4 w-4 mr-2" />
              Beneficios ({activeBenefits.length})
            </TabsTrigger>
          </TabsList>


          {/* Achievements Tab - Renamed to Reconocimientos */}
          <TabsContent value="achievements" className="mt-4 space-y-3">
            {mockAchievements.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground">Aún no tienes reconocimientos de ranking</p>
                <p className="text-sm text-muted-foreground mt-1">¡Participa en campañas para ganar!</p>
              </div>
            ) : (
              mockAchievements.map((achievement) => {
                const IconComponent = getPositionIcon(achievement.icon);
                const isOutsideTop10 = achievement.position && achievement.position > 10;
                return (
                  <Card key={achievement.id} className="border-border hover:border-primary/50 transition-all">
                    <CardContent className="p-4">
                      <div className="flex gap-4 items-center">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center ${getPositionColor(achievement.position)}`}>
                          <IconComponent className="h-7 w-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-foreground">{achievement.title}</h4>
                            {achievement.position && achievement.position <= 3 && (
                              <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white border-0">
                                #{achievement.position}
                              </Badge>
                            )}
                            {achievement.position && achievement.position > 3 && achievement.position <= 10 && (
                              <Badge className="bg-primary/20 text-primary border-primary/30">
                                #{achievement.position}
                              </Badge>
                            )}
                            {isOutsideTop10 && (
                              <Badge className="bg-violet-500/20 text-violet-400 border-violet-500/30">
                                #{achievement.position}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                          <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Target className="h-3 w-3" />
                              {achievement.campaign}
                            </span>
                            <span>{formatDate(achievement.date)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>

          {/* Benefits Tab */}
          <TabsContent value="benefits" className="mt-4 space-y-4">
            {/* Active Benefits */}
            {activeBenefits.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Zap className="h-4 w-4 text-green-500" />
                  Beneficios Activos ({activeBenefits.length})
                </h3>
                {activeBenefits.map((benefit) => {
                  const IconComponent = getBenefitIcon(benefit.icon);
                  const sourceInfo = getSourceLabel(benefit.source);
                  return (
                    <Card key={benefit.id} className="border-green-500/30 bg-green-500/5 hover:border-green-500/50 transition-all">
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>

                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold text-foreground">{benefit.title}</h4>
                                <p className="text-sm text-muted-foreground">{benefit.brand}</p>
                              </div>
                              <Badge className="bg-green-500/20 text-green-400 border-green-500/50 text-lg px-3">
                                {benefit.discount}
                              </Badge>
                            </div>

                            <Badge variant="outline" className={sourceInfo.color}>
                              {sourceInfo.label}
                            </Badge>

                            <div className="flex items-center gap-2 pt-1">
                              <div className="flex-1 flex items-center gap-2">
                                <code className="text-xs bg-secondary px-2 py-1.5 rounded font-mono text-primary flex-1">
                                  {benefit.code}
                                </code>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0"
                                  onClick={() => benefit.code && handleCopyCode(benefit.code)}
                                >
                                  {copiedCode === benefit.code ? (
                                    <Check className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <Copy className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                              {benefit.redeemUrl && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-xs"
                                  onClick={() => handleOpenRedeemUrl(benefit.redeemUrl!)}
                                >
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  Canjear
                                </Button>
                              )}
                            </div>

                            <span className="text-xs text-muted-foreground">
                              Válido hasta {formatDate(benefit.validUntil)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Finalizados: expirados (aunque no usados) o canjeados */}
            {finishedBenefits.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  Beneficios Finalizados ({finishedBenefits.length})
                </h3>
                {finishedBenefits.map((benefit) => {
                  const IconComponent = getBenefitIcon(benefit.icon);
                  const sourceInfo = getSourceLabel(benefit.source);
                  const isExpired = benefit.validUntil <= now && !benefit.used;
                  return (
                    <Card key={benefit.id} className="border-border opacity-60">
                      <CardContent className="p-4">
                        <div className="flex gap-4 items-center">
                          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                            <IconComponent className="h-6 w-6 text-muted-foreground" />
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold text-muted-foreground">{benefit.title}</h4>
                                <p className="text-sm text-muted-foreground">{benefit.brand}</p>
                              </div>
                              <Badge
                                variant="outline"
                                className={isExpired ? "text-red-400 border-red-500/30" : "text-muted-foreground"}
                              >
                                {isExpired ? "Expirado" : "Canjeado"}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-muted-foreground border-muted">
                                {sourceInfo.label}
                              </Badge>
                              {isExpired && (
                                <span className="text-xs text-red-400">
                                  Expiró el {formatDate(benefit.validUntil)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {activeBenefits.length === 0 && finishedBenefits.length === 0 && (
              <div className="text-center py-12">
                <Gift className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground">Aún no tienes beneficios</p>
                <p className="text-sm text-muted-foreground mt-1">¡Gana posiciones en los rankings!</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};