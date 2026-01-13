import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  XCircle, Save, AlertTriangle, Send, Loader2
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface RejectedCampaign {
  id: string;
  title: string;
  author: string;
  authorEmail: string;
  description: string;
  rejectionReason: string;
  rejectionDetails?: string;
}

interface CampaignEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: RejectedCampaign | null;
  onSave: (campaignId: string, updates: { title: string; description: string }) => void;
}

export const CampaignEditModal = ({ 
  open, 
  onOpenChange, 
  campaign,
  onSave
}: CampaignEditModalProps) => {
  const [title, setTitle] = useState(campaign?.title || "");
  const [description, setDescription] = useState(campaign?.description || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update local state when campaign changes
  if (campaign && title !== campaign.title && description !== campaign.description) {
    setTitle(campaign.title);
    setDescription(campaign.description);
  }

  const getRejectionLabel = (reason?: string) => {
    switch (reason) {
      case "offensive_language": return "Lenguaje ofensivo";
      case "inappropriate_content": return "Contenido inapropiado";
      case "fraud": return "Fraude";
      case "other": return "Otros motivos";
      default: return reason || "Motivo no especificado";
    }
  };

  const handleSubmit = async () => {
    if (!campaign) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onSave(campaign.id, { title, description });
    
    setIsSubmitting(false);
    onOpenChange(false);
    
    toast({
      title: "Campaña reenviada",
      description: "Tu campaña ha sido enviada nuevamente para revisión. Te notificaremos en 48-72 horas.",
    });
  };

  if (!campaign) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Editar Campaña Rechazada
          </DialogTitle>
          <DialogDescription>
            Modifica tu campaña y reenvíala para una nueva revisión
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Rejection reason banner */}
          <Card className="border-red-500/30 bg-red-500/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-red-400">Motivo del rechazo:</span>
                    <Badge variant="outline" className="text-red-400 border-red-500/50">
                      {getRejectionLabel(campaign.rejectionReason)}
                    </Badge>
                  </div>
                  {campaign.rejectionDetails && (
                    <p className="text-sm text-muted-foreground italic">
                      "{campaign.rejectionDetails}"
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Editable fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Título de la campaña</Label>
              <Input
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título de la campaña"
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Descripción</Label>
              <Textarea
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descripción de la campaña..."
                className="bg-background/50 resize-none"
                rows={4}
                maxLength={300}
              />
              <p className="text-xs text-muted-foreground text-right">
                {description.length}/300 caracteres
              </p>
            </div>
          </div>

          {/* Help text */}
          <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <p className="text-sm text-yellow-500 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              Asegúrate de corregir el contenido según el motivo del rechazo para que tu campaña sea aprobada.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              className="flex-1" 
              onClick={handleSubmit}
              disabled={isSubmitting || !title.trim() || !description.trim()}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Guardar y reenviar
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
