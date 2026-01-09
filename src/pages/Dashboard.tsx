import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CreditCard, User, LogOut, Settings, BarChart3, Sparkles, ArrowUp, ArrowDown, Check, Loader2, Plus, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProfileEditModal } from "@/components/profile/ProfileEditModal";
import { CampaignWizard, CampaignData } from "@/components/campaigns/CampaignWizard";
import { CampaignStatusCard, CampaignStatus } from "@/components/campaigns/CampaignStatusCard";

const allPlans = [
  { name: "FREE", price: "Gratis", priceValue: 0 },
  { name: "PREMIUM", price: "$9.99/mes", priceValue: 9.99 },
  { name: "GROWTH", price: "$99.99/mes", priceValue: 99.99 },
  { name: "SCALE", price: "$199.99/mes", priceValue: 199.99 },
];

const Dashboard = () => {
  const navigate = useNavigate();
  
  const [user, setUser] = useState({
    name: "Usuario Demo",
    email: "demo@legendaryum.com",
    currentPlan: "GROWTH" as "FREE" | "PREMIUM" | "GROWTH" | "SCALE",
    subscriptionStartDate: new Date("2024-01-15"),
    subscriptionEndDate: new Date("2024-02-14"),
    scheduledPlan: null as string | null,
    subscriptionStatus: "active" as "active" | "canceled" | "scheduled_downgrade",
  });

  const [profileData, setProfileData] = useState({
    firstName: "Usuario",
    lastName: "Demo",
    username: "LegendUser",
    description: "Jugador apasionado",
    avatarUrl: "",
    topics: ["Juegos", "Deportes"],
    socialMedia: { facebook: "", linkedin: "", instagram: "", twitter: "", tiktok: "", website: "" },
  });

  const [campaigns, setCampaigns] = useState<Array<{
    id: string; title: string; author: string; status: CampaignStatus;
    startDate: Date | null; endDate: Date | null; participants: number; game: string; rejectionReason?: string;
  }>>([
    { id: "1", title: "Summer Challenge", author: "Demo Brand", status: "approved", startDate: new Date(), endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), participants: 1250, game: "memory" },
    { id: "2", title: "Winter Quest", author: "Demo Brand", status: "pending", startDate: null, endDate: null, participants: 0, game: "puzzle" },
  ]);

  const [showManageModal, setShowManageModal] = useState(false);
  const [selectedNewPlan, setSelectedNewPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showCampaignWizard, setShowCampaignWizard] = useState(false);

  const canCreateCampaigns = user.currentPlan === "GROWTH" || user.currentPlan === "SCALE";

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
      case "FREE": return ["Acceso básico", "Rankings gratuitos", "Misiones básicas"];
      case "PREMIUM": return ["Campañas premium", "Early access", "Ventajas exclusivas"];
      case "GROWTH": return ["1 campaña mensual", "10K participantes", "Métricas macro"];
      case "SCALE": return ["3 campañas mensuales", "20K participantes", "Métricas completas"];
      default: return [];
    }
  };

  const getPlanIndex = (planName: string) => allPlans.findIndex(p => p.name === planName);
  const isUpgrade = (targetPlan: string) => getPlanIndex(targetPlan) > getPlanIndex(user.currentPlan);
  const isDowngrade = (targetPlan: string) => getPlanIndex(targetPlan) < getPlanIndex(user.currentPlan);
  const isCancellation = (targetPlan: string) => targetPlan === "FREE" && user.currentPlan !== "FREE";

  const getDaysRemaining = () => {
    const diffTime = user.subscriptionEndDate.getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  const calculateProration = (newPlanPrice: number) => {
    const currentPlanData = allPlans.find(p => p.name === user.currentPlan);
    if (!currentPlanData) return newPlanPrice;
    const credit = (currentPlanData.priceValue / 30) * getDaysRemaining();
    return Math.max(0, newPlanPrice - credit);
  };

  const formatDate = (date: Date) => date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });

  const handleChangePlan = (planName: string) => setSelectedNewPlan(planName);

  const confirmPlanChange = () => {
    if (!selectedNewPlan) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
      setTimeout(() => {
        if (isUpgrade(selectedNewPlan)) {
          setUser(prev => ({ ...prev, currentPlan: selectedNewPlan as any, subscriptionStartDate: new Date(), subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), scheduledPlan: null, subscriptionStatus: "active" }));
        } else if (isCancellation(selectedNewPlan)) {
          setUser(prev => ({ ...prev, scheduledPlan: "FREE", subscriptionStatus: "canceled" }));
        } else {
          setUser(prev => ({ ...prev, scheduledPlan: selectedNewPlan, subscriptionStatus: "scheduled_downgrade" }));
        }
        setShowSuccess(false);
        setSelectedNewPlan(null);
        setShowManageModal(false);
      }, 2000);
    }, 2000);
  };

  const handleCampaignComplete = (data: CampaignData) => {
    setCampaigns(prev => [...prev, {
      id: String(Date.now()), title: data.campaignTitle, author: data.authorName, status: "pending",
      startDate: data.startDate, endDate: data.endDate, participants: 0, game: data.selectedGame || ""
    }]);
  };

  const currentPlanData = allPlans.find(p => p.name === user.currentPlan);
  const selectedPlanData = allPlans.find(p => p.name === selectedNewPlan);

  const getActionMessage = () => {
    if (!selectedNewPlan) return "";
    if (isUpgrade(selectedNewPlan)) {
      const prorated = calculateProration(selectedPlanData?.priceValue || 0);
      return `Tu nuevo plan se activará de inmediato. Se descontará el tiempo no utilizado y comenzará un nuevo período de 30 días. Pagarás $${prorated.toFixed(2)} ahora.`;
    }
    if (isCancellation(selectedNewPlan)) {
      return `Tu plan permanecerá activo hasta el ${formatDate(user.subscriptionEndDate)} (${getDaysRemaining()} días restantes). Luego pasarás al plan FREE automáticamente.`;
    }
    return `El cambio de plan se aplicará al finalizar tu período actual el ${formatDate(user.subscriptionEndDate)} (${getDaysRemaining()} días restantes). Hasta entonces, mantendrás los beneficios de tu plan vigente.`;
  };

  return (
    <div className="min-h-screen bg-background">
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
            <Button variant="ghost" size="icon" asChild><Link to="/"><LogOut className="h-4 w-4" /></Link></Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Hola, {user.name.split(" ")[0]} 👋</h1>
          <p className="text-muted-foreground">Gestiona tu suscripción, perfil y campañas desde aquí.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Current Plan */}
          <Card className="md:col-span-2 lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Tu Plan</CardTitle>
              <Badge className={getPlanColor(user.currentPlan)}>{user.currentPlan}</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">{currentPlanData?.price}</div>
              <p className="text-xs text-muted-foreground mb-2">
                {user.currentPlan !== "FREE" ? <>Válido hasta: {formatDate(user.subscriptionEndDate)}</> : "Plan gratuito - sin cargos"}
              </p>
              <Button variant="outline" className="w-full" onClick={() => setShowManageModal(true)}>
                <CreditCard className="mr-2 h-4 w-4" />Gestionar Suscripción
              </Button>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Beneficios Activos</CardTitle>
              <Sparkles className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {getPlanFeatures(user.currentPlan).map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" /><span className="text-muted-foreground">{feature}</span>
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
                <div><div className="text-2xl font-bold">12</div><p className="text-xs text-muted-foreground">Campañas participadas</p></div>
                <div><div className="text-2xl font-bold">#45</div><p className="text-xs text-muted-foreground">Posición en ranking global</p></div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader><CardTitle>Acciones Rápidas</CardTitle></CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => setShowProfileModal(true)}>
                  <User className="h-5 w-5" /><span>Editar Perfil</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2"><Sparkles className="h-5 w-5" /><span>Ver Campañas</span></Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2"><BarChart3 className="h-5 w-5" /><span>Rankings</span></Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2"><Settings className="h-5 w-5" /><span>Configuración</span></Button>
              </div>
            </CardContent>
          </Card>

          {/* Campaign Creator Section - Only for GROWTH/SCALE */}
          {canCreateCampaigns && (
            <Card className="md:col-span-2 lg:col-span-3">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2"><Rocket className="h-5 w-5 text-primary" />Crear Campañas</CardTitle>
                  <CardDescription>Lanza tus propias campañas gamificadas</CardDescription>
                </div>
                <Button onClick={() => setShowCampaignWizard(true)}><Plus className="mr-2 h-4 w-4" />Nueva Campaña</Button>
              </CardHeader>
              <CardContent>
                {campaigns.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {campaigns.map((campaign) => (
                      <CampaignStatusCard key={campaign.id} campaign={campaign} onViewMetrics={() => {}} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Rocket className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aún no has creado ninguna campaña</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Upgrade CTA for non-campaign plans */}
          {!canCreateCampaigns && (
            <Card className="md:col-span-2 lg:col-span-3 bg-gradient-to-r from-plan-growth/20 to-plan-scale/20 border-plan-growth/30">
              <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2"><Rocket className="h-5 w-5" />¿Quieres crear tus propias campañas?</h3>
                  <p className="text-muted-foreground">Mejora a GROWTH o SCALE para lanzar campañas gamificadas.</p>
                </div>
                <Button onClick={() => setShowManageModal(true)}>Ver Planes</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Modals */}
      <ProfileEditModal open={showProfileModal} onOpenChange={setShowProfileModal} profileData={profileData} onSave={setProfileData} />
      
      {canCreateCampaigns && (
        <CampaignWizard open={showCampaignWizard} onOpenChange={setShowCampaignWizard} userPlan={user.currentPlan as "GROWTH" | "SCALE"} onComplete={handleCampaignComplete} />
      )}

      {/* Manage Subscription Modal */}
      <Dialog open={showManageModal && !selectedNewPlan} onOpenChange={setShowManageModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Gestionar Suscripción</DialogTitle><DialogDescription>Cambia tu plan o cancela tu suscripción.</DialogDescription></DialogHeader>
          <div className="space-y-3 py-4">
            {allPlans.map((plan) => {
              const isCurrent = plan.name === user.currentPlan;
              const isUpgradeOption = isUpgrade(plan.name);
              return (
                <div key={plan.name} className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${isCurrent ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 cursor-pointer"}`} onClick={() => !isCurrent && handleChangePlan(plan.name)}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getPlanColor(plan.name)}`}><span className="text-white font-bold">{plan.name.charAt(0)}</span></div>
                    <div><div className="font-medium flex items-center gap-2">{plan.name}{isCurrent && <Badge variant="outline" className="text-xs">Actual</Badge>}</div><div className="text-sm text-muted-foreground">{plan.price}</div></div>
                  </div>
                  {!isCurrent && <Button size="sm" variant={isUpgradeOption ? "default" : "outline"}>{isUpgradeOption ? <><ArrowUp className="mr-1 h-3 w-3" />Upgrade</> : <><ArrowDown className="mr-1 h-3 w-3" />Downgrade</>}</Button>}
                </div>
              );
            })}
          </div>
          {user.currentPlan !== "FREE" && user.subscriptionStatus === "active" && (
            <div className="border-t border-border pt-4"><Button variant="ghost" className="w-full text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleChangePlan("FREE")}>Cancelar Suscripción</Button></div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirm Plan Change Modal */}
      <Dialog open={!!selectedNewPlan && !showSuccess} onOpenChange={() => setSelectedNewPlan(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5" />{isUpgrade(selectedNewPlan || "") ? "Confirmar Upgrade" : isCancellation(selectedNewPlan || "") ? "Cancelar Suscripción" : "Confirmar Downgrade"}</DialogTitle>
            <DialogDescription>{isUpgrade(selectedNewPlan || "") ? `Estás a punto de mejorar a ${selectedNewPlan}` : isCancellation(selectedNewPlan || "") ? "Estás a punto de cancelar tu suscripción" : `Estás a punto de cambiar a ${selectedNewPlan}`}</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="p-4 rounded-lg bg-muted/50 border border-border"><p className="text-sm">{getActionMessage()}</p></div>
            <div className="flex gap-3"><Button variant="outline" className="flex-1" onClick={() => setSelectedNewPlan(null)} disabled={isProcessing}>Cancelar</Button><Button className="flex-1" onClick={confirmPlanChange} disabled={isProcessing}>{isProcessing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Procesando...</> : "Confirmar"}</Button></div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={showSuccess}>
        <DialogContent className="sm:max-w-sm text-center"><div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center"><Check className="h-8 w-8 text-green-500" /></div><DialogTitle>¡Operación exitosa!</DialogTitle><DialogDescription>Tu cambio de plan ha sido procesado correctamente.</DialogDescription></DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
