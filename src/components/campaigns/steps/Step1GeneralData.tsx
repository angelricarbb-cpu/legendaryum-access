import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CampaignData } from "../CampaignWizard";

interface Step1Props {
  data: CampaignData;
  onUpdate: (updates: Partial<CampaignData>) => void;
}

export const Step1GeneralData = ({ data, onUpdate }: Step1Props) => {
  return (
    <div className="space-y-6">
      {/* Author Name */}
      <div className="space-y-2">
        <Label htmlFor="authorName">Nombre del autor (marca o persona)</Label>
        <Input
          id="authorName"
          value={data.authorName}
          onChange={(e) => onUpdate({ authorName: e.target.value })}
          placeholder="Ej: Nike, Juan García..."
          className="bg-background/50"
        />
      </div>

      {/* Author Email */}
      <div className="space-y-2">
        <Label htmlFor="authorEmail">Email del autor</Label>
        <Input
          id="authorEmail"
          type="email"
          value={data.authorEmail || ""}
          onChange={(e) => onUpdate({ authorEmail: e.target.value })}
          placeholder="contacto@empresa.com"
          className="bg-background/50"
        />
      </div>

      {/* Campaign Title */}
      <div className="space-y-2">
        <Label htmlFor="campaignTitle">Título de la campaña</Label>
        <Input
          id="campaignTitle"
          value={data.campaignTitle}
          onChange={(e) => onUpdate({ campaignTitle: e.target.value })}
          placeholder="Ej: Summer Challenge 2024"
          className="bg-background/50"
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Descripción breve</Label>
        <Textarea
          id="description"
          value={data.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder="Describe tu campaña en pocas palabras..."
          className="bg-background/50 resize-none"
          rows={3}
          maxLength={300}
        />
        <p className="text-xs text-muted-foreground text-right">
          {data.description.length}/300 caracteres
        </p>
      </div>

      {/* Ranking Type */}
      <div className="space-y-3">
        <Label>Tipo de ranking</Label>
        <RadioGroup
          value={data.rankingType}
          onValueChange={(value: "cumulative" | "top_score") => onUpdate({ rankingType: value })}
          className="grid grid-cols-2 gap-4"
        >
          <div className="flex items-center space-x-2 p-4 rounded-lg border border-border hover:border-primary/50 cursor-pointer transition-colors">
            <RadioGroupItem value="cumulative" id="cumulative" />
            <Label htmlFor="cumulative" className="cursor-pointer flex-1">
              <div className="font-medium">Acumulativo</div>
              <div className="text-xs text-muted-foreground">Suma de todas las puntuaciones</div>
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-4 rounded-lg border border-border hover:border-primary/50 cursor-pointer transition-colors">
            <RadioGroupItem value="top_score" id="top_score" />
            <Label htmlFor="top_score" className="cursor-pointer flex-1">
              <div className="font-medium">Top Score</div>
              <div className="text-xs text-muted-foreground">Mejor puntuación individual</div>
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Dates (only dates, no time) */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Fecha de inicio</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {data.startDate ? format(data.startDate, "PPP", { locale: es }) : "Seleccionar fecha"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={data.startDate || undefined}
                onSelect={(date) => onUpdate({ startDate: date || null })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Fecha de finalización</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {data.endDate ? format(data.endDate, "PPP", { locale: es }) : "Seleccionar fecha"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={data.endDate || undefined}
                onSelect={(date) => onUpdate({ endDate: date || null })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};
