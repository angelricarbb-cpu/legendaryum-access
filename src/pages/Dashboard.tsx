import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CreditCard, User, LogOut, Settings, BarChart3, Sparkles, ArrowUp, ArrowDown, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const allPlans = [
  { name: "FREE", price: "Gratis", priceValue: 0 },
  { name: "ELITE", price: "$9.99/mes", priceValue: 9.99 },
  { name: "GROWTH", price: "$99.99", priceValue: 99.99 },
  { name: "SCALE", price: "$199.99", priceValue: 199.99 },
  { name: "ENTERPRISE", price: "Contacto", priceValue: 999 },
];

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Mock user data - this would come from the database
  const [user, setUser] = useState({
    name: "Usuario Demo",
    email: "demo@legendaryum.com",
    plan: "ELITE",
    status: "active",
    nextBilling: "15 Feb 2024",
  });

  const [showManageModal, setShowManageModal] = useState(false);
  const [selectedNewPlan, setSelectedNewPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "FREE": return "bg-plan-free";
      case "ELITE": return "bg-plan-elite";
      case "GROWTH": return "bg-plan-growth";
      case "SCALE": return "bg-plan-scale";
      case "ENTERPRISE": return "bg-plan-enterprise";
      default: return "bg-primary";
    }
  };

  const getPlanFeatures = (plan: string) => {
    switch (plan) {
      case "FREE":
        return ["Acceso básico", "Rankings gratuitos", "Misiones básicas"];
      case "ELITE":
        return ["Campañas premium", "Early access", "Ventajas exclusivas"];
      case "GROWTH":
        return ["1 campaña mensual", "10K participantes", "Métricas macro"];
      case "SCALE":
        return ["3 campañas mensuales", "20K participantes", "Métricas completas"];
      case "ENTERPRISE":
        return ["Solución personalizada", "Campañas ilimitadas", "Soporte dedicado"];
      default:
        return [];
    }
  };

  const getPlanIndex = (planName: string) => allPlans.findIndex(p => p.name === planName);
  
  const isUpgrade = (targetPlan: string) => {
    return getPlanIndex(targetPlan) > getPlanIndex(user.plan);
  };

  const handleChangePlan = (planName: string) => {
    if (planName === "ENTERPRISE") {
      window.open("https://www.legendaryum.com/contact", "_blank");
      return;
    }
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
        setUser(prev => ({ ...prev, plan: selectedNewPlan }));
        setShowSuccess(false);
        setSelectedNewPlan(null);
        setShowManageModal(false);
      }, 2000);
    }, 2000);
  };

  const currentPlanData = allPlans.find(p => p.name === user.plan);
  const selectedPlanData = allPlans.find(p => p.name === selectedNewPlan);

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
              <Badge className={getPlanColor(user.plan)}>{user.plan}</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">
                {currentPlanData?.price}
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                {user.plan !== "FREE" ? (
                  <>Próxima facturación: {user.nextBilling}</>
                ) : (
                  "Plan gratuito - sin cargos"
                )}
              </p>
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
                {getPlanFeatures(user.plan).map((feature, index) => (
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
          {user.plan !== "ENTERPRISE" && (
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
              const isCurrent = plan.name === user.plan;
              const isUpgradeOption = isUpgrade(plan.name);
              
              return (
                <div 
                  key={plan.name}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                    isCurrent 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/50 cursor-pointer"
                  }`}
                  onClick={() => !isCurrent && handleChangePlan(plan.name)}
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
                      </div>
                      <div className="text-sm text-muted-foreground">{plan.price}</div>
                    </div>
                  </div>
                  
                  {!isCurrent && (
                    <Button size="sm" variant={isUpgradeOption ? "default" : "outline"}>
                      {isUpgradeOption ? (
                        <>
                          <ArrowUp className="mr-1 h-3 w-3" />
                          Upgrade
                        </>
                      ) : (
                        <>
                          <ArrowDown className="mr-1 h-3 w-3" />
                          Downgrade
                        </>
                      )}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>

          {user.plan !== "FREE" && (
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
              {isUpgrade(selectedNewPlan || "") ? "Confirmar Upgrade" : "Confirmar Cambio"}
            </DialogTitle>
            <DialogDescription>
              {isUpgrade(selectedNewPlan || "") 
                ? `Estás a punto de mejorar a ${selectedNewPlan}`
                : `Estás a punto de cambiar a ${selectedNewPlan}`
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
              <div>
                <div className="text-sm text-muted-foreground">De</div>
                <div className="font-medium">{user.plan}</div>
              </div>
              <ArrowDown className="h-5 w-5 text-muted-foreground rotate-[-90deg]" />
              <div className="text-right">
                <div className="text-sm text-muted-foreground">A</div>
                <div className="font-medium">{selectedNewPlan}</div>
              </div>
            </div>

            {selectedNewPlan !== "FREE" && (
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
            <h3 className="text-xl font-bold mb-2">¡Cambio Exitoso!</h3>
            <p className="text-muted-foreground">
              Tu plan ha sido actualizado a {selectedNewPlan}.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
