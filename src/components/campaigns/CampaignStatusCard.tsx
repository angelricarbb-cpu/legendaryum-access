import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Calendar, Users, XCircle, Edit, Clock, CheckCircle2 } from "lucide-react";

export type CampaignStatus = "pending" | "active" | "rejected" | "completed";

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
  rejectionDetails?: string;
}

interface CampaignStatusCardProps {
  campaign: Campaign;
  onViewMetrics?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export const CampaignStatusCard = ({ campaign, onViewMetrics, onEdit }: CampaignStatusCardProps) => {
  const getStatusBadge = () => {
    switch (campaign.status) {
      case "pending":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/50">
            <Clock className="h-3 w-3 mr-1" />
            Pendiente de revisión
          </Badge>
        );
      case "active":
        return (
          <Badge className="bg-green-500/20 text-green-500 border-green-500/50">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Activa
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-500/20 text-red-500 border-red-500/50">
            <XCircle className="h-3 w-3 mr-1" />
            Rechazada
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/50">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Finalizada
          </Badge>
        );
    }
  };

  const getRejectionLabel = (reason?: string) => {
    switch (reason) {
      case "offensive_language": return "Lenguaje ofensivo";
      case "inappropriate_content": return "Contenido inapropiado";
      case "fraud": return "Fraude";
      case "other": return "Otros motivos";
      default: return reason || "Motivo no especificado";
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "-";
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <Card className={`${
      campaign.status === "active" 
        ? "border-green-500/30" 
        : campaign.status === "rejected"
          ? "border-red-500/30"
          : campaign.status === "completed"
            ? "border-blue-500/30"
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
        {/* Stats for active campaigns */}
        {campaign.status === "active" && (
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

        {/* Stats for completed campaigns */}
        {campaign.status === "completed" && (
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

        {/* Rejection reason with details */}
        {campaign.status === "rejected" && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <div className="flex items-start gap-2">
              <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-500">Motivo del rechazo</p>
                <p className="text-sm text-muted-foreground">{getRejectionLabel(campaign.rejectionReason)}</p>
                {campaign.rejectionDetails && (
                  <p className="text-xs text-muted-foreground mt-1 italic">"{campaign.rejectionDetails}"</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Pending message */}
        {campaign.status === "pending" && (
          <p className="text-sm text-muted-foreground text-center py-2">
            Tu campaña está siendo revisada. Te notificaremos por email en 48-72 horas.
          </p>
        )}

        {/* Action buttons */}
        {campaign.status === "active" && onViewMetrics && (
          <Button
            onClick={() => onViewMetrics(campaign.id)}
            className="w-full"
            variant="outline"
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            Ver métricas en vivo
          </Button>
        )}

        {campaign.status === "completed" && onViewMetrics && (
          <Button
            onClick={() => onViewMetrics(campaign.id)}
            className="w-full"
            variant="outline"
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            Ver reporte final
          </Button>
        )}

        {campaign.status === "rejected" && onEdit && (
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => onEdit(campaign.id)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Editar y reenviar
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
