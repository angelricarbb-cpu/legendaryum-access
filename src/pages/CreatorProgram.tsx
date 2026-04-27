import { useState, useMemo } from "react";
import Header from "@/components/layout/Header";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Sparkles, Copy, Check, Share2, Users, TrendingUp, DollarSign, Crown,
  Link2, Gift, Rocket, Star, ArrowUpRight, Wallet, Calendar, Trophy,
  Facebook, Twitter, Send, MessageCircle, Building2, Ticket, UserPlus,
  CheckCircle2, Target, Zap, Info, Instagram, Youtube, Globe, Clock,
  ArrowRight, ArrowLeft, PlayCircle, HelpCircle, Mail, ShieldCheck, XCircle, X, Flame
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

type Status = "intro" | "applying" | "pending" | "approved";

// Bonos por volumen segun PDF
const PREMIUM_BONUSES = [
  { users: 500, bonus: 50 },
  { users: 1000, bonus: 100 },
  { users: 5000, bonus: 500 },
  { users: 10000, bonus: 1000 },
  { users: 50000, bonus: 4500 },
  { users: 100000, bonus: 8850 },
];

const B2B_BONUSES = [
  { brands: 10, bonus: 100 },
  { brands: 50, bonus: 400 },
  { brands: 150, bonus: 1000 },
  { brands: 300, bonus: 2000 },
  { brands: 500, bonus: 6500 },
];

const EVENTS_BONUSES = [
  { tickets: 500, bonus: 50 },
  { tickets: 1000, bonus: 100 },
  { tickets: 5000, bonus: 500 },
  { tickets: 10000, bonus: 1000 },
  { tickets: 50000, bonus: 4500 },
  { tickets: 100000, bonus: 8850 },
];

interface ApplicationForm {
  fullName: string;
  email: string;
  country: string;
  creatorType: string;
  niche: string;
  mainPlatform: string;
  followersTotal: number;
  avgViews: number;
  instagram: string;
  tiktok: string;
  youtube: string;
  twitter: string;
  twitch: string;
  website: string;
  audienceDescription: string;
  motivation: string;
  monetizationExperience: string;
  acceptsTerms: boolean;
}

const CreatorProgram = () => {
  const { user, isLoggedIn } = useAuth();
  const [status, setStatus] = useState<Status>("intro");
  const [copied, setCopied] = useState(false);
  const [applyStep, setApplyStep] = useState(1);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [calcFollowers, setCalcFollowers] = useState([10000]);
  const [calcConversion, setCalcConversion] = useState([2]);

  const [form, setForm] = useState<ApplicationForm>({
    fullName: user?.name || "",
    email: user?.email || "",
    country: "",
    creatorType: "",
    niche: "",
    mainPlatform: "",
    followersTotal: 0,
    avgViews: 0,
    instagram: "",
    tiktok: "",
    youtube: "",
    twitter: "",
    twitch: "",
    website: "",
    audienceDescription: "",
    motivation: "",
    monetizationExperience: "",
    acceptsTerms: false,
  });

  const updateForm = (field: keyof ApplicationForm, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const metrics = useMemo(() => ({
    clicks: 1284,
    signups: 312,
    premiumConversions: 47,
    premiumEarnings: 234.53,
    brandConversions: 3,
    brandEarnings: 119.99,
    ticketsSold: 28,
    eventsEarnings: 56.00,
    referredCreators: 2,
    creatorReferralEarnings: 18.40,
    earningsThisMonth: 428.92,
    earningsTotal: 1842.10,
    pendingPayout: 428.92,
    conversionRate: 15.1,
  }), []);

  const referralCode = (user?.username || "creator").toLowerCase().replace(/[^a-z0-9]/g, "") || "creator";
  const referralLink = `https://legendaryum.com/r/${referralCode}`;
  const creatorReferralLink = `https://legendaryum.com/creators/r/${referralCode}`;

  const recentConversions = [
    { id: 1, name: "Maria G.", date: "Hace 2h", type: "Premium", commission: 2.99, source: "premium" },
    { id: 2, name: "Brand: AcmeCo", date: "Hace 5h", type: "B2B Growth", commission: 19.99, source: "b2b" },
    { id: 3, name: "Carlos R.", date: "Ayer", type: "Ticket Champions", commission: 4.00, source: "event" },
    { id: 4, name: "Lucia P.", date: "Hace 2 dias", type: "Premium", commission: 2.99, source: "premium" },
    { id: 5, name: "Andres M.", date: "Hace 3 dias", type: "Premium", commission: 2.99, source: "premium" },
    { id: 6, name: "@creator_jane", date: "Hace 4 dias", type: "Sub-creador (5%)", commission: 1.20, source: "creator" },
  ];

  const copyLink = (link: string, label: string) => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast({ title: `${label} copiado`, description: "Ya puedes compartirlo en tus redes." });
    setTimeout(() => setCopied(false), 2000);
  };

  const shareTo = (platform: string, link: string) => {
    const text = encodeURIComponent("Unete a Legendaryum y vive experiencias gamificadas con premios reales!");
    const url = encodeURIComponent(link);
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      telegram: `https://t.me/share/url?url=${url}&text=${text}`,
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
    };
    if (urls[platform]) window.open(urls[platform], "_blank");
  };

  const getNextBonus = <T extends { bonus: number }>(list: T[], current: number, key: keyof T) => {
    return list.find((b) => current < (b[key] as unknown as number)) || null;
  };

  const nextPremiumBonus = getNextBonus(PREMIUM_BONUSES, metrics.premiumConversions, "users");
  const nextB2BBonus = getNextBonus(B2B_BONUSES, metrics.brandConversions, "brands");
  const nextEventsBonus = getNextBonus(EVENTS_BONUSES, metrics.ticketsSold, "tickets");

  // Calculadora de ingresos potenciales
  const potentialMonthly = useMemo(() => {
    const conversions = (calcFollowers[0] * (calcConversion[0] / 100));
    const premiumRevenue = conversions * 2.99 * 0.20; // 20% de $14.99 promedio
    return premiumRevenue;
  }, [calcFollowers, calcConversion]);

  const potentialYearly = potentialMonthly * 12;

  // Validacion del paso del formulario
  const canAdvance = useMemo(() => {
    if (applyStep === 1) {
      return form.fullName.trim().length > 0 && form.email.trim().length > 0 && form.country.length > 0 && form.creatorType.length > 0 && form.niche.length > 0;
    }
    if (applyStep === 2) {
      return form.mainPlatform.length > 0 && form.followersTotal > 0 && (form.instagram || form.tiktok || form.youtube || form.twitter || form.twitch);
    }
    if (applyStep === 3) {
      return form.audienceDescription.trim().length >= 20 && form.motivation.trim().length >= 20 && form.acceptsTerms;
    }
    return false;
  }, [applyStep, form]);

  const submitApplication = () => {
    setStatus("pending");
    toast({ title: "Solicitud enviada!", description: "Te avisaremos por email en menos de 48h." });
  };

  const simulateApproval = () => {
    setStatus("approved");
    setShowOnboarding(true);
    setOnboardingStep(0);
  };

  // ============ INTRO / LANDING ============
  if (status === "intro") {
    return (
      <div className="min-h-screen bg-background">
        <Header isLoggedIn={isLoggedIn} user={user ? { name: user.name, username: `@${user.username}`, avatar: user.avatar } : undefined} />
        <main className="container py-12">
          <div className="max-w-6xl mx-auto">
            {/* Hero */}
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                <Sparkles className="h-3 w-3 mr-1" /> Legendaryum Creators Program
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
                Gana dinero con tu comunidad promoviendo premios reales
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Sin inversion. Sin riesgo. Tu audiencia accede a descuentos exclusivos. Tu ganas dinero con cada conversion durante 12 meses.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button size="lg" className="gap-2" onClick={() => setStatus("applying")}>
                  <Rocket className="h-4 w-4" /> Quiero aplicar al programa
                </Button>
                <Button size="lg" variant="outline" className="gap-2" onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}>
                  <PlayCircle className="h-4 w-4" /> Ver como funciona
                </Button>
              </div>
              <div className="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-green-500" /> Sin coste</div>
                <div className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-blue-500" /> Aprobacion en 48h</div>
                <div className="flex items-center gap-1.5"><Wallet className="h-4 w-4 text-amber-500" /> Pagos por transferencia</div>
              </div>
            </div>

            {/* Vias de ingreso */}
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              <Card className="border-2 border-blue-500/20 hover:border-blue-500/50 transition-colors">
                <CardContent className="pt-6">
                  <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                    <Crown className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="font-semibold mb-2">Premium B2C</h3>
                  <p className="text-3xl font-bold mb-1">20%</p>
                  <p className="text-sm text-muted-foreground">Comision recurrente 12 meses por cada suscripcion Premium. Tu audiencia obtiene 20% de descuento.</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-purple-500/20 hover:border-purple-500/50 transition-colors">
                <CardContent className="pt-6">
                  <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                    <Building2 className="h-6 w-6 text-purple-500" />
                  </div>
                  <h3 className="font-semibold mb-2">Marcas B2B</h3>
                  <p className="text-3xl font-bold mb-1">20%</p>
                  <p className="text-sm text-muted-foreground">Recurrente 12 meses por cada marca que se suscriba a Growth o Scale.</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-orange-500/20 hover:border-orange-500/50 transition-colors">
                <CardContent className="pt-6">
                  <div className="h-12 w-12 rounded-lg bg-orange-500/10 flex items-center justify-center mb-4">
                    <Ticket className="h-6 w-6 text-orange-500" />
                  </div>
                  <h3 className="font-semibold mb-2">Eventos exclusivos</h3>
                  <p className="text-3xl font-bold mb-1">20%</p>
                  <p className="text-sm text-muted-foreground">Por cada ticket vendido para eventos pay-to-enter (viajes, finales, VIP).</p>
                </CardContent>
              </Card>
            </div>

            {/* Calculadora de ingresos */}
            <Card className="mb-16 bg-gradient-to-br from-primary/5 to-amber-500/5 border-primary/20">
              <CardHeader className="text-center">
                <Badge variant="outline" className="mx-auto mb-2 w-fit">Simulador</Badge>
                <CardTitle className="text-2xl">Calcula tus ingresos potenciales</CardTitle>
                <CardDescription>Estimacion basada en suscripciones Premium ($14.99/mes promedio)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 max-w-2xl mx-auto">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Tamano de tu comunidad</Label>
                    <span className="text-sm font-bold">{calcFollowers[0].toLocaleString()} seguidores</span>
                  </div>
                  <Slider value={calcFollowers} onValueChange={setCalcFollowers} min={1000} max={500000} step={1000} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Tasa de conversion estimada</Label>
                    <span className="text-sm font-bold">{calcConversion[0]}%</span>
                  </div>
                  <Slider value={calcConversion} onValueChange={setCalcConversion} min={0.5} max={10} step={0.5} />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center p-4 rounded-lg bg-background border">
                    <p className="text-xs text-muted-foreground mb-1">Estimado mensual</p>
                    <p className="text-3xl font-bold text-green-500">${potentialMonthly.toFixed(0)}</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-background border">
                    <p className="text-xs text-muted-foreground mb-1">Estimado anual</p>
                    <p className="text-3xl font-bold text-green-500">${potentialYearly.toFixed(0)}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  * Sin contar B2B, eventos, sub-creadores ni bonos por volumen (que pueden multiplicar tus ingresos x3-x5).
                </p>
              </CardContent>
            </Card>

            {/* Bonos por volumen - Bloque dedicado */}
            <div className="mb-16 relative overflow-hidden rounded-2xl border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-red-500/10 p-8 md:p-12">
              <div className="absolute top-0 right-0 h-64 w-64 bg-amber-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 h-64 w-64 bg-orange-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
              <div className="relative text-center max-w-4xl mx-auto">
                <Badge className="mb-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                  <Flame className="h-3 w-3 mr-1" /> Bonos extra
                </Badge>
                <h2 className="text-3xl md:text-5xl font-bold mb-3 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
                  Gana hasta USD 40.000 en bonos adicionales
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Ademas de tus comisiones recurrentes, desbloquea bonos por volumen a medida que escalas.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-background/80 backdrop-blur rounded-xl p-6 border border-blue-500/30">
                    <Crown className="h-7 w-7 text-blue-500 mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground mb-1">Premium B2C</p>
                    <p className="text-3xl font-bold text-blue-500">$8.850</p>
                    <p className="text-xs text-muted-foreground mt-1">al alcanzar 100k suscripciones</p>
                  </div>
                  <div className="bg-background/80 backdrop-blur rounded-xl p-6 border border-purple-500/30">
                    <Building2 className="h-7 w-7 text-purple-500 mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground mb-1">Marcas B2B</p>
                    <p className="text-3xl font-bold text-purple-500">$6.500</p>
                    <p className="text-xs text-muted-foreground mt-1">al alcanzar 500 marcas</p>
                  </div>
                  <div className="bg-background/80 backdrop-blur rounded-xl p-6 border border-orange-500/30">
                    <Ticket className="h-7 w-7 text-orange-500 mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground mb-1">Eventos</p>
                    <p className="text-3xl font-bold text-orange-500">$8.850</p>
                    <p className="text-xs text-muted-foreground mt-1">al alcanzar 100k tickets</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Sumando todas las vias y sub-creadores puedes acumular <strong className="text-foreground">hasta USD 40.000 extra</strong> en bonos.
                </p>
              </div>
            </div>

            {/* Como funciona */}
            <div id="how-it-works" className="mb-16">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold mb-2">Como funciona</h2>
                <p className="text-muted-foreground">De aplicar a cobrar en 4 pasos</p>
              </div>
              <div className="grid md:grid-cols-4 gap-6">
                {[
                  { n: 1, icon: UserPlus, title: "Aplica", desc: "Cuentanos sobre ti y tus redes. Aprobacion en menos de 48h." },
                  { n: 2, icon: Link2, title: "Comparte tu link", desc: "Recibes un link unico para todas tus redes y bio." },
                  { n: 3, icon: TrendingUp, title: "Tu comunidad gana", desc: "Tus seguidores acceden con 20% de descuento." },
                  { n: 4, icon: Wallet, title: "Cobra", desc: "20% recurrente durante 12 meses." },
                ].map((s) => (
                  <div key={s.n} className="relative">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-amber-500 text-white flex items-center justify-center font-bold mb-4">{s.n}</div>
                    <s.icon className="h-5 w-5 text-primary mb-2" />
                    <h3 className="font-semibold mb-1">{s.title}</h3>
                    <p className="text-sm text-muted-foreground">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Para quien es */}
            <div className="grid md:grid-cols-2 gap-6 mb-16">
              <Card className="border-green-500/30 bg-green-500/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <CheckCircle2 className="h-5 w-5" /> Es para ti si...
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex gap-2"><Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /> Creas contenido de gaming, lifestyle, entretenimiento o tech</li>
                    <li className="flex gap-2"><Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /> Tienes una comunidad activa (desde 1k seguidores)</li>
                    <li className="flex gap-2"><Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /> Quieres monetizar sin depender de algoritmos</li>
                    <li className="flex gap-2"><Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /> Buscas ingresos recurrentes, no pagos puntuales</li>
                    <li className="flex gap-2"><Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /> Te interesan experiencias gamificadas y premios reales</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-muted bg-muted/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-muted-foreground">
                    <Info className="h-5 w-5" /> No es para ti si...
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Buscas un sponsor de pago unico</li>
                    <li>• No quieres compartir contenido en tus redes</li>
                    <li>• Esperas comisiones sin actividad real</li>
                    <li>• Tu audiencia no encaja con experiencias interactivas</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Beneficios extra */}
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {[
                { icon: CheckCircle2, title: "Sin inversion", desc: "No pagas nada por unirte." },
                { icon: Target, title: "Sin azar ni sorteos", desc: "Tu audiencia compite y gana por desempeno." },
                { icon: Zap, title: "Sin limites de ingresos", desc: "Cuanto mas volumen, mas bonos desbloqueas." },
                { icon: UserPlus, title: "5% sub-creadores", desc: "Invita a otros creadores y gana sobre sus ingresos." },
                { icon: Gift, title: "Recursos exclusivos", desc: "Banners, copys y casos de exito listos para usar." },
                { icon: Trophy, title: "Bonos por volumen", desc: "Hasta $8.850 extra al alcanzar hitos." },
              ].map((b, i) => (
                <div key={i} className="flex gap-3 p-4 rounded-lg border bg-card">
                  <b.icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm mb-1">{b.title}</h4>
                    <p className="text-sm text-muted-foreground">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* FAQ */}
            <div className="mb-16">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
                  <HelpCircle className="h-7 w-7" /> Preguntas frecuentes
                </h2>
              </div>
              <Accordion type="single" collapsible className="max-w-3xl mx-auto">
                <AccordionItem value="q1">
                  <AccordionTrigger>Cuando cobro mis comisiones?</AccordionTrigger>
                  <AccordionContent>
                    Cuando alcanzas el minimo de USD 100 puedes solicitar el pago. Se procesa por transferencia bancaria contra factura, normalmente en 5-7 dias habiles.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q2">
                  <AccordionTrigger>Cuanto duran las comisiones?</AccordionTrigger>
                  <AccordionContent>
                    Recibes el 20% de forma recurrente durante 12 meses por cada usuario o marca que conviertas. Si renuevan, sigues cobrando durante todo ese periodo.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q3">
                  <AccordionTrigger>Necesito un minimo de seguidores?</AccordionTrigger>
                  <AccordionContent>
                    No hay un minimo estricto, pero valoramos la calidad de la comunidad mas que el numero. Aceptamos creadores desde 1.000 seguidores activos.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q4">
                  <AccordionTrigger>Puedo invitar a otros creadores?</AccordionTrigger>
                  <AccordionContent>
                    Si. Tienes un link especifico para invitar creadores y ganas un 5% adicional sobre todos sus ingresos durante 12 meses, sin afectar sus comisiones.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q5">
                  <AccordionTrigger>Puedo combinar las 3 vias de ingreso?</AccordionTrigger>
                  <AccordionContent>
                    Si, y de hecho lo recomendamos. Premium B2C + B2B + Eventos + sub-creadores se acumulan, y desbloqueas bonos por volumen en cada via.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q6">
                  <AccordionTrigger>Que pasa si mi solicitud es rechazada?</AccordionTrigger>
                  <AccordionContent>
                    Te enviamos feedback por email y puedes volver a aplicar en 90 dias. Habitualmente sugerimos consolidar comunidad o nicho antes de reaplicar.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* CTA final */}
            <Card className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/30">
              <CardContent className="pt-8 pb-8 text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">Listo para empezar a ganar?</h2>
                <p className="text-muted-foreground mb-6">Solicita tu plaza en el programa. Sin coste y sin compromiso.</p>
                <Button size="lg" className="gap-2" onClick={() => setStatus("applying")}>
                  <Rocket className="h-4 w-4" /> Aplicar al Creators Program
                </Button>
                <p className="text-xs text-muted-foreground mt-3">Pagos por transferencia. Minimo de retiro: USD 100.</p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  // ============ APPLYING / FORMULARIO ============
  if (status === "applying") {
    const totalSteps = 3;
    return (
      <div className="min-h-screen bg-background">
        <Header isLoggedIn={isLoggedIn} user={user ? { name: user.name, username: `@${user.username}`, avatar: user.avatar } : undefined} />
        <main className="container py-8">
          <div className="max-w-3xl mx-auto">
            <Button variant="ghost" size="sm" className="mb-4 gap-2" onClick={() => setStatus("intro")}>
              <ArrowLeft className="h-4 w-4" /> Volver
            </Button>

            <div className="mb-6">
              <Badge className="mb-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                <Sparkles className="h-3 w-3 mr-1" /> Solicitud de Partner
              </Badge>
              <h1 className="text-3xl font-bold mb-2">Cuentanos sobre ti</h1>
              <p className="text-muted-foreground">Esta info nos ayuda a conocer tu perfil y dar el mejor soporte.</p>
            </div>

            {/* Stepper */}
            <div className="flex items-center gap-2 mb-8">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex-1">
                  <div className={`h-2 rounded-full ${s <= applyStep ? "bg-primary" : "bg-muted"}`} />
                  <p className={`text-xs mt-1.5 ${s <= applyStep ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                    Paso {s}: {s === 1 ? "Tu perfil" : s === 2 ? "Redes y alcance" : "Audiencia y motivacion"}
                  </p>
                </div>
              ))}
            </div>

            <Card>
              <CardContent className="pt-6 space-y-5">
                {/* Paso 1: Datos basicos */}
                {applyStep === 1 && (
                  <>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Nombre completo *</Label>
                        <Input id="fullName" value={form.fullName} onChange={(e) => updateForm("fullName", e.target.value)} placeholder="Tu nombre" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email de contacto *</Label>
                        <Input id="email" type="email" value={form.email} onChange={(e) => updateForm("email", e.target.value)} placeholder="tu@email.com" />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Pais *</Label>
                        <Select value={form.country} onValueChange={(v) => updateForm("country", v)}>
                          <SelectTrigger><SelectValue placeholder="Selecciona pais" /></SelectTrigger>
                          <SelectContent>
                            {["Argentina", "Mexico", "Espana", "Colombia", "Chile", "Peru", "Estados Unidos", "Brasil", "Uruguay", "Otro"].map((c) => (
                              <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Tipo de creador *</Label>
                        <Select value={form.creatorType} onValueChange={(v) => updateForm("creatorType", v)}>
                          <SelectTrigger><SelectValue placeholder="Selecciona uno" /></SelectTrigger>
                          <SelectContent>
                            {["Streamer", "YouTuber", "TikToker", "Instagrammer", "Podcaster", "Blogger", "Comunidad/Discord", "Otro"].map((c) => (
                              <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Nicho principal *</Label>
                      <Select value={form.niche} onValueChange={(v) => updateForm("niche", v)}>
                        <SelectTrigger><SelectValue placeholder="Tu tematica principal" /></SelectTrigger>
                        <SelectContent>
                          {["Gaming", "Lifestyle", "Tech", "Entretenimiento", "Deportes", "Musica", "Educacion", "Finanzas", "Viajes", "Otro"].map((c) => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {/* Paso 2: Redes y alcance */}
                {applyStep === 2 && (
                  <>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Plataforma principal *</Label>
                        <Select value={form.mainPlatform} onValueChange={(v) => updateForm("mainPlatform", v)}>
                          <SelectTrigger><SelectValue placeholder="Donde estas mas activo" /></SelectTrigger>
                          <SelectContent>
                            {["Instagram", "TikTok", "YouTube", "Twitch", "Twitter/X", "Discord", "Otro"].map((c) => (
                              <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="followers">Seguidores totales (suma todas) *</Label>
                        <Input id="followers" type="number" value={form.followersTotal || ""} onChange={(e) => updateForm("followersTotal", parseInt(e.target.value) || 0)} placeholder="ej: 25000" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="avgViews">Visualizaciones medias por publicacion</Label>
                      <Input id="avgViews" type="number" value={form.avgViews || ""} onChange={(e) => updateForm("avgViews", parseInt(e.target.value) || 0)} placeholder="ej: 5000" />
                    </div>

                    <div className="pt-2 border-t">
                      <Label className="text-base mb-3 block">Tus perfiles (al menos uno) *</Label>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Instagram className="h-4 w-4 text-pink-500 shrink-0" />
                          <Input value={form.instagram} onChange={(e) => updateForm("instagram", e.target.value)} placeholder="@usuario o URL" />
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 shrink-0 flex items-center justify-center text-xs font-bold">TT</div>
                          <Input value={form.tiktok} onChange={(e) => updateForm("tiktok", e.target.value)} placeholder="@usuario o URL TikTok" />
                        </div>
                        <div className="flex items-center gap-2">
                          <Youtube className="h-4 w-4 text-red-500 shrink-0" />
                          <Input value={form.youtube} onChange={(e) => updateForm("youtube", e.target.value)} placeholder="URL canal YouTube" />
                        </div>
                        <div className="flex items-center gap-2">
                          <Twitter className="h-4 w-4 text-blue-400 shrink-0" />
                          <Input value={form.twitter} onChange={(e) => updateForm("twitter", e.target.value)} placeholder="@usuario o URL X/Twitter" />
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 shrink-0 flex items-center justify-center text-xs font-bold text-purple-500">Tw</div>
                          <Input value={form.twitch} onChange={(e) => updateForm("twitch", e.target.value)} placeholder="URL canal Twitch" />
                        </div>
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                          <Input value={form.website} onChange={(e) => updateForm("website", e.target.value)} placeholder="Web personal (opcional)" />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Paso 3: Audiencia y motivacion */}
                {applyStep === 3 && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="audience">Describe a tu audiencia *</Label>
                      <Textarea id="audience" value={form.audienceDescription} onChange={(e) => updateForm("audienceDescription", e.target.value)} placeholder="Edad, intereses, paises principales, nivel de engagement..." className="min-h-[100px]" maxLength={500} />
                      <p className="text-xs text-muted-foreground">{form.audienceDescription.length}/500 (min. 20 caracteres)</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="motivation">Por que quieres unirte? *</Label>
                      <Textarea id="motivation" value={form.motivation} onChange={(e) => updateForm("motivation", e.target.value)} placeholder="Que valor crees que aporta Legendaryum a tu comunidad?" className="min-h-[100px]" maxLength={500} />
                      <p className="text-xs text-muted-foreground">{form.motivation.length}/500 (min. 20 caracteres)</p>
                    </div>

                    <div className="space-y-2">
                      <Label>Experiencia previa con monetizacion</Label>
                      <Select value={form.monetizationExperience} onValueChange={(v) => updateForm("monetizationExperience", v)}>
                        <SelectTrigger><SelectValue placeholder="Opcional" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Ninguna, esta es mi primera vez</SelectItem>
                          <SelectItem value="some">He hecho colaboraciones puntuales</SelectItem>
                          <SelectItem value="experienced">Trabajo con marcas regularmente</SelectItem>
                          <SelectItem value="expert">Vivo de la creacion de contenido</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-start gap-2 pt-2 border-t">
                      <Checkbox id="terms" checked={form.acceptsTerms} onCheckedChange={(v) => updateForm("acceptsTerms", v === true)} className="mt-1" />
                      <Label htmlFor="terms" className="text-sm font-normal cursor-pointer">
                        Acepto los terminos del Creators Program y autorizo el procesamiento de mis datos para evaluar mi solicitud. *
                      </Label>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => applyStep > 1 ? setApplyStep(applyStep - 1) : setStatus("intro")} className="gap-2">
                <ArrowLeft className="h-4 w-4" /> {applyStep === 1 ? "Cancelar" : "Anterior"}
              </Button>
              {applyStep < totalSteps ? (
                <Button onClick={() => setApplyStep(applyStep + 1)} disabled={!canAdvance} className="gap-2">
                  Siguiente <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={submitApplication} className="gap-2">
                  <Rocket className="h-4 w-4" /> Enviar solicitud
                </Button>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ============ PENDING / EN REVISION ============
  if (status === "pending") {
    return (
      <div className="min-h-screen bg-background">
        <Header isLoggedIn={isLoggedIn} user={user ? { name: user.name, username: `@${user.username}`, avatar: user.avatar } : undefined} />
        <main className="container py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 mx-auto flex items-center justify-center mb-6 animate-pulse">
              <Clock className="h-10 w-10 text-white" />
            </div>
            <Badge className="mb-4 bg-amber-500/10 text-amber-600 border-amber-500/30 dark:text-amber-400">
              Estado: En revision
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Solicitud enviada con exito!</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Hemos recibido tu solicitud, <strong>{form.fullName}</strong>. Nuestro equipo la esta revisando y te enviaremos la respuesta a <strong>{form.email}</strong> en menos de 48h.
            </p>

            <Card className="text-left mb-6">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Info className="h-4 w-4 text-primary" /> Que pasa ahora?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { icon: Mail, title: "Revisamos tu perfil", desc: "Analizamos tu contenido, redes y encaje con la plataforma.", done: true },
                  { icon: CheckCircle2, title: "Decision en 48h", desc: "Recibiras un email con el resultado y los siguientes pasos.", done: false },
                  { icon: Rocket, title: "Activamos tu cuenta", desc: "Si eres aprobado, recibes tu link de partner y acceso al dashboard.", done: false },
                ].map((s, i) => (
                  <div key={i} className="flex gap-3">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${s.done ? "bg-green-500/10" : "bg-primary/10"}`}>
                      <s.icon className={`h-4 w-4 ${s.done ? "text-green-500" : "text-primary"}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm">{s.title}</p>
                        {s.done && <Badge variant="outline" className="text-xs h-5 border-green-500/30 text-green-600 dark:text-green-400">Hecho</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="mb-6 border-dashed border-amber-500/40 bg-amber-500/5">
              <CardContent className="pt-6 text-left">
                <p className="text-sm font-semibold mb-1 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-500" /> Modo demo
                </p>
                <p className="text-sm text-muted-foreground">
                  Para probar el flujo completo, simula la aprobacion del equipo y entra directamente al dashboard de Creator Partner.
                </p>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" onClick={() => setStatus("intro")}>Volver al inicio</Button>
              <Button onClick={simulateApproval} className="gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90 text-white">
                <CheckCircle2 className="h-4 w-4" /> Simular aprobacion del equipo
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ============ APPROVED / DASHBOARD ============
  const onboardingSteps = [
    { title: "Bienvenido al programa!", desc: "Eres oficialmente Creator Partner de Legendaryum. Te llevamos en un tour rapido (30s).", icon: Sparkles },
    { title: "Tu link de afiliado", desc: "Compartelo en bio, stories y videos. Cada conversion te genera 20% recurrente durante 12 meses.", icon: Link2 },
    { title: "3 vias de ingreso", desc: "Premium B2C, marcas B2B y eventos pay-to-enter. Combinarlas multiplica tus ingresos.", icon: TrendingUp },
    { title: "Bonos y sub-creadores", desc: "Desbloquea bonos por volumen e invita a otros creadores para ganar 5% extra sobre sus ingresos.", icon: Trophy },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header isLoggedIn={isLoggedIn} user={user ? { name: user.name, username: `@${user.username}`, avatar: user.avatar } : undefined} />

      {/* Onboarding Modal */}
      <Dialog open={showOnboarding} onOpenChange={setShowOnboarding}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-3">
              {(() => {
                const Icon = onboardingSteps[onboardingStep].icon;
                return <Icon className="h-7 w-7 text-white" />;
              })()}
            </div>
            <DialogTitle className="text-2xl">{onboardingSteps[onboardingStep].title}</DialogTitle>
            <DialogDescription className="text-base pt-1">
              {onboardingSteps[onboardingStep].desc}
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-1.5 my-2">
            {onboardingSteps.map((_, i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= onboardingStep ? "bg-primary" : "bg-muted"}`} />
            ))}
          </div>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="ghost" onClick={() => setShowOnboarding(false)}>Saltar</Button>
            {onboardingStep < onboardingSteps.length - 1 ? (
              <Button onClick={() => setOnboardingStep(onboardingStep + 1)} className="gap-2">
                Siguiente <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={() => setShowOnboarding(false)} className="gap-2">
                <Rocket className="h-4 w-4" /> Empezar a ganar
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <main className="container py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                <Crown className="h-3 w-3 mr-1" /> Creator Partner
              </Badge>
              <Badge variant="outline">20% comision · 5% sub-creadores</Badge>
            </div>
            <h1 className="text-3xl font-bold">Creators Program</h1>
            <p className="text-muted-foreground">Tu panel de partner de Legendaryum</p>
          </div>
          <Button variant="outline" className="gap-2" disabled={metrics.pendingPayout < 100}>
            <Wallet className="h-4 w-4" /> Solicitar pago {metrics.pendingPayout < 100 && "(min. $100)"}
          </Button>
        </div>

        {/* KPIs principales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { icon: Link2, label: "Clicks", value: metrics.clicks.toLocaleString(), color: "text-blue-500" },
            { icon: Users, label: "Registros", value: metrics.signups.toLocaleString(), color: "text-purple-500" },
            { icon: TrendingUp, label: "Tasa conversion", value: `${metrics.conversionRate}%`, color: "text-cyan-500" },
            { icon: DollarSign, label: "Ganancias del mes", value: `$${metrics.earningsThisMonth.toFixed(2)}`, color: "text-green-500" },
          ].map((k, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <k.icon className={`h-4 w-4 ${k.color}`} />
                  <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
                </div>
                <div className="text-2xl font-bold">{k.value}</div>
                <p className="text-xs text-muted-foreground">{k.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Link de afiliado principal */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" /> Tu link de afiliado
            </CardTitle>
            <CardDescription>
              Compartelo en redes. Tu audiencia obtiene <strong>20% de descuento</strong> y tu ganas <strong>20% recurrente durante 12 meses</strong>.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input value={referralLink} readOnly className="font-mono text-sm" />
              <Button onClick={() => copyLink(referralLink, "Link")} className="gap-2 shrink-0">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copiado" : "Copiar"}
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="gap-2" onClick={() => shareTo("twitter", referralLink)}>
                <Twitter className="h-4 w-4" /> Twitter
              </Button>
              <Button variant="outline" size="sm" className="gap-2" onClick={() => shareTo("facebook", referralLink)}>
                <Facebook className="h-4 w-4" /> Facebook
              </Button>
              <Button variant="outline" size="sm" className="gap-2" onClick={() => shareTo("telegram", referralLink)}>
                <Send className="h-4 w-4" /> Telegram
              </Button>
              <Button variant="outline" size="sm" className="gap-2" onClick={() => shareTo("whatsapp", referralLink)}>
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="streams" className="space-y-4">
          <TabsList>
            <TabsTrigger value="streams">Vias de ingreso</TabsTrigger>
            <TabsTrigger value="bonuses">Bonos por volumen</TabsTrigger>
            <TabsTrigger value="conversions">Conversiones</TabsTrigger>
            <TabsTrigger value="creators">Sub-creadores</TabsTrigger>
            <TabsTrigger value="earnings">Ganancias</TabsTrigger>
            <TabsTrigger value="resources">Recursos</TabsTrigger>
          </TabsList>

          {/* 3 vias de ingreso */}
          <TabsContent value="streams">
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Crown className="h-4 w-4 text-blue-500" /> Premium B2C
                    </CardTitle>
                    <Badge variant="secondary">20% · 12m</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Conversiones</p>
                    <p className="text-2xl font-bold">{metrics.premiumConversions}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Generado</p>
                    <p className="text-lg font-semibold text-green-500">${metrics.premiumEarnings.toFixed(2)}</p>
                  </div>
                  <p className="text-xs text-muted-foreground border-t pt-2">
                    iPhone, PS5, viajes y giftcards. Audiencia: 20% off.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-purple-500" /> Marcas B2B
                    </CardTitle>
                    <Badge variant="secondary">20% · 12m</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Marcas suscritas</p>
                    <p className="text-2xl font-bold">{metrics.brandConversions}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Generado</p>
                    <p className="text-lg font-semibold text-green-500">${metrics.brandEarnings.toFixed(2)}</p>
                  </div>
                  <p className="text-xs text-muted-foreground border-t pt-2">
                    Planes Growth o Scale. Marca: 20% off.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Ticket className="h-4 w-4 text-orange-500" /> Eventos
                    </CardTitle>
                    <Badge variant="secondary">20% por ticket</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Tickets vendidos</p>
                    <p className="text-2xl font-bold">{metrics.ticketsSold}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Generado</p>
                    <p className="text-lg font-semibold text-green-500">${metrics.eventsEarnings.toFixed(2)}</p>
                  </div>
                  <p className="text-xs text-muted-foreground border-t pt-2">
                    Champions, NBA, F1, conciertos VIP. Audiencia: 20% off.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Bonos por volumen */}
          <TabsContent value="bonuses">
            <div className="space-y-6">
              {nextPremiumBonus && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Crown className="h-4 w-4 text-blue-500" /> Bonos Premium B2C
                      </CardTitle>
                      <Badge variant="outline">Hasta $15.000 extra</Badge>
                    </div>
                    <CardDescription>
                      Proximo bono: <strong>${nextPremiumBonus.bonus}</strong> al alcanzar {nextPremiumBonus.users.toLocaleString()} usuarios
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Progress value={(metrics.premiumConversions / nextPremiumBonus.users) * 100} className="h-2" />
                    <p className="text-xs text-muted-foreground">{metrics.premiumConversions} / {nextPremiumBonus.users.toLocaleString()}</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
                      {PREMIUM_BONUSES.map((b) => {
                        const reached = metrics.premiumConversions >= b.users;
                        return (
                          <div key={b.users} className={`p-3 rounded-lg border text-center ${reached ? "bg-green-500/10 border-green-500/30" : ""}`}>
                            <p className="text-xs text-muted-foreground">{b.users.toLocaleString()} usuarios</p>
                            <p className={`font-bold ${reached ? "text-green-500" : ""}`}>${b.bonus.toLocaleString()}</p>
                            {reached && <CheckCircle2 className="h-3 w-3 text-green-500 mx-auto mt-1" />}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {nextB2BBonus && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-purple-500" /> Bonos B2B
                      </CardTitle>
                      <Badge variant="outline">Hasta $10.000 extra</Badge>
                    </div>
                    <CardDescription>
                      Proximo bono: <strong>${nextB2BBonus.bonus}</strong> al alcanzar {nextB2BBonus.brands} marcas
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Progress value={(metrics.brandConversions / nextB2BBonus.brands) * 100} className="h-2" />
                    <p className="text-xs text-muted-foreground">{metrics.brandConversions} / {nextB2BBonus.brands}</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
                      {B2B_BONUSES.map((b) => {
                        const reached = metrics.brandConversions >= b.brands;
                        return (
                          <div key={b.brands} className={`p-3 rounded-lg border text-center ${reached ? "bg-green-500/10 border-green-500/30" : ""}`}>
                            <p className="text-xs text-muted-foreground">{b.brands} marcas</p>
                            <p className={`font-bold ${reached ? "text-green-500" : ""}`}>${b.bonus.toLocaleString()}</p>
                            {reached && <CheckCircle2 className="h-3 w-3 text-green-500 mx-auto mt-1" />}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {nextEventsBonus && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Ticket className="h-4 w-4 text-orange-500" /> Bonos Eventos
                      </CardTitle>
                      <Badge variant="outline">Hasta $15.000 extra</Badge>
                    </div>
                    <CardDescription>
                      Proximo bono: <strong>${nextEventsBonus.bonus}</strong> al alcanzar {nextEventsBonus.tickets.toLocaleString()} tickets
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Progress value={(metrics.ticketsSold / nextEventsBonus.tickets) * 100} className="h-2" />
                    <p className="text-xs text-muted-foreground">{metrics.ticketsSold} / {nextEventsBonus.tickets.toLocaleString()}</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
                      {EVENTS_BONUSES.map((b) => {
                        const reached = metrics.ticketsSold >= b.tickets;
                        return (
                          <div key={b.tickets} className={`p-3 rounded-lg border text-center ${reached ? "bg-green-500/10 border-green-500/30" : ""}`}>
                            <p className="text-xs text-muted-foreground">{b.tickets.toLocaleString()} tickets</p>
                            <p className={`font-bold ${reached ? "text-green-500" : ""}`}>${b.bonus.toLocaleString()}</p>
                            {reached && <CheckCircle2 className="h-3 w-3 text-green-500 mx-auto mt-1" />}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Conversiones */}
          <TabsContent value="conversions">
            <Card>
              <CardHeader>
                <CardTitle>Conversiones recientes</CardTitle>
                <CardDescription>Premium, marcas, tickets y sub-creadores en un solo lugar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentConversions.map((r) => (
                    <div key={r.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          r.source === "premium" ? "bg-blue-500/10" :
                          r.source === "b2b" ? "bg-purple-500/10" :
                          r.source === "event" ? "bg-orange-500/10" :
                          "bg-amber-500/10"
                        }`}>
                          {r.source === "premium" && <Crown className="h-4 w-4 text-blue-500" />}
                          {r.source === "b2b" && <Building2 className="h-4 w-4 text-purple-500" />}
                          {r.source === "event" && <Ticket className="h-4 w-4 text-orange-500" />}
                          {r.source === "creator" && <UserPlus className="h-4 w-4 text-amber-500" />}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{r.name}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> {r.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">{r.type}</Badge>
                        <span className="text-sm font-bold text-green-500">+${r.commission.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sub-creadores */}
          <TabsContent value="creators">
            <Card className="mb-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-amber-500" /> Creator Referral Program
                </CardTitle>
                <CardDescription>
                  Invita a otros creadores y gana <strong>5% extra</strong> sobre todos sus ingresos durante 12 meses, sin afectar sus comisiones.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input value={creatorReferralLink} readOnly className="font-mono text-sm" />
                  <Button onClick={() => copyLink(creatorReferralLink, "Link de creadores")} className="gap-2 shrink-0">
                    <Copy className="h-4 w-4" /> Copiar
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border bg-background">
                    <p className="text-xs text-muted-foreground">Creadores referidos</p>
                    <p className="text-2xl font-bold">{metrics.referredCreators}</p>
                  </div>
                  <div className="p-4 rounded-lg border bg-background">
                    <p className="text-xs text-muted-foreground">Ganancias 5% override</p>
                    <p className="text-2xl font-bold text-green-500">${metrics.creatorReferralEarnings.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Ganancias */}
          <TabsContent value="earnings">
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Disponible para retirar</CardDescription>
                  <CardTitle className="text-3xl text-green-500">${metrics.pendingPayout.toFixed(2)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" disabled={metrics.pendingPayout < 100}>
                    {metrics.pendingPayout < 100 ? `Min. $100 (faltan $${(100 - metrics.pendingPayout).toFixed(2)})` : "Solicitar pago"}
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Ganancias del mes</CardDescription>
                  <CardTitle className="text-3xl">${metrics.earningsThisMonth.toFixed(2)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">Pago por transferencia contra factura</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total ganado historico</CardDescription>
                  <CardTitle className="text-3xl">${metrics.earningsTotal.toFixed(2)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">Desde que te uniste al programa</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Desglose por via</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Crown className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Premium B2C ({metrics.premiumConversions} conversiones)</span>
                  </div>
                  <span className="font-semibold text-green-500">${metrics.premiumEarnings.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Marcas B2B ({metrics.brandConversions} marcas)</span>
                  </div>
                  <span className="font-semibold text-green-500">${metrics.brandEarnings.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Ticket className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">Eventos ({metrics.ticketsSold} tickets)</span>
                  </div>
                  <span className="font-semibold text-green-500">${metrics.eventsEarnings.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <UserPlus className="h-4 w-4 text-amber-500" />
                    <span className="text-sm">Sub-creadores 5% ({metrics.referredCreators})</span>
                  </div>
                  <span className="font-semibold text-green-500">${metrics.creatorReferralEarnings.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-4 bg-muted/50">
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p><strong>Condiciones:</strong> Pagos por transferencia contra factura. Minimo de retiro: USD 100.</p>
                    <p>No se permiten auto-referidos. Solo se contabilizan conversiones reales y verificadas.</p>
                    <p>Comisiones recurrentes durante 12 meses desde cada conversion. Calculadas sobre el importe efectivamente cobrado por Legendaryum.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recursos */}
          <TabsContent value="resources">
            <Card>
              <CardHeader>
                <CardTitle>Recursos para creadores</CardTitle>
                <CardDescription>Materiales listos para compartir con tu comunidad</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                {[
                  { icon: Gift, title: "Banners y assets", desc: "Imagenes y videos para tus redes." },
                  { icon: Star, title: "Guia de buenas practicas", desc: "Como presentar Legendaryum a tu audiencia." },
                  { icon: Sparkles, title: "Plantillas de copy", desc: "Textos optimizados para conversion." },
                  { icon: Trophy, title: "Casos de exito", desc: "Aprende de otros creadores top." },
                ].map((r, i) => (
                  <div key={i} className="flex gap-3 p-4 rounded-lg border hover:border-primary transition-colors cursor-pointer">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <r.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{r.title}</h4>
                      <p className="text-sm text-muted-foreground">{r.desc}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default CreatorProgram;
