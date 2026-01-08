import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CreditCard, User, LogOut, Settings, BarChart3, Sparkles, ArrowUp, ArrowDown, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const allPlans = [
  { name: "FREE", price: "Gratis", priceValue: 0 },
  { name: "PREMIUM", price: "$9.99/mes", priceValue: 9.99 },
  { name: "GROWTH", price: "$99.99/mes", priceValue: 99.99 },
  { name: "SCALE", price: "$199.99/mes", priceValue: 199.99 },
];

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Mock user data - this would come from the database
  const [user, setUser] = useState({
    name: "Usuario Demo",
    email: "demo@legendaryum.com",
    currentPlan: "PREMIUM",
    subscriptionStartDate: new Date("2024-01-15"),
    subscriptionEndDate: new Date("2024-02-14"),
    scheduledPlan: null as string | null,
    subscriptionStatus: "active" as "active" | "canceled" | "scheduled_downgrade",
  });

  const [showManageModal, setShowManageModal] = useState(false);
  const [selectedNewPlan, setSelectedNewPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "FREE": return "bg-plan-free";
      case "PREMIUM": return "bg-plan-premium";
      case "GROWTH": return "bg-plan-growth";
      case "SCALE": return "bg-plan-scale";
      default: return "bg-primary";
    }
  };

  const getPlanFeatures = (plan: string) => {
    switch (plan) {
      case "FREE":
        return ["Acceso básico", "Rankings gratuitos", "Misiones básicas"];
      case "PREMIUM":
        return ["Campañas premium", "Early access", "Ventajas exclusivas"];
      case "GROWTH":
        return ["1 campaña mensual", "10K participantes", "Métricas macro"];
      case "SCALE":
        return ["3 campañas mensuales", "20K participantes", "Métricas completas"];
      default:
        return [];
    }
  };

  const getPlanIndex = (planName: string) => allPlans.findIndex(p => p.name === planName);
  
  const isUpgrade = (targetPlan: string) => {
    return getPlanIndex(targetPlan) > getPlanIndex(user.currentPlan);
  };

  const isDowngrade = (targetPlan: string) => {
    return getPlanIndex(targetPlan) < getPlanIndex(user.currentPlan);
  };

  const isCancellation = (targetPlan: string) => {
    return targetPlan === "FREE" && user.currentPlan !== "FREE";
  };

  const getDaysRemaining = () => {
    const today = new Date();
    const endDate = user.subscriptionEndDate;
    const diffTime = endDate.getTime() - today.getTime();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  const calculateProration = (newPlanPrice: number) => {
    const currentPlanData = allPlans.find(p => p.name === user.currentPlan);
    if (!currentPlanData) return newPlanPrice;
    
    const daysRemaining = getDaysRemaining();
    const dailyRate = currentPlanData.priceValue / 30;
    const credit = dailyRate * daysRemaining;
    return Math.max(0, newPlanPrice - credit);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handleChangePlan = (planName: string) => {
    setSelectedNewPlan(planName);
  };

  const confirmPlanChange = () => {
    if (!selectedNewPlan) return;
    
    setIsProcessing(true);
    
    // Simulate Stripe processing
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
      
      setTimeout(() => {
        if (isUpgrade(selectedNewPlan)) {
          // Upgrade: immediate, new 30-day period starts
          setUser(prev => ({ 
            ...prev, 
            currentPlan: selectedNewPlan,
            subscriptionStartDate: new Date(),
            subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            scheduledPlan: null,
            subscriptionStatus: "active"
          }));
        } else if (isCancellation(selectedNewPlan)) {
          // Cancellation: stays active until end of period
          setUser(prev => ({ 
            ...prev, 
            scheduledPlan: "FREE",
            subscriptionStatus: "canceled"
          }));
        } else {
          // Downgrade: scheduled for end of period
          setUser(prev => ({ 
            ...prev, 
            scheduledPlan: selectedNewPlan,
            subscriptionStatus: "scheduled_downgrade"
          }));
        }
        setShowSuccess(false);
        setSelectedNewPlan(null);
        setShowManageModal(false);
      }, 2000);
    }, 2000);
  };

  const currentPlanData = allPlans.find(p => p.name === user.currentPlan);
  const selectedPlanData = allPlans.find(p => p.name === selectedNewPlan);

  const getActionMessage = () => {
    if (!selectedNewPlan) return "";
    
    if (isUpgrade(selectedNewPlan)) {
      const prorated = calculateProration(selectedPlanData?.priceValue || 0);
      return `Tu nuevo plan se activará de inmediato. Se descontará el tiempo no utilizado de tu plan actual ($${(currentPlanData?.priceValue || 0) - (prorated - (selectedPlanData?.priceValue || 0))}) y comenzará un nuevo período de 30 días. Pagarás $${prorated.toFixed(2)} ahora.`;
    }
    
    if (isCancellation(selectedNewPlan)) {
      return `Tu plan permanecerá activo hasta el ${formatDate(user.subscriptionEndDate)} (${getDaysRemaining()} días restantes). Luego pasarás al plan FREE automáticamente.`;
    }
    
    // Downgrade
    return `El cambio de plan se aplicará al finalizar tu período actual el ${formatDate(user.subscriptionEndDate)} (${getDaysRemaining()} días restantes). Hasta entonces, mantendrás los beneficios de tu plan vigente.`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-lg font-bold text-primary-foreground">L</span>
            </div>
            <span className="text-xl font-semibold">Legendaryum</span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">{user.email}</span>
            <Button variant="ghost" size="icon" asChild>
              <Link to="/">
                <LogOut className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Hola, {user.name.split(" ")[0]} 👋</h1>
          <p className="text-muted-foreground">Gestiona tu suscripción y perfil desde aquí.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Current Plan */}
          <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Tu Plan</CardTitle>
              <div className="flex items-center gap-2">
                <Badge className={getPlanColor(user.currentPlan)}>{user.currentPlan}</Badge>
                {user.subscriptionStatus === "scheduled_downgrade" && user.scheduledPlan && (
                  <Badge variant="outline" className="text-xs">→ {user.scheduledPlan}</Badge>
                )}
                {user.subscriptionStatus === "canceled" && (
                  <Badge variant="destructive" className="text-xs">Cancelado</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">
                {currentPlanData?.price}
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                {user.currentPlan !== "FREE" ? (
                  <>Válido hasta: {formatDate(user.subscriptionEndDate)}</>
                ) : (
                  "Plan gratuito - sin cargos"
                )}
              </p>
              {user.subscriptionStatus === "scheduled_downgrade" && user.scheduledPlan && (
                <p className="text-xs text-amber-500 mb-2">
                  Cambio a {user.scheduledPlan} programado para {formatDate(user.subscriptionEndDate)}
                </p>
              )}
              {user.subscriptionStatus === "canceled" && (
                <p className="text-xs text-red-500 mb-2">
                  Tu plan se cancelará el {formatDate(user.subscriptionEndDate)}
                </p>
              )}
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => setShowManageModal(true)}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Gestionar Suscripción
              </Button>
            </CardContent>
          </Card>

          {/* Plan Features */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Beneficios Activos</CardTitle>
              <Sparkles className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {getPlanFeatures(user.currentPlan).map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Estadísticas</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">Campañas participadas</p>
                </div>
                <div>
                  <div className="text-2xl font-bold">#45</div>
                  <p className="text-xs text-muted-foreground">Posición en ranking global</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
              <CardDescription>Explora todo lo que puedes hacer en Legendaryum.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                  <User className="h-5 w-5" />
                  <span>Editar Perfil</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                  <Sparkles className="h-5 w-5" />
                  <span>Ver Campañas</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Rankings</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                  <Settings className="h-5 w-5" />
                  <span>Configuración</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Upgrade CTA */}
          {user.currentPlan !== "SCALE" && user.subscriptionStatus === "active" && (
            <Card className="md:col-span-2 lg:col-span-3 bg-gradient-to-r from-primary/20 to-accent/20 border-primary/30">
              <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
                <div>
                  <h3 className="text-lg font-semibold">¿Necesitas más poder?</h3>
                  <p className="text-muted-foreground">
                    Mejora tu plan para desbloquear más beneficios y campañas.
                  </p>
                </div>
                <Button onClick={() => setShowManageModal(true)}>
                  Ver Planes
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Manage Subscription Modal */}
      <Dialog open={showManageModal && !selectedNewPlan} onOpenChange={setShowManageModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Gestionar Suscripción</DialogTitle>
            <DialogDescription>
              Cambia tu plan o cancela tu suscripción.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
            {allPlans.map((plan) => {
              const isCurrent = plan.name === user.currentPlan;
              const isUpgradeOption = isUpgrade(plan.name);
              const isDowngradeOption = isDowngrade(plan.name);
              const isScheduled = user.scheduledPlan === plan.name;
              
              return (
                <div 
                  key={plan.name}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                    isCurrent 
                      ? "border-primary bg-primary/5" 
                      : isScheduled
                        ? "border-amber-500 bg-amber-500/5"
                        : "border-border hover:border-primary/50 cursor-pointer"
                  }`}
                  onClick={() => !isCurrent && !isScheduled && handleChangePlan(plan.name)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getPlanColor(plan.name)}`}>
                      <span className="text-white font-bold">{plan.name.charAt(0)}</span>
                    </div>
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {plan.name}
                        {isCurrent && (
                          <Badge variant="outline" className="text-xs">Actual</Badge>
                        )}
                        {isScheduled && (
                          <Badge variant="outline" className="text-xs text-amber-500 border-amber-500">Programado</Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">{plan.price}</div>
                    </div>
                  </div>
                  
                  {!isCurrent && !isScheduled && (
                    <Button size="sm" variant={isUpgradeOption ? "default" : "outline"}>
                      {isUpgradeOption ? (
                        <>
                          <ArrowUp className="mr-1 h-3 w-3" />
                          Upgrade
                        </>
                      ) : isDowngradeOption && plan.name !== "FREE" ? (
                        <>
                          <ArrowDown className="mr-1 h-3 w-3" />
                          Downgrade
                        </>
                      ) : null}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>

          {user.currentPlan !== "FREE" && user.subscriptionStatus === "active" && (
            <div className="border-t border-border pt-4">
              <Button 
                variant="ghost" 
                className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => handleChangePlan("FREE")}
              >
                Cancelar Suscripción
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirm Plan Change Modal */}
      <Dialog open={!!selectedNewPlan && !showSuccess} onOpenChange={() => setSelectedNewPlan(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              {isUpgrade(selectedNewPlan || "") 
                ? "Confirmar Upgrade" 
                : isCancellation(selectedNewPlan || "")
                  ? "Cancelar Suscripción"
                  : "Confirmar Downgrade"}
            </DialogTitle>
            <DialogDescription>
              {isUpgrade(selectedNewPlan || "") 
                ? `Estás a punto de mejorar a ${selectedNewPlan}`
                : isCancellation(selectedNewPlan || "")
                  ? "Estás a punto de cancelar tu suscripción"
                  : `Estás a punto de cambiar a ${selectedNewPlan}`
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
              <div>
                <div className="text-sm text-muted-foreground">De</div>
                <div className="font-medium">{user.currentPlan}</div>
              </div>
              <ArrowDown className="h-5 w-5 text-muted-foreground rotate-[-90deg]" />
              <div className="text-right">
                <div className="text-sm text-muted-foreground">A</div>
                <div className="font-medium">{selectedNewPlan}</div>
              </div>
            </div>

            {/* UX Message based on action type */}
            <div className={`p-4 rounded-lg border ${
              isUpgrade(selectedNewPlan || "") 
                ? "bg-green-500/10 border-green-500/30 text-green-400" 
                : isCancellation(selectedNewPlan || "")
                  ? "bg-red-500/10 border-red-500/30 text-red-400"
                  : "bg-amber-500/10 border-amber-500/30 text-amber-400"
            }`}>
              <p className="text-sm">{getActionMessage()}</p>
            </div>

            {selectedNewPlan !== "FREE" && isUpgrade(selectedNewPlan || "") && (
              <div className="bg-secondary/30 border border-border rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <div className="w-8 h-5 bg-blue-600 rounded" />
                    <div className="w-8 h-5 bg-red-500 rounded" />
                  </div>
                  <span className="text-sm text-muted-foreground">•••• •••• •••• 4242</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Se procesará con tu método de pago actual
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setSelectedNewPlan(null)}
                disabled={isProcessing}
              >
                Cancelar
              </Button>
              <Button 
                className="flex-1"
                onClick={confirmPlanChange}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Procesando...
                  </>
                ) : isUpgrade(selectedNewPlan || "") ? (
                  <>Pagar ${calculateProration(selectedPlanData?.priceValue || 0).toFixed(2)}</>
                ) : (
                  <>Confirmar</>
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
            <h3 className="text-xl font-bold mb-2">
              {isUpgrade(selectedNewPlan || "") 
                ? "¡Upgrade Exitoso!" 
                : isCancellation(selectedNewPlan || "")
                  ? "Cancelación Programada"
                  : "Downgrade Programado"}
            </h3>
            <p className="text-muted-foreground">
              {isUpgrade(selectedNewPlan || "") 
                ? `Tu plan ${selectedNewPlan} está activo. Comienza un nuevo período de 30 días.`
                : isCancellation(selectedNewPlan || "")
                  ? `Tu plan permanecerá activo hasta el final del período actual.`
                  : `El cambio a ${selectedNewPlan} se aplicará al final de tu período actual.`}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
