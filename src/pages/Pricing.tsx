import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PricingCard from "@/components/pricing/PricingCard";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, CreditCard, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import useRequireAuth from "@/hooks/useRequireAuth";

const plans = [
  {
    name: "FREE",
    description: "Ideal para nuevos usuarios y participantes ocasionales",
    price: "Gratis",
    period: "",
    features: [
      "Acceso básico a la plataforma",
      "Participación en rankings y misiones gratuitas",
      "Entrada sin fricción al ecosistema",
    ],
    buttonText: "Comenzar Gratis",
    colorClass: "bg-plan-free",
    priceValue: 0,
  },
  {
    name: "PREMIUM",
    description: "Ideal para quienes buscan ventaja real y mejores beneficios",
    price: "$9.99",
    period: "/mes",
    features: [
      "Todas las funcionalidades de FREE",
      "Acceso a campañas premium con mayores premios",
      "Early access a campañas activas",
      "Información anticipada sobre nuevos rankings",
      "Ventajas exclusivas",
      "Juegas antes y ganas más",
    ],
    buttonText: "Suscribirse",
    popular: true,
    colorClass: "bg-plan-premium",
    priceValue: 9.99,
  },
  {
    name: "GROWTH",
    description: "Ideal para marcas pequeñas, startups y creadores de contenidos",
    price: "$99.99",
    period: "",
    features: [
      "Todas las funcionalidades de PREMIUM",
      "Creación de campañas gamificadas propias",
      "Hasta 1 campaña mensual",
      "Hasta 10.000 participantes únicos por campaña",
      "Catálogo de mini-juegos estándar",
      "Acceso a métricas macro en tiempo real",
      "Descarga de reportes finales de rendimiento",
    ],
    buttonText: "Suscribirse",
    colorClass: "bg-plan-growth",
    priceValue: 99.99,
  },
  {
    name: "SCALE",
    description: "Ideal para marcas y equipos de marketing que buscan mayores resultados",
    price: "$199.99",
    period: "",
    features: [
      "Todas las funcionalidades de GROWTH",
      "Hasta 3 campañas mensuales",
      "Hasta 20.000 participantes únicos por campaña",
      "Catálogo de mini-juegos premium",
      "Acceso a métricas macro + micro en tiempo real",
      "Descarga de datos para CRM y acciones comerciales",
    ],
    buttonText: "Suscribirse",
    colorClass: "bg-plan-scale",
    priceValue: 199.99,
  },
  {
    name: "ENTERPRISE",
    description: "Ideal para grandes empresas, instituciones y corporaciones",
    price: "Contacto",
    period: "",
    features: [
      "Mini game y solución personalizada",
      "Campañas, volúmenes y features a medida",
      "Integraciones avanzadas y soporte dedicado",
      "Condiciones comerciales y operativas flexibles",
      "Control total y experiencia a medida",
    ],
    buttonText: "Contactar",
    colorClass: "bg-plan-enterprise",
    priceValue: 0,
  },
];

const Pricing = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user, setReturnUrl } = useAuth();
  const { getUserPlan, redirectToAuthWithReturn } = useRequireAuth();
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Get current plan from auth context
  const currentPlan = getUserPlan().toUpperCase();

  const handleSelectPlan = (plan: typeof plans[0]) => {
    // Require login for paid plans
    if (plan.name !== "FREE" && !isLoggedIn) {
      redirectToAuthWithReturn("/pricing");
      return;
    }
    if (plan.name === "FREE") {
      navigate("/dashboard");
      return;
    }
    
    if (plan.name === "ENTERPRISE") {
      // Open contact form or redirect to contact page
      window.open("https://www.legendaryum.com/contact", "_blank");
      return;
    }

    // Show Stripe simulation modal
    setSelectedPlan(plan);
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    
    // Simulate Stripe payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
      
      // Redirect to dashboard after success
      setTimeout(() => {
        setShowSuccess(false);
        setSelectedPlan(null);
        navigate("/dashboard");
      }, 2000);
    }, 2000);
  };

  const isCurrentPlan = (planName: string) => currentPlan === planName;
  const isUpgrade = (planName: string) => {
    const planOrder = ["FREE", "PREMIUM", "GROWTH", "SCALE", "ENTERPRISE"];
    return planOrder.indexOf(planName) > planOrder.indexOf(currentPlan);
  };
  const isDowngrade = (planName: string) => {
    const planOrder = ["FREE", "PREMIUM", "GROWTH", "SCALE", "ENTERPRISE"];
    return planOrder.indexOf(planName) < planOrder.indexOf(currentPlan) && planName !== "FREE";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        isLoggedIn={isLoggedIn} 
        user={user ? { name: user.name, username: user.username, avatar: user.avatar } : undefined} 
      />
      
      <main className="flex-1 py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Elige tu plan
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Desbloquea todo el potencial de Legendaryum con el plan que mejor se adapte a ti.
            </p>
            {isLoggedIn && (
              <p className="mt-4 text-sm text-muted-foreground">
                Tu plan actual: <span className="text-primary font-semibold">{currentPlan}</span>
              </p>
            )}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
            {plans.map((plan) => (
              <PricingCard
                key={plan.name}
                {...plan}
                buttonText={
                  isCurrentPlan(plan.name) 
                    ? "Plan Actual" 
                    : isUpgrade(plan.name) 
                      ? "Upgrade" 
                      : isDowngrade(plan.name)
                        ? "Downgrade"
                        : plan.buttonText
                }
                onSelect={() => handleSelectPlan(plan)}
                disabled={isCurrentPlan(plan.name)}
              />
            ))}
          </div>
        </div>
      </main>

      <Footer />

      {/* Stripe Payment Simulation Modal */}
      <Dialog open={!!selectedPlan && !showSuccess} onOpenChange={() => setSelectedPlan(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Confirmar Suscripción
            </DialogTitle>
            <DialogDescription>
              Estás a punto de suscribirte al plan {selectedPlan?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="bg-secondary/50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{selectedPlan?.name}</span>
                <span className="text-xl font-bold">{selectedPlan?.price}</span>
              </div>
              <p className="text-sm text-muted-foreground">{selectedPlan?.description}</p>
            </div>

            {/* Simulated card input */}
            <div className="space-y-4">
              <div className="bg-secondary/30 border border-border rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <div className="w-8 h-5 bg-blue-600 rounded" />
                    <div className="w-8 h-5 bg-red-500 rounded" />
                    <div className="w-8 h-5 bg-yellow-500 rounded" />
                  </div>
                  <span className="text-sm text-muted-foreground">•••• •••• •••• 4242</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Tarjeta de prueba de Stripe
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setSelectedPlan(null)}
                disabled={isProcessing}
              >
                Cancelar
              </Button>
              <Button 
                className="flex-1"
                onClick={handleConfirmPayment}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>Pagar {selectedPlan?.price}</>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={showSuccess} onOpenChange={() => setShowSuccess(false)}>
        <DialogContent className="sm:max-w-md text-center">
          <div className="py-8">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">¡Pago Exitoso!</h3>
            <p className="text-muted-foreground">
              Tu suscripción a {selectedPlan?.name} está activa. Redirigiendo al dashboard...
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Pricing;
