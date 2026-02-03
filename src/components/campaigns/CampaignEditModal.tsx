import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  XCircle, Save, AlertTriangle, Send, Loader2, ArrowLeft, ArrowRight, 
  CalendarIcon, Check, Lock
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CampaignData } from "./CampaignWizard";

// Fields that can have errors based on rejection comments
type FieldWithError = 
  | "authorName" | "authorEmail" | "campaignTitle" | "description" 
  | "startDate" | "endDate" | "selectedGame" | "videoUrl" 
  | "termsAndConditions" | "bonusLevel" | "specialReward" | "topRanking";

interface FieldError {
  field: FieldWithError;
  message: string;
  step: number;
}

interface RejectedCampaign {
  id: string;
  title: string;
  author: string;
  authorEmail?: string;
  description?: string;
  rejectionReason: string;
  rejectionDetails?: string;
}

interface CampaignEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: RejectedCampaign | null;
  onSave: (campaignId: string, updates: { title: string; description: string }) => void;
}

const STEPS = [
  { title: "Datos generales", number: 1, fields: ["authorName", "authorEmail", "campaignTitle", "description", "startDate", "endDate"] },
  { title: "Mini-juego", number: 2, fields: ["selectedGame"] },
  { title: "Add-ons", number: 3, fields: [] },
  { title: "FAQs y T&C", number: 4, fields: ["termsAndConditions"] },
  { title: "Bonus Level", number: 5, fields: ["bonusLevel"] },
  { title: "Special Reward", number: 6, fields: ["specialReward"] },
  { title: "Top Ranking", number: 7, fields: ["topRanking"] },
  { title: "Video", number: 8, fields: ["videoUrl"] },
];

// Parse rejection details to extract field-specific errors
const parseRejectionDetails = (details: string | undefined): FieldError[] => {
  if (!details) return [];
  
  const errors: FieldError[] = [];
  const detailsLower = details.toLowerCase();
  
  // Check for specific field mentions in the rejection details
  if (detailsLower.includes("título") || detailsLower.includes("title") || detailsLower.includes("nombre de campaña")) {
    errors.push({ field: "campaignTitle", message: "Revisar el título de la campaña", step: 1 });
  }
  if (detailsLower.includes("descripción") || detailsLower.includes("description")) {
    errors.push({ field: "description", message: "Revisar la descripción", step: 1 });
  }
  if (detailsLower.includes("autor") || detailsLower.includes("marca") || detailsLower.includes("brand")) {
    errors.push({ field: "authorName", message: "Revisar el nombre del autor/marca", step: 1 });
  }
  if (detailsLower.includes("email") || detailsLower.includes("correo")) {
    errors.push({ field: "authorEmail", message: "Revisar el email", step: 1 });
  }
  if (detailsLower.includes("fecha") || detailsLower.includes("date") || detailsLower.includes("periodo")) {
    errors.push({ field: "startDate", message: "Revisar las fechas", step: 1 });
    errors.push({ field: "endDate", message: "Revisar las fechas", step: 1 });
  }
  if (detailsLower.includes("juego") || detailsLower.includes("game") || detailsLower.includes("mini-juego")) {
    errors.push({ field: "selectedGame", message: "Revisar la selección del juego", step: 2 });
  }
  if (detailsLower.includes("video") || detailsLower.includes("youtube")) {
    errors.push({ field: "videoUrl", message: "Revisar el video promocional", step: 8 });
  }
  if (detailsLower.includes("términos") || detailsLower.includes("condiciones") || detailsLower.includes("terms")) {
    errors.push({ field: "termsAndConditions", message: "Revisar términos y condiciones", step: 4 });
  }
  if (detailsLower.includes("bonus") || detailsLower.includes("nivel de bonus")) {
    errors.push({ field: "bonusLevel", message: "Revisar el Bonus Level", step: 5 });
  }
  if (detailsLower.includes("special reward") || detailsLower.includes("premio especial") || detailsLower.includes("recompensa")) {
    errors.push({ field: "specialReward", message: "Revisar el Special Reward", step: 6 });
  }
  if (detailsLower.includes("ranking") || detailsLower.includes("top") || detailsLower.includes("posiciones")) {
    errors.push({ field: "topRanking", message: "Revisar los premios del Top Ranking", step: 7 });
  }
  if (detailsLower.includes("contenido") || detailsLower.includes("content") || detailsLower.includes("visual")) {
    // General content issue - mark description and video
    if (!errors.some(e => e.field === "description")) {
      errors.push({ field: "description", message: "Revisar el contenido", step: 1 });
    }
    if (!errors.some(e => e.field === "videoUrl")) {
      errors.push({ field: "videoUrl", message: "Revisar el contenido visual", step: 8 });
    }
  }
  
  return errors;
};

const MINI_GAMES = [
  { id: "memory", name: "Memory Match", type: "memory", plan: "GROWTH", image: "🧠" },
  { id: "runner", name: "Endless Runner", type: "runner", plan: "GROWTH", image: "🏃" },
  { id: "puzzle", name: "Puzzle Slide", type: "puzzle", plan: "GROWTH", image: "🧩" },
  { id: "quiz", name: "Trivia Quiz", type: "quiz", plan: "GROWTH", image: "❓" },
  { id: "shooter", name: "Space Shooter", type: "shooter", plan: "SCALE", image: "🚀" },
  { id: "racing", name: "Racing Pro", type: "racing", plan: "SCALE", image: "🏎️" },
  { id: "arcade", name: "Arcade Classic", type: "arcade", plan: "SCALE", image: "🕹️" },
  { id: "adventure", name: "Adventure Quest", type: "adventure", plan: "SCALE", image: "⚔️" },
];

export const CampaignEditModal = ({ 
  open, 
  onOpenChange, 
  campaign,
  onSave
}: CampaignEditModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldError[]>([]);
  
  const [campaignData, setCampaignData] = useState<Partial<CampaignData>>({
    authorName: "",
    authorEmail: "",
    campaignTitle: "",
    description: "",
    rankingType: "cumulative",
    startDate: null,
    endDate: null,
    selectedGame: null,
    videoUrl: "",
    termsAndConditions: "",
  });

  // Parse errors when campaign changes
  useEffect(() => {
    if (campaign) {
      setCampaignData({
        authorName: campaign.author || "",
        authorEmail: campaign.authorEmail || "",
        campaignTitle: campaign.title || "",
        description: campaign.description || "",
        rankingType: "cumulative",
        startDate: null,
        endDate: null,
        selectedGame: null,
        videoUrl: "",
        termsAndConditions: "",
      });
      
      const errors = parseRejectionDetails(campaign.rejectionDetails);
      setFieldErrors(errors);
      
      // Jump to first step with error if any
      if (errors.length > 0) {
        const firstErrorStep = Math.min(...errors.map(e => e.step));
        setCurrentStep(firstErrorStep);
      } else {
        setCurrentStep(1);
      }
    }
  }, [campaign]);

  const updateCampaignData = (updates: Partial<CampaignData>) => {
    setCampaignData(prev => ({ ...prev, ...updates }));
  };

  const hasErrorInField = (field: FieldWithError): boolean => {
    return fieldErrors.some(e => e.field === field);
  };

  const getFieldErrorMessage = (field: FieldWithError): string | undefined => {
    return fieldErrors.find(e => e.field === field)?.message;
  };

  const hasErrorsInStep = (stepNumber: number): boolean => {
    return fieldErrors.some(e => e.step === stepNumber);
  };

  const getStepsWithErrors = (): number[] => {
    return [...new Set(fieldErrors.map(e => e.step))];
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

  const handleNext = () => {
    if (currentStep < 8) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!campaign) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onSave(campaign.id, { 
      title: campaignData.campaignTitle || campaign.title, 
      description: campaignData.description || "" 
    });
    
    setIsSubmitting(false);
    onOpenChange(false);
    
    toast({
      title: "Campaña reenviada",
      description: "Tu campaña ha sido enviada nuevamente para revisión. Te notificaremos en 48-72 horas.",
    });
  };

  const progress = (currentStep / 8) * 100;
  const stepsWithErrors = getStepsWithErrors();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Author Name */}
            <div className="space-y-2">
              <Label htmlFor="authorName" className={hasErrorInField("authorName") ? "text-destructive" : ""}>
                Nombre del autor (marca o persona)
                {hasErrorInField("authorName") && <span className="ml-2 text-xs">⚠️ {getFieldErrorMessage("authorName")}</span>}
              </Label>
              <Input
                id="authorName"
                value={campaignData.authorName || ""}
                onChange={(e) => updateCampaignData({ authorName: e.target.value })}
                placeholder="Ej: Nike, Juan García..."
                className={`bg-background/50 ${hasErrorInField("authorName") ? "border-destructive ring-destructive/20 ring-2" : ""}`}
              />
            </div>

            {/* Author Email */}
            <div className="space-y-2">
              <Label htmlFor="authorEmail" className={hasErrorInField("authorEmail") ? "text-destructive" : ""}>
                Email del autor
                {hasErrorInField("authorEmail") && <span className="ml-2 text-xs">⚠️ {getFieldErrorMessage("authorEmail")}</span>}
              </Label>
              <Input
                id="authorEmail"
                type="email"
                value={campaignData.authorEmail || ""}
                onChange={(e) => updateCampaignData({ authorEmail: e.target.value })}
                placeholder="contacto@empresa.com"
                className={`bg-background/50 ${hasErrorInField("authorEmail") ? "border-destructive ring-destructive/20 ring-2" : ""}`}
              />
            </div>

            {/* Campaign Title */}
            <div className="space-y-2">
              <Label htmlFor="campaignTitle" className={hasErrorInField("campaignTitle") ? "text-destructive" : ""}>
                Título de la campaña
                {hasErrorInField("campaignTitle") && <span className="ml-2 text-xs">⚠️ {getFieldErrorMessage("campaignTitle")}</span>}
              </Label>
              <Input
                id="campaignTitle"
                value={campaignData.campaignTitle || ""}
                onChange={(e) => updateCampaignData({ campaignTitle: e.target.value })}
                placeholder="Ej: Summer Challenge 2024"
                className={`bg-background/50 ${hasErrorInField("campaignTitle") ? "border-destructive ring-destructive/20 ring-2" : ""}`}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className={hasErrorInField("description") ? "text-destructive" : ""}>
                Descripción breve
                {hasErrorInField("description") && <span className="ml-2 text-xs">⚠️ {getFieldErrorMessage("description")}</span>}
              </Label>
              <Textarea
                id="description"
                value={campaignData.description || ""}
                onChange={(e) => updateCampaignData({ description: e.target.value })}
                placeholder="Describe tu campaña en pocas palabras..."
                className={`bg-background/50 resize-none ${hasErrorInField("description") ? "border-destructive ring-destructive/20 ring-2" : ""}`}
                rows={3}
                maxLength={300}
              />
              <p className="text-xs text-muted-foreground text-right">
                {(campaignData.description || "").length}/300 caracteres
              </p>
            </div>

            {/* Ranking Type */}
            <div className="space-y-3">
              <Label>Tipo de ranking</Label>
              <RadioGroup
                value={campaignData.rankingType || "cumulative"}
                onValueChange={(value: "cumulative" | "top_score") => updateCampaignData({ rankingType: value })}
                className="grid grid-cols-2 gap-4"
              >
                <div className="flex items-center space-x-2 p-4 rounded-lg border border-border hover:border-primary/50 cursor-pointer transition-colors">
                  <RadioGroupItem value="cumulative" id="edit-cumulative" />
                  <Label htmlFor="edit-cumulative" className="cursor-pointer flex-1">
                    <div className="font-medium">Acumulativo</div>
                    <div className="text-xs text-muted-foreground">Suma de todas las puntuaciones</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-4 rounded-lg border border-border hover:border-primary/50 cursor-pointer transition-colors">
                  <RadioGroupItem value="top_score" id="edit-top_score" />
                  <Label htmlFor="edit-top_score" className="cursor-pointer flex-1">
                    <div className="font-medium">Top Score</div>
                    <div className="text-xs text-muted-foreground">Mejor puntuación individual</div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className={hasErrorInField("startDate") ? "text-destructive" : ""}>
                  Fecha de inicio
                  {hasErrorInField("startDate") && <span className="ml-1 text-xs">⚠️</span>}
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className={`w-full justify-start text-left font-normal ${hasErrorInField("startDate") ? "border-destructive" : ""}`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {campaignData.startDate ? format(campaignData.startDate, "PPP", { locale: es }) : "Seleccionar fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={campaignData.startDate || undefined}
                      onSelect={(date) => updateCampaignData({ startDate: date || null })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label className={hasErrorInField("endDate") ? "text-destructive" : ""}>
                  Fecha de finalización
                  {hasErrorInField("endDate") && <span className="ml-1 text-xs">⚠️</span>}
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className={`w-full justify-start text-left font-normal ${hasErrorInField("endDate") ? "border-destructive" : ""}`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {campaignData.endDate ? format(campaignData.endDate, "PPP", { locale: es }) : "Seleccionar fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={campaignData.endDate || undefined}
                      onSelect={(date) => updateCampaignData({ endDate: date || null })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            {hasErrorInField("selectedGame") && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                <p className="text-sm text-destructive flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  {getFieldErrorMessage("selectedGame")}
                </p>
              </div>
            )}
            <p className="text-muted-foreground">
              Selecciona el mini-juego para tu campaña.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {MINI_GAMES.map((game) => {
                const isSelected = campaignData.selectedGame === game.id;
                return (
                  <Card
                    key={game.id}
                    className={`cursor-pointer transition-all hover:scale-105 relative ${
                      isSelected
                        ? "ring-2 ring-primary border-primary"
                        : hasErrorInField("selectedGame")
                          ? "border-destructive/50"
                          : "hover:border-primary/50"
                    }`}
                    onClick={() => updateCampaignData({ selectedGame: game.id })}
                  >
                    <CardContent className="p-4 text-center">
                      {isSelected && (
                        <div className="absolute top-2 right-2">
                          <Check className="h-5 w-5 text-primary" />
                        </div>
                      )}
                      <div className="text-4xl mb-2">{game.image}</div>
                      <h3 className="font-medium text-sm">{game.name}</h3>
                      <p className="text-xs text-muted-foreground capitalize">{game.type}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Los add-ons de la campaña original se mantienen. Este paso es solo informativo.
            </p>
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <p className="text-sm text-muted-foreground">
                Los add-ons no pueden ser modificados en una edición. Si necesitas cambiarlos, contacta con soporte.
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="terms" className={`flex items-center gap-2 text-base ${hasErrorInField("termsAndConditions") ? "text-destructive" : ""}`}>
                Términos y condiciones (opcional)
                {hasErrorInField("termsAndConditions") && <span className="text-xs">⚠️ {getFieldErrorMessage("termsAndConditions")}</span>}
              </Label>
              <Textarea
                id="terms"
                placeholder="Escribe los términos y condiciones de tu campaña..."
                value={campaignData.termsAndConditions || ""}
                onChange={(e) => updateCampaignData({ termsAndConditions: e.target.value })}
                className={`bg-background/50 resize-none ${hasErrorInField("termsAndConditions") ? "border-destructive ring-destructive/20 ring-2" : ""}`}
                rows={6}
                maxLength={5000}
              />
              <p className="text-xs text-muted-foreground text-right">
                {(campaignData.termsAndConditions || "").length}/5000 caracteres
              </p>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            {hasErrorInField("bonusLevel") && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                <p className="text-sm text-destructive flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  {getFieldErrorMessage("bonusLevel")}
                </p>
              </div>
            )}
            <p className="text-muted-foreground">
              Configura el Bonus Level de tu campaña. Revisa que los premios cumplan con las políticas.
            </p>
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <p className="text-sm text-muted-foreground">
                La configuración del Bonus Level se conserva. Contacta con soporte para modificaciones mayores.
              </p>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            {hasErrorInField("specialReward") && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                <p className="text-sm text-destructive flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  {getFieldErrorMessage("specialReward")}
                </p>
              </div>
            )}
            <p className="text-muted-foreground">
              Configura el Special Reward de tu campaña. Revisa que los premios cumplan con las políticas.
            </p>
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <p className="text-sm text-muted-foreground">
                La configuración del Special Reward se conserva. Contacta con soporte para modificaciones mayores.
              </p>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-4">
            {hasErrorInField("topRanking") && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                <p className="text-sm text-destructive flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  {getFieldErrorMessage("topRanking")}
                </p>
              </div>
            )}
            <p className="text-muted-foreground">
              Configura los premios del Top Ranking. Revisa que los premios cumplan con las políticas.
            </p>
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <p className="text-sm text-muted-foreground">
                La configuración del Top Ranking se conserva. Contacta con soporte para modificaciones mayores.
              </p>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            {hasErrorInField("videoUrl") && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                <p className="text-sm text-destructive flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  {getFieldErrorMessage("videoUrl")}
                </p>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="videoUrl" className={hasErrorInField("videoUrl") ? "text-destructive" : ""}>
                Código embebido de YouTube (opcional)
              </Label>
              <Textarea
                id="videoUrl"
                value={campaignData.videoUrl || ""}
                onChange={(e) => updateCampaignData({ videoUrl: e.target.value })}
                placeholder={'<iframe width="560" height="315" src="https://www.youtube.com/embed/VIDEO_ID" ...></iframe>'}
                className={`bg-background/50 font-mono text-sm ${hasErrorInField("videoUrl") ? "border-destructive ring-destructive/20 ring-2" : ""}`}
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                Pega el código de inserción completo de YouTube.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!campaign) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Editar y Reenviar Campaña
          </DialogTitle>
          <DialogDescription>
            Corrige los campos marcados y reenvía para revisión
          </DialogDescription>
        </DialogHeader>

        {/* Rejection reason banner */}
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-destructive">Motivo del rechazo:</span>
                  <Badge variant="outline" className="text-destructive border-destructive/50">
                    {getRejectionLabel(campaign.rejectionReason)}
                  </Badge>
                </div>
                {campaign.rejectionDetails && (
                  <p className="text-sm text-muted-foreground italic">
                    "{campaign.rejectionDetails}"
                  </p>
                )}
                {stepsWithErrors.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="text-xs text-muted-foreground">Pasos con errores:</span>
                    {stepsWithErrors.map(step => (
                      <Badge 
                        key={step} 
                        variant="outline" 
                        className="text-xs cursor-pointer hover:bg-destructive/10"
                        onClick={() => setCurrentStep(step)}
                      >
                        Paso {step}: {STEPS[step - 1].title}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Bar with step indicators */}
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-primary">
              Paso {currentStep}: {STEPS[currentStep - 1].title}
            </span>
            <span className="text-xs text-muted-foreground">{currentStep}/8</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            {STEPS.map((step) => (
              <button
                key={step.number}
                onClick={() => setCurrentStep(step.number)}
                className={`relative ${currentStep >= step.number ? "text-primary" : ""} ${
                  hasErrorsInStep(step.number) ? "text-destructive font-bold" : ""
                }`}
              >
                {step.number}
                {hasErrorsInStep(step.number) && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto py-4 min-h-[300px]">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1 || isSubmitting}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Atrás
          </Button>
          
          <div className="flex gap-2">
            {currentStep < 8 ? (
              <Button onClick={handleNext}>
                Continuar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting}
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
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
