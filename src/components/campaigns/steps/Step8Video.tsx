import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Video, Youtube } from "lucide-react";
import { CampaignData } from "../CampaignWizard";

interface Step8Props {
  data: CampaignData;
  onUpdate: (updates: Partial<CampaignData>) => void;
}

export const Step8Video = ({ data, onUpdate }: Step8Props) => {
  const getYoutubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  const embedUrl = getYoutubeEmbedUrl(data.videoUrl);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 border border-border">
        <Video className="h-5 w-5 text-primary" />
        <div>
          <p className="font-medium">Video promocional (opcional)</p>
          <p className="text-sm text-muted-foreground">
            Este espacio promocional de la campaña se mostrará a los participantes
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="videoUrl" className="flex items-center gap-2">
          <Youtube className="h-4 w-4 text-red-500" />
          URL de YouTube
        </Label>
        <Input
          id="videoUrl"
          value={data.videoUrl}
          onChange={(e) => onUpdate({ videoUrl: e.target.value })}
          placeholder="https://www.youtube.com/watch?v=..."
          className="bg-background/50"
        />
      </div>

      {/* Video Preview */}
      {embedUrl ? (
        <Card>
          <CardContent className="pt-4">
            <Label className="mb-3 block">Vista previa</Label>
            <div className="aspect-video rounded-lg overflow-hidden bg-black">
              <iframe
                src={embedUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </CardContent>
        </Card>
      ) : data.videoUrl ? (
        <Card className="border-destructive/50">
          <CardContent className="pt-4 text-center">
            <p className="text-sm text-destructive">
              URL de YouTube no válida. Por favor, verifica el enlace.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Youtube className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground">
              Pega un enlace de YouTube para ver la vista previa
            </p>
          </CardContent>
        </Card>
      )}

      <p className="text-xs text-muted-foreground text-center">
        El video aparecerá en la página de la campaña para promocionar tu marca
      </p>
    </div>
  );
};
