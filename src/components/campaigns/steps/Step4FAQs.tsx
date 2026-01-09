import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, HelpCircle, FileText } from "lucide-react";
import { CampaignData } from "../CampaignWizard";

interface Step4Props {
  data: CampaignData;
  onUpdate: (updates: Partial<CampaignData>) => void;
}

export const Step4FAQs = ({ data, onUpdate }: Step4Props) => {
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");

  const addFAQ = () => {
    if (newQuestion.trim() && newAnswer.trim()) {
      onUpdate({
        faqs: [...data.faqs, { question: newQuestion, answer: newAnswer }]
      });
      setNewQuestion("");
      setNewAnswer("");
    }
  };

  const removeFAQ = (index: number) => {
    onUpdate({
      faqs: data.faqs.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Configura las preguntas frecuentes y términos de tu campaña para reducir consultas de soporte.
      </p>

      {/* FAQs */}
      <div className="space-y-4">
        <Label className="flex items-center gap-2 text-base">
          <HelpCircle className="h-5 w-5" />
          Preguntas frecuentes (opcional)
        </Label>

        {/* Existing FAQs */}
        {data.faqs.length > 0 && (
          <div className="space-y-3">
            {data.faqs.map((faq, index) => (
              <Card key={index}>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{faq.question}</p>
                      <p className="text-sm text-muted-foreground mt-1">{faq.answer}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => removeFAQ(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add New FAQ */}
        <Card className="border-dashed">
          <CardContent className="pt-4 space-y-3">
            <Input
              placeholder="Escribe la pregunta..."
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              className="bg-background/50"
            />
            <Textarea
              placeholder="Escribe la respuesta..."
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              className="bg-background/50 resize-none"
              rows={2}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={addFAQ}
              disabled={!newQuestion.trim() || !newAnswer.trim()}
            >
              <Plus className="h-4 w-4 mr-2" />
              Añadir FAQ
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Terms and Conditions */}
      <div className="space-y-3">
        <Label htmlFor="terms" className="flex items-center gap-2 text-base">
          <FileText className="h-5 w-5" />
          Términos y condiciones (opcional)
        </Label>
        <Textarea
          id="terms"
          placeholder="Escribe los términos y condiciones de tu campaña..."
          value={data.termsAndConditions}
          onChange={(e) => onUpdate({ termsAndConditions: e.target.value })}
          className="bg-background/50 resize-none"
          rows={6}
          maxLength={5000}
        />
        <p className="text-xs text-muted-foreground text-right">
          {data.termsAndConditions.length}/5000 caracteres
        </p>
      </div>
    </div>
  );
};
