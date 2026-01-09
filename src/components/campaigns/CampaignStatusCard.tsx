import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Calendar, Users, Eye, XCircle } from "lucide-react";

export type CampaignStatus = "pending" | "approved" | "rejected";

interface Campaign {
  id: string;
  title: string;
  author: string;
  status: CampaignStatus;
  startDate: Date | null;
  endDate: Date | null;
  participants: number;
  game: string;
  rejectionReason?: string;
}

interface CampaignStatusCardProps {
  campaign: Campaign;
  onViewMetrics?: (id: string) => void;
}

export const CampaignStatusCard = ({ campaign, onViewMetrics }: CampaignStatusCardProps) => {
  const getStatusBadge = () => {
    switch (campaign.status) {
      case "pending":
        return <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/50">🟡 Pendiente de revisión</Badge>;
      case "approved":
        return <Badge className="bg-green-500/20 text-green-500 border-green-500/50">🟢 Aprobada</Badge>;
      case "rejected":
        return <Badge className="bg-red-500/20 text-red-500 border-red-500/50">🔴 Rechazada</Badge>;
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "-";
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <Card className={`${
      campaign.status === "approved" 
        ? "border-green-500/30" 
        : campaign.status === "rejected"
          ? "border-red-500/30"
          : "border-yellow-500/30"
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{campaign.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{campaign.author}</p>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {campaign.status === "approved" && (
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <Users className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
              <p className="text-lg font-bold">{campaign.participants.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Participantes</p>
            </div>
            <div>
              <Calendar className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
              <p className="text-sm font-medium">{formatDate(campaign.startDate)}</p>
              <p className="text-xs text-muted-foreground">Inicio</p>
            </div>
            <div>
              <Calendar className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
              <p className="text-sm font-medium">{formatDate(campaign.endDate)}</p>
              <p className="text-xs text-muted-foreground">Fin</p>
            </div>
          </div>
        )}

        {campaign.status === "rejected" && campaign.rejectionReason && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <div className="flex items-start gap-2">
              <XCircle className="h-4 w-4 text-red-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-500">Motivo del rechazo</p>
                <p className="text-sm text-muted-foreground">{campaign.rejectionReason}</p>
              </div>
            </div>
          </div>
        )}

        {campaign.status === "pending" && (
          <p className="text-sm text-muted-foreground text-center py-2">
            Tu campaña está siendo revisada. Te notificaremos por email en 48-72 horas.
          </p>
        )}

        {campaign.status === "approved" && onViewMetrics && (
          <Button
            onClick={() => onViewMetrics(campaign.id)}
            className="w-full"
            variant="outline"
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            Ver métricas en vivo
          </Button>
        )}

        {campaign.status === "rejected" && (
          <Button variant="outline" className="w-full">
            Contactar soporte
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
