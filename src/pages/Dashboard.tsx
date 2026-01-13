import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  CreditCard, User, LogOut, Settings, BarChart3, Sparkles, ArrowUp, ArrowDown, 
  Check, Loader2, Plus, Rocket, Calendar, XCircle, AlertTriangle, Trophy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProfileEditModal } from "@/components/profile/ProfileEditModal";
import { CampaignWizard, CampaignData } from "@/components/campaigns/CampaignWizard";
import { CampaignStatusCard, CampaignStatus } from "@/components/campaigns/CampaignStatusCard";
import { CampaignMetricsDashboard } from "@/components/campaigns/CampaignMetricsDashboard";
import { FinishedCampaignsModal } from "@/components/campaigns/FinishedCampaignsModal";
import { CampaignEditModal } from "@/components/campaigns/CampaignEditModal";
import { AccessPassModal } from "@/components/dashboard/AccessPassModal";
import { AchievementsModal } from "@/components/dashboard/AchievementsModal";

// Exclude ENTERPRISE from upgrade/downgrade plans
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
    currentPlan: "PREMIUM" as "FREE" | "PREMIUM" | "GROWTH" | "SCALE",
    subscriptionStartDate: new Date("2024-01-15"),
    subscriptionEndDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
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
    startDate: Date | null; endDate: Date | null; participants: number; game: string; rejectionReason?: string; rejectionDetails?: string;
  }>>([
    { id: "1", title: "Summer Challenge", author: "Demo Brand", status: "active", startDate: new Date(), endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), participants: 1250, game: "memory" },
    { id: "2", title: "Winter Quest", author: "Demo Brand", status: "pending", startDate: null, endDate: null, participants: 0, game: "puzzle" },
    { id: "3", title: "Spring Promo", author: "Demo Brand", status: "rejected", startDate: null, endDate: null, participants: 0, game: "runner", rejectionReason: "inappropriate_content", rejectionDetails: "El contenido visual no cumple con nuestras políticas de marca." },
    { id: "4", title: "Holiday Special", author: "Demo Brand", status: "completed", startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), endDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), participants: 3420, game: "memory" },
    { id: "5", title: "Black Friday Rush", author: "Demo Brand", status: "completed", startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), endDate: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000), participants: 5680, game: "puzzle" },
    { id: "6", title: "Summer Vibes 2025", author: "Demo Brand", status: "completed", startDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), endDate: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000), participants: 8920, game: "runner" },
    { id: "7", title: "Easter Egg Hunt", author: "Demo Brand", status: "completed", startDate: new Date(Date.now() - 270 * 24 * 60 * 60 * 1000), endDate: new Date(Date.now() - 255 * 24 * 60 * 60 * 1000), participants: 2340, game: "memory" },
  ]);

  const [showManageModal, setShowManageModal] = useState(false);
  const [selectedNewPlan, setSelectedNewPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showCampaignWizard, setShowCampaignWizard] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [showMetrics, setShowMetrics] = useState(false);
  const [selectedCampaignForMetrics, setSelectedCampaignForMetrics] = useState<string | null>(null);
  const [showFinishedCampaigns, setShowFinishedCampaigns] = useState(false);
  const [showEditCampaign, setShowEditCampaign] = useState<string | null>(null);
  const [showAccessPass, setShowAccessPass] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);

  const canCreateCampaigns = user.currentPlan === "GROWTH" || user.currentPlan === "SCALE";
  
  // Campaign limits by plan
  const getCampaignLimit = () => {
    if (user.currentPlan === "GROWTH") return 1;
    if (user.currentPlan === "SCALE") return 3;
    return 0;
  };
  
  const activeCampaignsCount = campaigns.filter(c => c.status === "active" || c.status === "pending").length;
  const remainingCampaigns = getCampaignLimit() - activeCampaignsCount;

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
      case "SCALE": return ["3 campañas mensuales", "20K participantes", "Métricas completas", "Exportar leads"];
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
      
      if (isUpgrade(selectedNewPlan)) {
        setSuccessMessage("¡Tu nuevo plan se ha activado! Tu período de 30 días comienza ahora.");
        setUser(prev => ({ 
          ...prev, 
          currentPlan: selectedNewPlan as any, 
          subscriptionStartDate: new Date(), 
          subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 
          scheduledPlan: null, 
          subscriptionStatus: "active" 
        }));
      } else if (isCancellation(selectedNewPlan)) {
        setSuccessMessage(`Tu suscripción ha sido cancelada. Mantendrás los beneficios hasta el ${formatDate(user.subscriptionEndDate)}.`);
        setUser(prev => ({ ...prev, scheduledPlan: "FREE", subscriptionStatus: "canceled" }));
      } else {
        setSuccessMessage(`El cambio a ${selectedNewPlan} se aplicará el ${formatDate(user.subscriptionEndDate)}. Hasta entonces mantienes tu plan actual.`);
        setUser(prev => ({ ...prev, scheduledPlan: selectedNewPlan, subscriptionStatus: "scheduled_downgrade" }));
      }
      
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setSelectedNewPlan(null);
        setShowManageModal(false);
      }, 3000);
    }, 2000);
  };

  const handleCreateCampaign = () => {
    if (!canCreateCampaigns) {
      setShowUpgradePrompt(true);
    } else if (remainingCampaigns <= 0) {
      setShowUpgradePrompt(true);
    } else {
      setShowCampaignWizard(true);
    }
  };

  const handleCampaignComplete = (data: CampaignData) => {
    setCampaigns(prev => [...prev, {
      id: String(Date.now()), title: data.campaignTitle, author: data.authorName, status: "pending",
      startDate: data.startDate, endDate: data.endDate, participants: 0, game: data.selectedGame || ""
    }]);
  };

  const handleViewMetrics = (campaignId: string) => {
    setSelectedCampaignForMetrics(campaignId);
    setShowMetrics(true);
  };

  const handleEditCampaign = (campaignId: string) => {
    setShowEditCampaign(campaignId);
  };

  const handleSaveCampaignEdit = (campaignId: string, updates: { title: string; description: string }) => {
    setCampaigns(prev => prev.map(c => 
      c.id === campaignId 
        ? { ...c, title: updates.title, status: "pending" as CampaignStatus, rejectionReason: undefined, rejectionDetails: undefined }
        : c
    ));
  };

  const finishedCampaigns = campaigns
    .filter(c => c.status === "completed")
    .map(c => ({
      id: c.id,
      title: c.title,
      author: c.author,
      startDate: c.startDate || new Date(),
      endDate: c.endDate || new Date(),
      participants: c.participants,
      totalMatches: Math.floor(c.participants * 5.4),
      totalMinutes: Math.floor(c.participants * 3.2),
      bonusAchievement: 78,
      game: c.game,
    }));

  const campaignToEdit = campaigns.find(c => c.id === showEditCampaign);

  const currentPlanData = allPlans.find(p => p.name === user.currentPlan);
  const selectedPlanData = allPlans.find(p => p.name === selectedNewPlan);
  const selectedCampaign = campaigns.find(c => c.id === selectedCampaignForMetrics);

  const getActionMessage = () => {
    if (!selectedNewPlan) return "";
    if (isUpgrade(selectedNewPlan)) {
      const prorated = calculateProration(selectedPlanData?.priceValue || 0);
      return `Tu nuevo plan se activará de inmediato. Se descontará el tiempo no utilizado de tu plan actual ($${((currentPlanData?.priceValue || 0) / 30 * getDaysRemaining()).toFixed(2)} de crédito) y comenzará un nuevo período de 30 días. Pagarás $${prorated.toFixed(2)} ahora.`;
    }
    if (isCancellation(selectedNewPlan)) {
      return `Tu plan permanecerá activo hasta el ${formatDate(user.subscriptionEndDate)} (${getDaysRemaining()} días restantes). Luego pasarás al plan FREE automáticamente. No se generan reembolsos.`;
    }
    return `El cambio de plan se aplicará al finalizar tu período actual el ${formatDate(user.subscriptionEndDate)} (${getDaysRemaining()} días restantes). Hasta entonces, mantendrás todos los beneficios de tu plan vigente. No se generan reembolsos parciales.`;
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

        {/* Status alerts */}
        {user.subscriptionStatus === "canceled" && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-3">
            <XCircle className="h-5 w-5 text-red-500" />
            <div>
              <p className="font-medium text-red-500">Suscripción cancelada</p>
              <p className="text-sm text-muted-foreground">
                Tu plan actual permanecerá activo hasta el {formatDate(user.subscriptionEndDate)}. 
                Después pasarás automáticamente al plan FREE.
              </p>
            </div>
          </div>
        )}
        
        {user.subscriptionStatus === "scheduled_downgrade" && user.scheduledPlan && (
          <div className="mb-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <div>
              <p className="font-medium text-yellow-500">Cambio de plan programado</p>
              <p className="text-sm text-muted-foreground">
                Tu plan cambiará a {user.scheduledPlan} el {formatDate(user.subscriptionEndDate)}. 
                Hasta entonces mantienes todos los beneficios de {user.currentPlan}.
              </p>
            </div>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Current Plan */}
          <Card className="md:col-span-2 lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Tu Plan</CardTitle>
              <Badge className={getPlanColor(user.currentPlan)}>{user.currentPlan}</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">{currentPlanData?.price}</div>
              {user.currentPlan !== "FREE" && (
                <div className="space-y-1 mb-3">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Renovación: {formatDate(user.subscriptionEndDate)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {getDaysRemaining()} días restantes del período actual
                  </p>
                </div>
              )}
              {user.currentPlan === "FREE" && (
                <p className="text-xs text-muted-foreground mb-3">Plan gratuito - sin cargos</p>
              )}
              <Button variant="outline" className="w-full" onClick={() => setShowManageModal(true)}>
                <CreditCard className="mr-2 h-4 w-4" />
                Gestionar Suscripción
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

          {/* Social */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Social</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xl font-bold">128</div>
                      <p className="text-xs text-muted-foreground">Seguidores</p>
                    </div>
                  </div>
                  <div className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">+12%</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                      <User className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <div className="text-xl font-bold">45</div>
                      <p className="text-xs text-muted-foreground">Seguidos</p>
                    </div>
                  </div>
                </div>
                {/* Visual connection line */}
                <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    Conexiones activas
                  </span>
                  <span className="font-medium text-foreground">83</span>
                </div>
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
                <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => setShowFinishedCampaigns(true)}>
                  <BarChart3 className="h-5 w-5" /><span>Campañas Finalizadas</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => setShowAccessPass(true)}>
                  <Sparkles className="h-5 w-5" /><span>Access Pass</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => setShowAchievements(true)}>
                  <Trophy className="h-5 w-5" /><span>Logros</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Campaign Creator Section */}
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-primary" />
                  Crear Campañas
                </CardTitle>
                <CardDescription>
                  {canCreateCampaigns 
                    ? `${remainingCampaigns} de ${getCampaignLimit()} campañas disponibles este mes`
                    : "Necesitas plan GROWTH o SCALE para crear campañas"
                  }
                </CardDescription>
              </div>
              <Button onClick={handleCreateCampaign}>
                <Plus className="mr-2 h-4 w-4" />
                Nueva Campaña
              </Button>
            </CardHeader>
            <CardContent>
              {!canCreateCampaigns ? (
                <div className="text-center py-8 bg-muted/30 rounded-lg border border-dashed border-border">
                  <Rocket className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold mb-2">Desbloquea la creación de campañas</h3>
                  <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                    Mejora tu plan a GROWTH o SCALE para lanzar tus propias campañas gamificadas y acceder a métricas.
                  </p>
                  <Button onClick={() => setShowManageModal(true)}>
                    <ArrowUp className="mr-2 h-4 w-4" />
                    Ver planes disponibles
                  </Button>
                </div>
              ) : campaigns.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {campaigns.filter(c => c.status !== "completed").map((campaign) => (
                    <CampaignStatusCard 
                      key={campaign.id} 
                      campaign={campaign} 
                      onViewMetrics={handleViewMetrics}
                      onEdit={handleEditCampaign}
                    />
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

        </div>
      </main>

      {/* Modals */}
      <ProfileEditModal open={showProfileModal} onOpenChange={setShowProfileModal} profileData={profileData} onSave={setProfileData} />
      
      <AccessPassModal open={showAccessPass} onOpenChange={setShowAccessPass} />
      <AchievementsModal open={showAchievements} onOpenChange={setShowAchievements} />
      
      {canCreateCampaigns && (
        <CampaignWizard 
          open={showCampaignWizard} 
          onOpenChange={setShowCampaignWizard} 
          userPlan={user.currentPlan as "GROWTH" | "SCALE"} 
          onComplete={handleCampaignComplete} 
        />
      )}

      {/* Metrics Dashboard */}
      {selectedCampaign && (
        <CampaignMetricsDashboard
          open={showMetrics}
          onOpenChange={setShowMetrics}
          userPlan={user.currentPlan as "GROWTH" | "SCALE"}
          onUpgrade={() => {
            setShowMetrics(false);
            handleChangePlan("SCALE");
            setShowManageModal(true);
          }}
          campaign={{
            id: selectedCampaign.id,
            title: selectedCampaign.title,
            status: selectedCampaign.status === "active" ? "active" : "completed",
            startDate: selectedCampaign.startDate || new Date(),
            endDate: selectedCampaign.endDate || new Date(),
            participants: selectedCampaign.participants,
          }}
        />
      )}

      {/* Finished Campaigns Modal */}
      <FinishedCampaignsModal
        open={showFinishedCampaigns}
        onOpenChange={setShowFinishedCampaigns}
        campaigns={finishedCampaigns}
        onViewReport={(campaignId) => {
          setShowFinishedCampaigns(false);
          setSelectedCampaignForMetrics(campaignId);
          setShowMetrics(true);
        }}
      />

      {/* Edit Rejected Campaign Modal */}
      <CampaignEditModal
        open={!!showEditCampaign}
        onOpenChange={(open) => !open && setShowEditCampaign(null)}
        campaign={campaignToEdit ? {
          id: campaignToEdit.id,
          title: campaignToEdit.title,
          author: campaignToEdit.author,
          authorEmail: "demo@legendaryum.com",
          description: "",
          rejectionReason: campaignToEdit.rejectionReason || "",
          rejectionDetails: campaignToEdit.rejectionDetails,
        } : null}
        onSave={handleSaveCampaignEdit}
      />

      {/* Upgrade Prompt Modal - for users without campaign access */}
      <Dialog open={showUpgradePrompt} onOpenChange={setShowUpgradePrompt}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-primary" />
              Upgrade requerido
            </DialogTitle>
            <DialogDescription>
              {!canCreateCampaigns 
                ? "Necesitas un plan GROWTH o SCALE para crear campañas gamificadas."
                : "Has alcanzado el límite de campañas de tu plan actual."
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-3">
              <div 
                className="p-4 rounded-lg border border-plan-growth/50 bg-plan-growth/5 cursor-pointer hover:bg-plan-growth/10 transition-colors"
                onClick={() => {
                  setShowUpgradePrompt(false);
                  handleChangePlan("GROWTH");
                  setShowManageModal(true);
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-plan-growth">GROWTH</h4>
                    <p className="text-sm text-muted-foreground">1 campaña/mes • 10K participantes • Métricas macro</p>
                  </div>
                  <span className="font-bold">$99.99</span>
                </div>
              </div>
              <div 
                className="p-4 rounded-lg border border-plan-scale/50 bg-plan-scale/5 cursor-pointer hover:bg-plan-scale/10 transition-colors"
                onClick={() => {
                  setShowUpgradePrompt(false);
                  handleChangePlan("SCALE");
                  setShowManageModal(true);
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-plan-scale">SCALE</h4>
                    <p className="text-sm text-muted-foreground">3 campañas/mes • 20K participantes • Métricas completas</p>
                  </div>
                  <span className="font-bold">$199.99</span>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Manage Subscription Modal - ENTERPRISE excluded */}
      <Dialog open={showManageModal && !selectedNewPlan} onOpenChange={setShowManageModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Gestionar Suscripción</DialogTitle>
            <DialogDescription>Cambia tu plan o cancela tu suscripción.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {allPlans.map((plan) => {
              const isCurrent = plan.name === user.currentPlan;
              const isUpgradeOption = isUpgrade(plan.name);
              const isScheduled = user.scheduledPlan === plan.name;
              
              return (
                <div 
                  key={plan.name} 
                  className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                    isCurrent ? "border-primary bg-primary/5" : 
                    isScheduled ? "border-yellow-500 bg-yellow-500/5" :
                    "border-border hover:border-primary/50 cursor-pointer"
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
                        {isCurrent && <Badge variant="outline" className="text-xs">Actual</Badge>}
                        {isScheduled && <Badge variant="outline" className="text-xs text-yellow-500 border-yellow-500">Programado</Badge>}
                      </div>
                      <div className="text-sm text-muted-foreground">{plan.price}</div>
                    </div>
                  </div>
                  {!isCurrent && !isScheduled && (
                    <Button size="sm" variant={isUpgradeOption ? "default" : "outline"}>
                      {isUpgradeOption 
                        ? <><ArrowUp className="mr-1 h-3 w-3" />Upgrade</> 
                        : <><ArrowDown className="mr-1 h-3 w-3" />Downgrade</>
                      }
                    </Button>
                  )}
                </div>
              );
            })}
            
            {/* Enterprise contact option - not for upgrade/downgrade */}
            <div className="p-4 rounded-lg border border-dashed border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-plan-enterprise">
                    <span className="text-white font-bold">E</span>
                  </div>
                  <div>
                    <div className="font-medium">ENTERPRISE</div>
                    <div className="text-sm text-muted-foreground">Solución personalizada</div>
                  </div>
                </div>
                <Button size="sm" variant="outline">Contactar</Button>
              </div>
            </div>
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
                  : "Confirmar Downgrade"
              }
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
            <div className={`p-4 rounded-lg border ${
              isUpgrade(selectedNewPlan || "") 
                ? "bg-green-500/10 border-green-500/30" 
                : isCancellation(selectedNewPlan || "") 
                  ? "bg-red-500/10 border-red-500/30" 
                  : "bg-yellow-500/10 border-yellow-500/30"
            }`}>
              <p className="text-sm">{getActionMessage()}</p>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setSelectedNewPlan(null)} disabled={isProcessing}>
                Cancelar
              </Button>
              <Button className="flex-1" onClick={confirmPlanChange} disabled={isProcessing}>
                {isProcessing 
                  ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Procesando...</> 
                  : "Confirmar"
                }
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={showSuccess}>
        <DialogContent className="sm:max-w-sm text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
            <Check className="h-8 w-8 text-green-500" />
          </div>
          <DialogTitle>¡Operación exitosa!</DialogTitle>
          <DialogDescription>{successMessage}</DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
