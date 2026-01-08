import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  name: string;
  description: string;
  price: string;
  period?: string;
  features: string[];
  buttonText: string;
  popular?: boolean;
  colorClass: string;
  onSelect: () => void;
  disabled?: boolean;
}

const PricingCard = ({
  name,
  description,
  price,
  period = "/mes",
  features,
  buttonText,
  popular = false,
  colorClass,
  onSelect,
  disabled = false,
}: PricingCardProps) => {
  return (
    <Card className={cn(
      "relative flex flex-col transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 bg-card border-border",
      popular && "border-2 border-primary shadow-lg shadow-primary/10 scale-105"
    )}>
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
            Más Popular
          </span>
        </div>
      )}
      
      <CardHeader className="text-center pb-2">
        <div className={cn("w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center", colorClass)}>
          <span className="text-xl font-bold text-white">{name.charAt(0)}</span>
        </div>
        <CardTitle className="text-xl">{name}</CardTitle>
        <CardDescription className="text-sm min-h-[40px]">{description}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="text-center mb-6">
          <span className="text-4xl font-bold">{price}</span>
          {price !== "Gratis" && price !== "Contacto" && period && (
            <span className="text-muted-foreground">{period}</span>
          )}
        </div>

        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span className="text-sm text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Button 
          className={cn(
            "w-full",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          variant={popular ? "default" : "outline"}
          onClick={onSelect}
          disabled={disabled}
        >
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PricingCard;
