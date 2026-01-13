import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BarChart3, Users, Calendar, Trophy, Download, 
  CheckCircle2, Gamepad2, Clock, Gift
} from "lucide-react";

interface FinishedCampaign {
  id: string;
  title: string;
  author: string;
  startDate: Date;
  endDate: Date;
  participants: number;
  totalMatches: number;
  totalMinutes: number;
  rewardsDelivered: number;
  totalRewards: number;
  game: string;
}

interface FinishedCampaignsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaigns: FinishedCampaign[];
  onViewReport: (campaignId: string) => void;
}

export const FinishedCampaignsModal = ({ 
  open, 
  onOpenChange, 
  campaigns,
  onViewReport 
}: FinishedCampaignsModalProps) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Campañas Finalizadas
          </DialogTitle>
          <DialogDescription>
            Historial de campañas completadas con sus métricas finales
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          {campaigns.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground">Aún no tienes campañas finalizadas</p>
            </div>
          ) : (
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <Card key={campaign.id} className="border-blue-500/20 bg-blue-500/5">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{campaign.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{campaign.author}</p>
                      </div>
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Finalizada
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Date range */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}</span>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="p-3 rounded-lg bg-muted/30 text-center">
                        <Users className="h-4 w-4 mx-auto mb-1 text-primary" />
                        <p className="text-lg font-bold">{campaign.participants.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Participantes</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/30 text-center">
                        <Gamepad2 className="h-4 w-4 mx-auto mb-1 text-accent" />
                        <p className="text-lg font-bold">{campaign.totalMatches.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Partidas</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/30 text-center">
                        <Clock className="h-4 w-4 mx-auto mb-1 text-yellow-500" />
                        <p className="text-lg font-bold">{campaign.totalMinutes.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Total Minutos</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/30 text-center">
                        <Gift className="h-4 w-4 mx-auto mb-1 text-amber-500" />
                        <p className="text-lg font-bold">{campaign.rewardsDelivered}/{campaign.totalRewards}</p>
                        <p className="text-xs text-muted-foreground">Rewards Entregados</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => onViewReport(campaign.id)}
                      >
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Ver Reporte Completo
                      </Button>
                      <Button variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
